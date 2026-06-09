document.addEventListener('DOMContentLoaded', () => {
  const api = ElearningAPI;
  const page = document.body.dataset.page;
  const activeNav = document.body.dataset.nav || page;

  api.renderNav(activeNav);
  api.checkHealth();

  function renderCourseCard(course, options = {}) {
    const id = api.getCourseMongoId(course);
    const detailUrl = api.getCourseDetailUrl(course);
    const title = api.getCourseTitle(course);
    const dept = api.getCourseDepartmentName(course);
    const card = document.createElement('div');
    card.className = 'course-card';
    const enrollBtn = options.showEnroll && (id || course.courseId != null)
      ? `<button type="button" class="btn primary small btn-enroll" data-course-id="${id || course.courseId}">Enroll now</button>`
      : '';
    const detailsBtn = detailUrl
      ? `<a class="btn outline small course-detail-link" href="${detailUrl}">View details</a>`
      : `<span class="muted">Details unavailable</span>`;
    card.innerHTML = `
      <div class="course-card__head">
        <div class="course-card__icon">${api.getCourseInitial(title)}</div>
        <span class="badge badge--primary">${dept}</span>
      </div>
      <strong>${title}</strong>
      <p>${course.description || course.courseName || 'Explore lessons, media, and exams in this course.'}</p>
      <div class="card-actions">
        ${detailsBtn}
        ${enrollBtn}
      </div>
    `;
    const detailLink = card.querySelector('.course-detail-link');
    if (detailLink) {
      detailLink.addEventListener('click', (event) => {
        event.preventDefault();
        api.goToCourseDetail(course);
      });
    }
    return card;
  }

  function attachCourseDetailLinks(container) {
    if (!container) return;
    container.querySelectorAll('.course-detail-link').forEach((link) => {
      if (link.dataset.bound === 'true') return;
      link.dataset.bound = 'true';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        if (href) window.location.href = href;
      });
    });
  }

  async function enrollInCourse(courseId) {
    const studentId = api.getStudentId();
    if (!studentId) {
      api.showToast('Set your student ID on the profile page before enrolling.', 'error');
      window.location.href = 'profile.html';
      return;
    }
    try {
      await api.fetchJson('/student-courses', {
        method: 'POST',
        body: JSON.stringify({
          studentId,
          courseId,
          enrollmentDate: new Date().toISOString(),
          completionStatus: 'not-started',
          progress: 0
        })
      });
      api.showToast('Enrolled successfully!', 'success');
    } catch (error) {
      api.showToast(`Enrollment failed: ${error.message}`, 'error');
    }
  }

  function attachEnrollHandlers(container) {
    container.querySelectorAll('.btn-enroll').forEach((btn) => {
      btn.addEventListener('click', () => enrollInCourse(btn.dataset.courseId));
    });
  }

  async function loadCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) return;
    container.innerHTML = api.renderLoadingSkeletons(3);
    try {
      const result = await api.fetchJson('/courses');
      const courses = api.normalizeList(result);
      container.innerHTML = '';
      container.classList.add('course-list--grid');
      if (!courses.length) {
        container.innerHTML = api.renderEmptyState('No courses available yet. Check back soon.');
        return;
      }
      courses.forEach((course) => container.appendChild(renderCourseCard(course, { showEnroll: true })));
      attachEnrollHandlers(container);
      attachCourseDetailLinks(container);
    } catch (error) {
      container.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadEnrollments() {
    try {
      const result = await api.fetchJson('/student-courses');
      return api.normalizeList(result);
    } catch {
      return [];
    }
  }

  async function loadDashboard() {
    const coursesContainer = document.querySelector('.course-list');
    const summary = document.querySelector('.dashboard-summary');
    const user = api.loadUser();
    const greeting = document.querySelector('.page-hero-inner h1, .page-hero-inner .section-title');
    if (greeting && user) greeting.textContent = `Welcome back, ${user.name || 'Student'}`;

    const [allCourses, enrollments] = await Promise.all([
      api.fetchJson('/courses').then(api.normalizeList).catch(() => []),
      loadEnrollments()
    ]);

    if (coursesContainer) {
      coursesContainer.innerHTML = '';
      const enrolledCourses = enrollments
        .map((e) => (typeof e.courseId === 'object' ? e.courseId : null))
        .filter(Boolean);

      const displayCourses = enrolledCourses.length ? enrolledCourses : allCourses.slice(0, 4);
      if (!displayCourses.length) {
        coursesContainer.innerHTML = `<li>${api.renderEmptyState('No courses yet. Browse the catalog to enroll.', '🎯')}</li>`;
      } else {
        displayCourses.slice(0, 5).forEach((course) => {
          const detailUrl = api.getCourseDetailUrl(course);
          const title = api.getCourseTitle(course);
          const li = document.createElement('li');
          li.className = 'course-card';
          li.innerHTML = `
            <div class="course-card__head">
              <div class="course-card__icon">${api.getCourseInitial(title)}</div>
            </div>
            <strong>${title}</strong>
            <p>${course.description || course.courseName || 'Continue learning.'}</p>
            <div class="card-actions">
              ${detailUrl
                ? `<a class="btn primary small course-detail-link" href="${detailUrl}">Continue</a>`
                : '<span class="muted">Details unavailable</span>'}
            </div>
          `;
          const link = li.querySelector('.course-detail-link');
          if (link) {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              api.goToCourseDetail(course);
            });
          }
          coursesContainer.appendChild(li);
        });
        attachCourseDetailLinks(coursesContainer);
      }
    }

    if (summary) {
      const avgProgress = enrollments.length
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0;
      summary.innerHTML = `
        <div class="summary-card summary-card--primary"><strong>${enrollments.length}</strong><span>Enrolled courses</span></div>
        <div class="summary-card"><strong>${allCourses.length}</strong><span>Available courses</span></div>
        <div class="summary-card"><strong>${avgProgress || 0}%</strong><span>Average progress</span></div>
      `;
    }
  }

  async function loadCourseDetail() {
    const titleEl = document.getElementById('courseTitle');
    const descriptionEl = document.getElementById('courseDescription');
    const metaEl = document.getElementById('courseMeta');
    const lessonsEl = document.getElementById('courseLessons');
    const mediaEl = document.getElementById('courseMedia');
    const examsEl = document.getElementById('courseExams');
    const actionsEl = document.getElementById('courseActions');
    const messageEl = document.getElementById('courseMessage');

    if (!titleEl) {
      window.location.href = 'courses.html';
      return;
    }

    titleEl.textContent = 'Loading course…';
    const courseId = await api.resolveCourseIdFromQuery();

    if (!courseId) {
      titleEl.textContent = 'Course not found';
      if (descriptionEl) descriptionEl.textContent = 'This course link is invalid or the course was removed.';
      api.showMessage(messageEl, 'Invalid course URL. Please go back to the catalog and choose a course again.', 'error');
      return;
    }

    try {
      const course = await api.fetchJson(`/courses/${courseId}`);
      const courseData = course.data?.course || course;
      const resolvedMongoId = api.getCourseMongoId(courseData) || courseId;

      titleEl.textContent = api.getCourseTitle(courseData);
      if (descriptionEl) {
        descriptionEl.textContent = courseData.description || courseData.courseName || 'No description available.';
      }
      metaEl.innerHTML = `
        <strong>Department</strong>
        <p>${api.getCourseDepartmentName(courseData, 'N/A')}</p>
        <strong>Course ID</strong>
        <p>${resolvedMongoId}</p>
      `;

      if (actionsEl) {
        actionsEl.innerHTML = `
          <button type="button" class="btn primary" id="enrollCourseBtn">Enroll in course</button>
          <a class="btn outline" href="courses.html">Back to catalog</a>
        `;
        document.getElementById('enrollCourseBtn').addEventListener('click', () => {
          enrollInCourse(resolvedMongoId);
        });
      }

      const [detailsResult, mediaResult, examsResult] = await Promise.all([
        api.fetchJson('/course-details').catch(() => []),
        api.fetchJson(`/course-media?courseId=${resolvedMongoId}&limit=50`).catch(() => ({})),
        api.fetchJson('/course-exams').catch(() => [])
      ]);

      const details = api.normalizeList(detailsResult).filter((d) => api.matchesCourseId(d, courseData));
      const media = api.normalizeList(mediaResult).filter((m) => api.matchesCourseId(m, courseData));
      const exams = api.normalizeList(examsResult).filter((e) => api.matchesCourseId(e, courseData));

      if (lessonsEl) {
        if (!details.length) {
          lessonsEl.innerHTML = '<p class="muted">No lessons published yet.</p>';
        } else {
          lessonsEl.innerHTML = details.map((lesson) => `
            <div class="lesson-item">
              <strong>${lesson.title || 'Lesson'}</strong>
              <p>${lesson.description || lesson.content || 'No content preview.'}</p>
              <a class="btn outline small" href="${api.buildPageUrl('course-lesson', { id: lesson._id, courseId: resolvedMongoId })}">Open lesson</a>
            </div>
          `).join('');
        }
      }

      if (mediaEl) {
        if (!media.length) {
          mediaEl.innerHTML = '<p class="muted">No media files uploaded yet.</p>';
        } else {
          mediaEl.innerHTML = media.map((item) => {
            const mediaSrc = item.url || `${api.getApiRoot()}/uploads/${item.filename}`;
            if (item.type === 'video') {
              return `
                <div class="media-item">
                  <strong>${item.title}</strong>
                  <video controls class="media-player" src="${mediaSrc}"></video>
                </div>`;
            }
            if (item.type === 'audio') {
              return `
                <div class="media-item">
                  <strong>${item.title}</strong>
                  <audio controls class="media-player" src="${mediaSrc}"></audio>
                </div>`;
            }
            if (item.type === 'image') {
              return `
                <div class="media-item">
                  <strong>${item.title}</strong>
                  <img class="media-image" src="${mediaSrc}" alt="${item.title}">
                </div>`;
            }
            return `
              <div class="media-item">
                <strong>${item.title}</strong>
                <p>${item.description || ''}</p>
                <a class="btn outline small" href="${mediaSrc}" target="_blank" rel="noopener">Download / View</a>
              </div>`;
          }).join('');
        }
      }

      if (examsEl) {
        if (!exams.length) {
          examsEl.innerHTML = '<p class="muted">No exams for this course yet.</p>';
        } else {
          examsEl.innerHTML = exams.map((exam) => `
            <div class="exam-item">
              <strong>${exam.title}</strong>
              <p>${exam.description || ''}</p>
              <p><small>Marks: ${exam.minDegree || 0}–${exam.maxDegree || exam.totalMarks || 0}</small></p>
              <a class="btn primary small" href="${api.buildPageUrl('exam-take', { id: exam._id })}">Take exam</a>
            </div>
          `).join('');
        }
      }
    } catch (error) {
      titleEl.textContent = 'Unable to load course';
      descriptionEl.textContent = error.message;
      if (messageEl) api.showMessage(messageEl, error.message, 'error');
    }
  }

  async function loadCourseLesson() {
    const lessonId = api.getQueryValue('id');
    const courseId = api.getQueryValue('courseId');
    const titleEl = document.getElementById('lessonTitle');
    const contentEl = document.getElementById('lessonContent');
    const metaEl = document.getElementById('lessonMeta');

    if (!lessonId) {
      window.location.href = 'courses.html';
      return;
    }

    try {
      const lesson = await api.fetchJson(`/course-details/${lessonId}`);
      titleEl.textContent = lesson.title || 'Lesson';
      contentEl.innerHTML = `
        <p>${lesson.description || lesson.content || 'No lesson content available.'}</p>
      `;
      metaEl.innerHTML = `
        <p><strong>Duration:</strong> ${lesson.duration ? `${lesson.duration} min` : 'N/A'}</p>
        ${courseId ? `<a class="btn outline" href="${api.buildPageUrl('course-detail', { id: courseId })}">Back to course</a>` : ''}
      `;
    } catch (error) {
      titleEl.textContent = 'Lesson unavailable';
      contentEl.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  function renderExamCard(exam) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-card__head">
        <div class="course-card__icon">✎</div>
        <span class="badge badge--soft">Exam</span>
      </div>
      <strong>${exam.title}</strong>
      <p>${exam.description || 'Complete this assessment to test your knowledge.'}</p>
      <p><small>Marks: ${exam.minDegree || 0}–${exam.maxDegree || exam.totalMarks || 0}</small></p>
      <div class="card-actions">
        <a class="btn primary small" href="${api.buildPageUrl('exam-take', { id: exam._id })}">Take exam</a>
        <a class="btn outline small" href="${api.buildPageUrl('exam-results', { examId: exam._id })}">View results</a>
      </div>
    `;
    return card;
  }

  async function loadExams() {
    const container = document.getElementById('examsContainer');
    if (!container) return;
    container.innerHTML = api.renderLoadingSkeletons(2);
    try {
      const result = await api.fetchJson('/course-exams');
      const exams = api.normalizeList(result);
      container.innerHTML = '';
      container.classList.add('course-list--grid');
      if (!exams.length) {
        container.innerHTML = api.renderEmptyState('No exams published yet.', '📝');
        return;
      }
      exams.forEach((exam) => container.appendChild(renderExamCard(exam)));
    } catch (error) {
      container.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadExamTake() {
    const examId = api.getQueryValue('id');
    const titleEl = document.getElementById('examTitle');
    const formEl = document.getElementById('examForm');
    const messageEl = document.getElementById('examMessage');

    if (!examId || !formEl) {
      window.location.href = 'exams.html';
      return;
    }

    try {
      const exam = await api.fetchJson(`/course-exams/${examId}`);
      const questionsResult = await api.fetchJson('/exam-questions');
      const questions = api.normalizeList(questionsResult).filter((q) => api.matchesExamId(q, exam));

      titleEl.textContent = exam.title || 'Exam';
      document.getElementById('examDescription').textContent = exam.description || '';

      if (!questions.length) {
        formEl.innerHTML = '<p class="muted">No questions available for this exam.</p>';
        return;
      }

      formEl.innerHTML = questions.map((q, index) => `
        <fieldset class="question-block" data-question-id="${q._id}">
          <legend>Question ${index + 1} (${q.point || q.marks || 1} pts)</legend>
          <p>${q.question}</p>
          <label class="label"><input type="radio" name="q_${q._id}" value="true" required> True</label>
          <label class="label"><input type="radio" name="q_${q._id}" value="false"> False</label>
        </fieldset>
      `).join('') + '<button type="submit" class="btn primary">Submit answers</button>';

      formEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        const studentId = api.getStudentId();
        if (!studentId) {
          api.showToast('Set your student ID on the profile page first.', 'error');
          return;
        }

        const answers = questions.map((q) => {
          const selected = formEl.querySelector(`input[name="q_${q._id}"]:checked`);
          const value = selected?.value === 'true';
          return {
            questionId: q._id,
            answer: value,
            correct: q.rightFlag === value
          };
        });

        const totalScore = answers.filter((a) => a.correct).reduce((sum, a, i) => {
          return sum + (questions[i].point || questions[i].marks || 1);
        }, 0);

        try {
          await api.fetchJson('/exam-answers', {
            method: 'POST',
            body: JSON.stringify({ examId, studentId, answers, totalScore })
          });
          api.showMessage(messageEl, `Exam submitted! Score: ${totalScore}`, 'success');
          setTimeout(() => {
            window.location.href = api.buildPageUrl('exam-results', { examId });
          }, 1500);
        } catch (error) {
          api.showMessage(messageEl, error.message, 'error');
        }
      });
    } catch (error) {
      titleEl.textContent = 'Exam unavailable';
      api.showMessage(messageEl, error.message, 'error');
    }
  }

  async function loadExamResults() {
    const examIdFilter = api.getQueryValue('examId');
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    container.innerHTML = '<p>Loading results…</p>';
    try {
      const [answersResult, examsResult] = await Promise.all([
        api.fetchJson('/exam-answers'),
        api.fetchJson('/course-exams')
      ]);
      const answers = api.normalizeList(answersResult);
      const exams = api.normalizeList(examsResult);
      const studentId = api.getStudentId();

      const filtered = answers.filter((answer) => {
        const matchesStudent = !studentId
          || String(answer.studentId?._id || answer.studentId) === String(studentId);
        const matchesExam = !examIdFilter
          || String(answer.examId?._id || answer.examId) === String(examIdFilter);
        return matchesStudent && (examIdFilter ? matchesExam : true);
      });

      if (!filtered.length) {
        container.innerHTML = '<p>No exam results found yet.</p>';
        return;
      }

      container.innerHTML = filtered.map((answer) => {
        const exam = exams.find((e) => String(e._id) === String(answer.examId?._id || answer.examId));
        return `
          <div class="course-card">
            <strong>${exam?.title || 'Exam result'}</strong>
            <p>Score: ${answer.totalScore ?? answer.degree ?? 'N/A'}</p>
            <p><small>Submitted: ${answer.createdAt ? new Date(answer.createdAt).toLocaleString() : 'N/A'}</small></p>
          </div>`;
      }).join('');
    } catch (error) {
      container.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadProfile() {
    const container = document.getElementById('profileContent');
    const user = api.loadUser();
    if (!user || !container) return;

    const storedStudentId = api.getStudentId();
    container.innerHTML = `
      <div class="course-card profile-card">
        <strong>${user.name || 'User'}</strong>
        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p><strong>Role:</strong> ${user.role || 'student'}</p>
        <p><strong>User ID:</strong> ${user.id || user._id || 'Unknown'}</p>
      </div>
      <div class="course-card">
        <strong>Student ID for enrollments & exams</strong>
        <p class="muted">Use your MongoDB student record ID. Ask an admin to create one if needed.</p>
        <form id="studentIdForm" class="form inline-form">
          <label class="label">Student ID
            <input type="text" id="studentIdInput" value="${storedStudentId || user.id || ''}" placeholder="MongoDB student _id">
          </label>
          <button type="submit" class="btn primary">Save student ID</button>
        </form>
      </div>
      <div id="enrollmentSection"><p>Loading enrollments…</p></div>
    `;

    document.getElementById('studentIdForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const value = document.getElementById('studentIdInput').value.trim();
      if (value) {
        api.setStudentId(value);
        api.showToast('Student ID saved.', 'success');
      }
    });

    const enrollmentSection = document.getElementById('enrollmentSection');
    try {
      const enrollments = await loadEnrollments();
      const mine = enrollments.filter((e) => {
        const sid = e.studentId?._id || e.studentId;
        return String(sid) === String(storedStudentId);
      });
      if (!mine.length) {
        enrollmentSection.innerHTML = '<div class="course-card"><p>No enrollments yet. Browse courses to enroll.</p></div>';
      } else {
        enrollmentSection.innerHTML = `
          <div class="section-title">My enrollments</div>
          ${mine.map((e) => {
            const course = typeof e.courseId === 'object' ? e.courseId : null;
            return `
              <div class="course-card">
                <strong>${course ? api.getCourseTitle(course) : 'Course'}</strong>
                <p>Progress: ${e.progress || 0}% · Status: ${e.completionStatus || 'in-progress'}</p>
                ${course ? `<a class="btn outline small" href="${api.getCourseDetailUrl(course)}">Open course</a>` : ''}
              </div>`;
          }).join('')}
        `;
      }
    } catch (error) {
      enrollmentSection.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadInstructorDashboard() {
    const statsEl = document.getElementById('instructorStats');
    const coursesEl = document.getElementById('instructorCourses');
    const user = api.loadUser();
    const greeting = document.getElementById('instructorGreeting');
    if (greeting && user) greeting.textContent = `Hello, ${user.name}`;

    try {
      const [courses, details, exams, mediaResult] = await Promise.all([
        api.fetchJson('/courses').then(api.normalizeList),
        api.fetchJson('/course-details').then(api.normalizeList).catch(() => []),
        api.fetchJson('/course-exams').then(api.normalizeList).catch(() => []),
        api.fetchJson('/course-media?limit=50').then(api.normalizeList).catch(() => [])
      ]);

      if (statsEl) {
        statsEl.innerHTML = `
          <div class="summary-card"><strong>${courses.length}</strong><span>Courses</span></div>
          <div class="summary-card"><strong>${details.length}</strong><span>Lessons</span></div>
          <div class="summary-card"><strong>${exams.length}</strong><span>Exams</span></div>
          <div class="summary-card"><strong>${mediaResult.length}</strong><span>Media files</span></div>
        `;
      }

      if (coursesEl) {
        coursesEl.innerHTML = courses.length
          ? courses.map((c) => `
              <div class="course-card">
                <strong>${api.getCourseTitle(c)}</strong>
                <a class="btn outline small" href="${api.getCourseDetailUrl(c)}">Manage content</a>
              </div>`).join('')
          : '<p>No courses yet. Use the admin panel to create courses.</p>';
      }
    } catch (error) {
      if (statsEl) statsEl.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  }

  async function loadDepartments() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    try {
      const result = await api.fetchJson('/departments');
      const departments = api.normalizeList(result);
      container.innerHTML = departments.length
        ? departments.map((d) => `
            <span class="dept-tag">${d.departmentName || d.name || 'Department'}</span>
          `).join('')
        : '';
    } catch {
      container.innerHTML = '';
    }
  }

  const pageHandlers = {
    dashboard: () => { if (api.requireAuth()) loadDashboard(); },
    courses: () => { if (api.requireAuth()) { loadCourses(); loadDepartments(); } },
    'course-detail': () => { if (api.requireAuth()) loadCourseDetail(); },
    'course-lesson': () => { if (api.requireAuth()) loadCourseLesson(); },
    exams: () => { if (api.requireAuth()) loadExams(); },
    'exam-take': () => { if (api.requireAuth()) loadExamTake(); },
    'exam-results': () => { if (api.requireAuth()) loadExamResults(); },
    profile: () => { if (api.requireAuth()) loadProfile(); },
    instructor: () => { if (api.requireRole(['instructor', 'admin'])) loadInstructorDashboard(); }
  };

  if (pageHandlers[page]) pageHandlers[page]();
});
