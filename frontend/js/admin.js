const state = {
  apiUrl: localStorage.getItem('adminApiUrl') || 'http://localhost:3000/api/v1',
  // Accept either adminAuthToken (explicit) or the general elearningAuthToken from login
  authToken: localStorage.getItem('adminAuthToken') || localStorage.getItem('elearningAuthToken') || '',
  resource: 'users',
  resources: {
    users: {
      label: 'Users',
      endpoint: 'users',
      fields: [
        {name: 'name', type: 'text', label: 'Name', required: true},
        {name: 'email', type: 'email', label: 'Email', required: true},
        {name: 'password', type: 'password', label: 'Password', required: true},
        {name: 'role', type: 'text', label: 'Role', required: true, placeholder: 'student/instructor/admin'}
      ]
    },
    courses: {
      label: 'Courses',
      endpoint: 'courses',
      fields: [
        {name: 'title', type: 'text', label: 'Title', required: true},
        {name: 'description', type: 'text', label: 'Description', required: true},
        {name: 'departmentId', type: 'text', label: 'Department ID', required: true, placeholder: 'Mongo ID'},
        {name: 'instructorId', type: 'text', label: 'Instructor ID', placeholder: 'Mongo ID'},
        {name: 'duration', type: 'number', label: 'Duration (days)'},
        {name: 'price', type: 'number', label: 'Price'},
        {name: 'level', type: 'text', label: 'Level', placeholder: 'beginner/intermediate/advanced'}
      ]
    },
    departments: {
      label: 'Departments',
      endpoint: 'departments',
      fields: [
        {name: 'name', type: 'text', label: 'Department Name', required: true},
        {name: 'description', type: 'text', label: 'Description'},
        {name: 'headId', type: 'text', label: 'Head User ID', placeholder: 'Mongo ID'}
      ]
    },
    instructors: {
      label: 'Instructors',
      endpoint: 'instructors',
      fields: [
        {name: 'userId', type: 'text', label: 'User ID', required: true, placeholder: 'Mongo ID'},
        {name: 'specialization', type: 'text', label: 'Specialization'},
        {name: 'bio', type: 'text', label: 'Bio'},
        {name: 'experience', type: 'number', label: 'Experience (years)'}
      ]
    },
    students: {
      label: 'Students',
      endpoint: 'students',
      fields: [
        {name: 'userId', type: 'text', label: 'User ID', required: true, placeholder: 'Mongo ID'},
        {name: 'enrollmentYear', type: 'number', label: 'Enrollment Year'},
        {name: 'gpa', type: 'number', label: 'GPA', step: '0.01'}
      ]
    },
    'student-courses': {
      label: 'Student Courses',
      endpoint: 'student-courses',
      fields: [
        {name: 'studentId', type: 'text', label: 'Student ID', required: true, placeholder: 'Mongo ID'},
        {name: 'courseId', type: 'text', label: 'Course ID', required: true, placeholder: 'Mongo ID'},
        {name: 'enrollmentDate', type: 'date', label: 'Enrollment Date'},
        {name: 'completionStatus', type: 'text', label: 'Completion Status', placeholder: 'not-started/in-progress/completed'},
        {name: 'progress', type: 'number', label: 'Progress (%)'}
      ]
    },
    'course-details': {
      label: 'Course Details',
      endpoint: 'course-details',
      fields: [
        {name: 'courseId', type: 'text', label: 'Course ID', required: true, placeholder: 'Mongo ID'},
        {name: 'title', type: 'text', label: 'Title', required: true},
        {name: 'content', type: 'text', label: 'Content', required: true},
        {name: 'contentType', type: 'text', label: 'Content Type', placeholder: 'text/video/quiz/assignment', required: true},
        {name: 'order', type: 'number', label: 'Order', required: true},
        {name: 'duration', type: 'number', label: 'Duration (minutes)'}
      ]
    },
    'course-exams': {
      label: 'Course Exams',
      endpoint: 'course-exams',
      fields: [
        {name: 'courseId', type: 'text', label: 'Course ID', required: true, placeholder: 'Mongo ID'},
        {name: 'title', type: 'text', label: 'Title', required: true},
        {name: 'description', type: 'text', label: 'Description'},
        {name: 'duration', type: 'number', label: 'Duration (minutes)', required: true},
        {name: 'totalMarks', type: 'number', label: 'Total Marks', required: true},
        {name: 'passingMarks', type: 'number', label: 'Passing Marks'},
        {name: 'examDate', type: 'date', label: 'Exam Date'}
      ]
    },
    'exam-questions': {
      label: 'Exam Questions',
      endpoint: 'exam-questions',
      fields: [
        {name: 'examId', type: 'text', label: 'Exam ID', required: true, placeholder: 'Mongo ID'},
        {name: 'question', type: 'text', label: 'Question', required: true},
        {name: 'questionType', type: 'text', label: 'Question Type', placeholder: 'multiple-choice/true-false/short-answer', required: true},
        {name: 'options', type: 'text', label: 'Options (comma separated)'},
        {name: 'correctAnswer', type: 'text', label: 'Correct Answer'},
        {name: 'marks', type: 'number', label: 'Marks', required: true}
      ]
    },
    'exam-answers': {
      label: 'Exam Answers',
      endpoint: 'exam-answers',
      fields: [
        {name: 'examId', type: 'text', label: 'Exam ID', required: true, placeholder: 'Mongo ID'},
        {name: 'studentId', type: 'text', label: 'Student ID', required: true, placeholder: 'Mongo ID'},
        {name: 'answers', type: 'text', label: 'Answers (comma separated)', required: true},
        {name: 'totalScore', type: 'number', label: 'Total Score'}
      ]
    },
    'course-media': {
      label: 'Course Media',
      endpoint: 'course-media',
      fields: [
        {name: 'courseId', type: 'text', label: 'Course ID', required: true, placeholder: 'Mongo ID'},
        {name: 'title', type: 'text', label: 'Title', required: true},
        {name: 'description', type: 'text', label: 'Description'},
        {name: 'type', type: 'text', label: 'Media Type', placeholder: 'video/audio/document/image', required: true},
        {name: 'duration', type: 'number', label: 'Duration (seconds)'},
        {name: 'order', type: 'number', label: 'Order'},
        {name: 'file', type: 'file', label: 'File'}
      ],
      uploadPath: 'course-media'
    }
  }
};

const elements = {
  resourceNav: document.getElementById('resourceNav'),
  resourceLabel: document.getElementById('resourceLabel'),
  apiUrl: document.getElementById('apiUrl'),
  authToken: document.getElementById('authToken'),
  saveToken: document.getElementById('saveToken'),
  clearToken: document.getElementById('clearToken'),
  refreshBtn: document.getElementById('refreshBtn'),
  clearFormBtn: document.getElementById('clearFormBtn'),
  resourceList: document.getElementById('resourceList'),
  resourceForm: document.getElementById('resourceForm'),
  resourceMessage: document.getElementById('resourceMessage')
};

// optional header elements
elements.adminName = document.getElementById('adminName');
elements.adminEmail = document.getElementById('adminEmail');
elements.apiStatus = document.getElementById('apiStatus');
elements.adminSearch = document.getElementById('adminSearch');
elements.searchBtn = document.getElementById('searchBtn');
elements.newResourceBtn = document.getElementById('newResourceBtn');
elements.openLogs = document.getElementById('openLogs');
elements.clearCache = document.getElementById('clearCache');
elements.loginEmail = document.getElementById('loginEmail');
elements.loginPassword = document.getElementById('loginPassword');
elements.loginBtn = document.getElementById('loginBtn');

function setMessage(message, type = 'info') {
  elements.resourceMessage.textContent = message;
  elements.resourceMessage.className = `info-message ${type}`;
}

function getHeaders() {
  const headers = {'Content-Type': 'application/json'};
  if (state.authToken) {
    // allow passing either the raw token or a full 'Bearer <token>' value
    headers.Authorization = state.authToken.startsWith('Bearer ') ? state.authToken : `Bearer ${state.authToken}`;
  }
  return headers;
}

function buildNav() {
  elements.resourceNav.innerHTML = '';
  Object.keys(state.resources).forEach((key) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'resource-link';
    button.textContent = state.resources[key].label;
    if (key === state.resource) button.classList.add('active');
    button.addEventListener('click', () => {
      state.resource = key;
      renderResource();
    });
    elements.resourceNav.appendChild(button);
  });
}

function parseResponse(res) {
  if (!res.ok) return res.json().then((body) => Promise.reject(body));
  return res.json();
}

function getFetchUrl(path) {
  return `${state.apiUrl}/${path}`;
}

async function fetchList() {
  setMessage('Loading records...', 'info');
  const endpoint = state.resources[state.resource].endpoint;
  const path = state.resource === 'course-media' ? endpoint : endpoint;
  try {
    const response = await fetch(getFetchUrl(path), {headers: getHeaders()});
    const data = await parseResponse(response);
    const list = data.data || data;
    renderList(list);
    setMessage(`Loaded ${Array.isArray(list) ? list.length : 0} records.`, 'success');
  } catch (error) {
    console.error(error);
    setMessage(error.message || JSON.stringify(error), 'error');
    elements.resourceList.innerHTML = '<p class="muted">Unable to load records.</p>';
  }
}

function getDisplayFields(item) {
  return Object.keys(item).filter((key) => key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'password');
}

function renderList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    elements.resourceList.innerHTML = '<p class="muted">No items found.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'data-table';
  const headerRow = document.createElement('tr');
  const fields = getDisplayFields(items[0]).slice(0, 6);
  fields.forEach((field) => {
    const th = document.createElement('th');
    th.textContent = field;
    headerRow.appendChild(th);
  });
  headerRow.appendChild(document.createElement('th'));
  table.appendChild(headerRow);

  items.forEach((item) => {
    const row = document.createElement('tr');
    fields.forEach((field) => {
      const td = document.createElement('td');
      td.textContent = item[field] === undefined ? '' : item[field];
      row.appendChild(td);
    });
    const actions = document.createElement('td');
    actions.className = 'row-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'btn outline small';
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => populateForm(item));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn outline small danger';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => deleteItem(item._id || item.id || item.userId || item.courseId || item.examId));
    actions.appendChild(edit);
    actions.appendChild(remove);
    row.appendChild(actions);
    table.appendChild(row);
  });

  elements.resourceList.innerHTML = '';
  elements.resourceList.appendChild(table);
}

function populateForm(item = null) {
  const fields = state.resources[state.resource].fields;
  elements.resourceForm.innerHTML = '';
  const formHeading = document.createElement('h3');
  formHeading.textContent = item ? 'Update record' : 'Create record';
  elements.resourceForm.appendChild(formHeading);

  fields.forEach((field) => {
    const fieldWrapper = document.createElement('label');
    fieldWrapper.className = 'label';
    fieldWrapper.textContent = field.label;
    const input = document.createElement('input');
    input.name = field.name;
    input.type = field.type;
    input.placeholder = field.placeholder || '';
    if (field.step) input.step = field.step;
    if (field.required) input.required = true;
    if (field.type === 'checkbox') {
      input.checked = item ? !!item[field.name] : false;
      fieldWrapper.appendChild(input);
    } else {
      if (item && item[field.name] !== undefined && item[field.name] !== null) {
        input.value = field.type === 'date' ? item[field.name].substring(0, 10) : item[field.name];
      }
      fieldWrapper.appendChild(input);
    }
    elements.resourceForm.appendChild(fieldWrapper);
  });

  if (item && item._id) {
    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.name = 'recordId';
    idInput.value = item._id;
    elements.resourceForm.appendChild(idInput);
  }

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn primary';
  submit.textContent = item ? 'Update' : 'Create';
  elements.resourceForm.appendChild(submit);
}

async function saveResource(event) {
  event.preventDefault();
  const formData = new FormData(elements.resourceForm);
  const dataObject = {};
  const fileField = state.resources[state.resource].fields.find((field) => field.type === 'file');
  const id = formData.get('recordId');

  formData.forEach((value, key) => {
    if (key === 'recordId') return;
    if (value === '') return;

    if (key === 'rightFlag') {
      dataObject[key] = formData.get(key) === 'on';
      return;
    }

    if (fileField && key === fileField.name && value instanceof File && value.size > 0) {
      dataObject[key] = value;
      return;
    }

    if (key === 'options' || key === 'answers') {
      dataObject[key] = value.split(',').map((item) => item.trim()).filter(Boolean);
      return;
    }

    if (key === 'correctAnswer') {
      const num = Number(value);
      dataObject[key] = Number.isNaN(num) ? value : num;
      return;
    }

    if (key === 'progress' || key === 'duration' || key === 'price' || key === 'totalMarks' || key === 'passingMarks' || key === 'marks') {
      dataObject[key] = value === '' ? undefined : Number(value);
      return;
    }

    dataObject[key] = value;
  });

  try {
    let response;
    const endpoint = state.resources[state.resource].endpoint;
    const uploadPath = state.resources[state.resource].uploadPath;
    const urlBase = getFetchUrl(endpoint);
    const headers = getHeaders();

    if (fileField && dataObject[fileField.name]) {
      const uploadData = new FormData();
      Object.keys(dataObject).forEach((key) => {
        if (key === fileField.name) {
          uploadData.append(fileField.name, dataObject[key]);
        } else if (Array.isArray(dataObject[key])) {
          dataObject[key].forEach((item) => uploadData.append(`${key}[]`, item));
        } else {
          uploadData.append(key, dataObject[key]);
        }
      });
      response = await fetch(getFetchUrl(uploadPath), {
        method: 'POST',
        headers: { Authorization: state.authToken ? (state.authToken.startsWith('Bearer ') ? state.authToken : `Bearer ${state.authToken}`) : '' },
        body: uploadData
      });
    } else if (id) {
      response = await fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dataObject)
      });
    } else {
      response = await fetch(urlBase, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataObject)
      });
    }

    await parseResponse(response);
    setMessage(`${id ? 'Updated' : 'Created'} record successfully`, 'success');
    fetchList();
    populateForm();
  } catch (error) {
    setMessage(error.message || JSON.stringify(error), 'error');
  }
}

async function deleteItem(id) {
  if (!id) return;
  if (!confirm('Delete this record?')) return;
  const endpoint = state.resources[state.resource].endpoint;
  try {
    const response = await fetch(`${getFetchUrl(endpoint)}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    await parseResponse(response);
    setMessage('Deleted record successfully', 'success');
    fetchList();
  } catch (error) {
    setMessage(error.message || JSON.stringify(error), 'error');
  }
}

function resetForm() {
  populateForm();
}

function saveToken() {
  state.apiUrl = elements.apiUrl.value.trim();
  state.authToken = elements.authToken.value.trim();
  localStorage.setItem('adminApiUrl', state.apiUrl);
  localStorage.setItem('adminAuthToken', state.authToken);
  setMessage('Saved API URL and token locally', 'success');
  fetchList();
}

async function loginAdmin() {
  const email = elements.loginEmail.value && elements.loginEmail.value.trim();
  const password = elements.loginPassword.value && elements.loginPassword.value.trim();
  if (!email || !password) return setMessage('Please provide email and password', 'error');
  try {
    const res = await fetch(getFetchUrl('users/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseResponse(res);
    const token = data.token || (data.data && data.data.token) || '';
    if (!token) throw new Error('No token returned');
    state.authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    localStorage.setItem('adminAuthToken', state.authToken);
    // save user info if returned
    if (data.data && data.data.user) localStorage.setItem('elearningUser', JSON.stringify(data.data.user));
    elements.authToken.value = state.authToken;
    setMessage('Logged in and token saved', 'success');
    // update header
    try {
      const user = JSON.parse(localStorage.getItem('elearningUser') || 'null');
      if (user && elements.adminName) elements.adminName.textContent = user.name || user.email || 'Admin';
      if (user && elements.adminEmail) elements.adminEmail.textContent = user.email || '';
    } catch (e) {}
    fetchList();
  } catch (err) {
    setMessage(err.message || JSON.stringify(err), 'error');
  }
}

function clearToken() {
  state.authToken = '';
  elements.authToken.value = '';
  localStorage.removeItem('adminAuthToken');
  setMessage('Token cleared', 'info');
}

function renderResource() {
  buildNav();
  const selected = state.resources[state.resource];
  elements.resourceLabel.textContent = selected.label;
  elements.apiUrl.value = state.apiUrl;
  elements.authToken.value = state.authToken;
  populateForm();
  fetchList();
}

function init() {
  elements.authToken.value = state.authToken;
  elements.apiUrl.value = state.apiUrl;
  elements.saveToken.addEventListener('click', saveToken);
  elements.clearToken.addEventListener('click', clearToken);
  if (elements.loginBtn) elements.loginBtn.addEventListener('click', loginAdmin);
  elements.refreshBtn.addEventListener('click', fetchList);
  elements.clearFormBtn.addEventListener('click', resetForm);
  elements.resourceForm.addEventListener('submit', saveResource);
  if (elements.searchBtn) elements.searchBtn.addEventListener('click', () => { setMessage('Search is client-side: use Refresh to reload', 'info'); });
  if (elements.newResourceBtn) elements.newResourceBtn.addEventListener('click', () => populateForm());
  if (elements.openLogs) elements.openLogs.addEventListener('click', () => setMessage('Logs not available in static UI', 'info'));
  if (elements.clearCache) elements.clearCache.addEventListener('click', () => { localStorage.clear(); setMessage('Local storage cleared', 'success'); window.location.reload(); });

  // populate header info from login
  try {
    const user = JSON.parse(localStorage.getItem('elearningUser') || 'null');
    if (user && elements.adminName) elements.adminName.textContent = user.name || user.email || 'Admin';
    if (user && elements.adminEmail) elements.adminEmail.textContent = user.email || '';
  } catch (e) {
    // ignore
  }

  // check API health
  checkApiHealth();
  buildNav();
  renderResource();
}

async function checkApiHealth() {
  if (!elements.apiStatus) return;
  let base = state.apiUrl;
  try {
    // try to derive host for /health
    base = state.apiUrl.replace(/\/api\/.*$/, '') || state.apiUrl;
    const res = await fetch(`${base.replace(/\/$/, '')}/health`);
    if (res.ok) {
      elements.apiStatus.textContent = 'API: OK';
      elements.apiStatus.style.background = 'var(--surface-soft)';
    } else {
      elements.apiStatus.textContent = 'API: Error';
      elements.apiStatus.style.background = '#fff3cd';
    }
  } catch (err) {
    elements.apiStatus.textContent = 'API: Offline';
    elements.apiStatus.style.background = '#fee2e2';
  }
}

init();
