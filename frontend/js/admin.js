const state = {
  apiUrl: localStorage.getItem('adminApiUrl') || 'http://localhost:3000/api/v1',
  authToken: localStorage.getItem('adminAuthToken') || localStorage.getItem('elearningAuthToken') || '',
  resource: 'users',
  resources: {
    users: {
      label: 'Users',
      endpoint: 'users',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true },
        { name: 'role', type: 'select', label: 'Role', required: true, options: ['student', 'instructor', 'admin'] }
      ]
    },
    courses: {
      label: 'Courses',
      endpoint: 'courses',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'text', label: 'Description', required: true },
        { name: 'departmentId', type: 'select', label: 'Department', required: true, reference: 'departments' },
        { name: 'instructorId', type: 'select', label: 'Instructor', reference: 'instructors' },
        { name: 'duration', type: 'number', label: 'Duration (days)' },
        { name: 'price', type: 'number', label: 'Price' },
        { name: 'level', type: 'select', label: 'Level', options: ['beginner', 'intermediate', 'advanced'] }
      ]
    },
    departments: {
      label: 'Departments',
      endpoint: 'departments',
      fields: [
        { name: 'name', type: 'text', label: 'Department Name', required: true },
        { name: 'description', type: 'text', label: 'Description' },
        { name: 'headId', type: 'select', label: 'Head User', reference: 'users' }
      ]
    },
    instructors: {
      label: 'Instructors',
      endpoint: 'instructors',
      fields: [
        { name: 'userId', type: 'select', label: 'User', required: true, reference: 'users' },
        { name: 'specialization', type: 'text', label: 'Specialization' },
        { name: 'bio', type: 'text', label: 'Bio' },
        { name: 'experience', type: 'number', label: 'Experience (years)' }
      ]
    },
    students: {
      label: 'Students',
      endpoint: 'students',
      fields: [
        { name: 'userId', type: 'select', label: 'User', required: true, reference: 'users' },
        { name: 'enrollmentYear', type: 'number', label: 'Enrollment Year' },
        { name: 'gpa', type: 'number', label: 'GPA', step: '0.01' }
      ]
    },
    'student-courses': {
      label: 'Student Courses',
      endpoint: 'student-courses',
      fields: [
        { name: 'studentId', type: 'select', label: 'Student', required: true, reference: 'students' },
        { name: 'courseId', type: 'select', label: 'Course', required: true, reference: 'courses' },
        { name: 'enrollmentDate', type: 'date', label: 'Enrollment Date' },
        { name: 'completionStatus', type: 'select', label: 'Completion Status', options: ['not-started', 'in-progress', 'completed'] },
        { name: 'progress', type: 'number', label: 'Progress (%)' }
      ]
    },
    'course-details': {
      label: 'Course Details',
      endpoint: 'course-details',
      fields: [
        { name: 'courseId', type: 'select', label: 'Course', required: true, reference: 'courses' },
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'content', type: 'text', label: 'Content', required: true },
        { name: 'contentType', type: 'select', label: 'Content Type', required: true, options: ['text', 'video', 'quiz', 'assignment'] },
        { name: 'order', type: 'number', label: 'Order', required: true },
        { name: 'duration', type: 'number', label: 'Duration (minutes)' }
      ]
    },
    'course-exams': {
      label: 'Course Exams',
      endpoint: 'course-exams',
      fields: [
        { name: 'courseId', type: 'select', label: 'Course', required: true, reference: 'courses' },
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'text', label: 'Description' },
        { name: 'duration', type: 'number', label: 'Duration (minutes)', required: true },
        { name: 'totalMarks', type: 'number', label: 'Total Marks', required: true },
        { name: 'passingMarks', type: 'number', label: 'Passing Marks' },
        { name: 'examDate', type: 'date', label: 'Exam Date' }
      ]
    },
    'exam-questions': {
      label: 'Exam Questions',
      endpoint: 'exam-questions',
      fields: [
        { name: 'examId', type: 'select', label: 'Exam', required: true, reference: 'course-exams' },
        { name: 'question', type: 'text', label: 'Question', required: true },
        { name: 'questionType', type: 'select', label: 'Question Type', required: true, options: ['multiple-choice', 'true-false', 'short-answer'] },
        { name: 'options', type: 'text', label: 'Options (comma separated)' },
        { name: 'correctAnswer', type: 'text', label: 'Correct Answer' },
        { name: 'marks', type: 'number', label: 'Marks', required: true }
      ]
    },
    'exam-answers': {
      label: 'Exam Answers',
      endpoint: 'exam-answers',
      fields: [
        { name: 'examId', type: 'select', label: 'Exam', required: true, reference: 'course-exams' },
        { name: 'studentId', type: 'select', label: 'Student', required: true, reference: 'students' },
        { name: 'answers', type: 'text', label: 'Answers (comma separated)', required: true },
        { name: 'totalScore', type: 'number', label: 'Total Score' }
      ]
    },
    'course-media': {
      label: 'Course Media',
      endpoint: 'course-media',
      fields: [
        { name: 'courseId', type: 'select', label: 'Course', required: true, reference: 'courses' },
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'description', type: 'text', label: 'Description' },
        { name: 'type', type: 'select', label: 'Media Type', required: true, options: ['video', 'audio', 'document', 'image'] },
        { name: 'duration', type: 'number', label: 'Duration (seconds)' },
        { name: 'order', type: 'number', label: 'Order' },
        { name: 'file', type: 'file', label: 'File' }
      ],
      uploadPath: 'course-media'
    }
  }
};

const referenceCatalog = {
  users: {
    endpoint: 'users',
    label: (item) => `${item.name || item.email || 'User'} (${getRecordId(item)})`
  },
  departments: {
    endpoint: 'departments',
    label: (item) => `${item.departmentName || item.name || 'Department'} (${getRecordId(item)})`
  },
  courses: {
    endpoint: 'courses',
    label: (item) => `${item.title || item.courseName || 'Course'} (${getRecordId(item)})`
  },
  instructors: {
    endpoint: 'instructors',
    label: (item) => `${item.instructorName || item.specialization || 'Instructor'} (${getRecordId(item)})`
  },
  students: {
    endpoint: 'students',
    label: (item) => `${item.studentName || item.userId?.name || item.userId?.email || 'Student'} (${getRecordId(item)})`
  },
  'course-exams': {
    endpoint: 'course-exams',
    label: (item) => `${item.title || 'Exam'} (${getRecordId(item)})`
  }
};

const optionsCache = {};

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
elements.logoutBtn = document.getElementById('logoutBtn');
elements.adminActions = document.getElementById('adminActions');

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

function getRecordId(record) {
  if (!record) return '';
  if (typeof record === 'string') return record;
  return record._id || record.id || '';
}

function clearOptionsCache() {
  Object.keys(optionsCache).forEach((key) => delete optionsCache[key]);
}

async function loadReferenceOptions(referenceKey) {
  if (optionsCache[referenceKey]) return optionsCache[referenceKey];
  const config = referenceCatalog[referenceKey];
  if (!config) return [];

  const response = await fetch(getFetchUrl(config.endpoint), { headers: getHeaders() });
  const data = await parseResponse(response);
  const list = normalizeList(data);
  optionsCache[referenceKey] = list;
  return list;
}

function resolveReferenceValue(item, fieldName) {
  if (!item) return '';
  const value = item[fieldName];
  if (value && typeof value === 'object') {
    return getRecordId(value);
  }
  return value ?? '';
}

function createSelectField(field, item) {
  const select = document.createElement('select');
  select.name = field.name;
  select.className = 'admin-select';
  if (field.required && !(item && field.name === 'password')) select.required = true;

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = field.required ? `Select ${field.label}` : 'None';
  select.appendChild(placeholder);

  return select;
}

async function fillReferenceSelect(select, field, item) {
  try {
    const options = await loadReferenceOptions(field.reference);
    options.forEach((optionItem) => {
      const option = document.createElement('option');
      option.value = getRecordId(optionItem);
      option.textContent = referenceCatalog[field.reference].label(optionItem);
      select.appendChild(option);
    });
  } catch (error) {
    const failOption = document.createElement('option');
    failOption.value = '';
    failOption.textContent = 'Unable to load options';
    select.appendChild(failOption);
  }

  const selected = resolveReferenceValue(item, field.name);
  if (selected) select.value = String(selected);
}

function fillStaticSelect(select, field, item) {
  field.options.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  const selected = item?.[field.name];
  if (selected !== undefined && selected !== null && selected !== '') {
    select.value = String(selected);
  }
}

function normalizeList(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.users)) return result.users;
  if (Array.isArray(result?.data?.courseMedias)) return result.data.courseMedias;
  if (Array.isArray(result?.data?.courses)) return result.data.courses;
  if (Array.isArray(result?.data)) return result.data;
  if (result?.data && typeof result.data === 'object') {
    const nested = Object.values(result.data).find(Array.isArray);
    if (nested) return nested;
  }
  return [];
}

function formatCellValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') {
    return value.departmentName || value.name || value.title || value.email || value._id || JSON.stringify(value);
  }
  return String(value);
}

async function fetchList() {
  setMessage('Loading records...', 'info');
  const endpoint = state.resources[state.resource].endpoint;
  try {
    const response = await fetch(getFetchUrl(endpoint), { headers: getHeaders() });
    const data = await parseResponse(response);
    const list = normalizeList(data);
    renderList(list);
    setMessage(`Loaded ${list.length} records.`, 'success');
  } catch (error) {
    console.error(error);
    const message = error.message || error.error || JSON.stringify(error);
    setMessage(message, 'error');
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
      td.textContent = formatCellValue(item[field]);
      row.appendChild(td);
    });
    const actions = document.createElement('td');
    actions.className = 'row-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'btn outline small';
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => void populateForm(item));
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

async function populateForm(item = null) {
  const fields = state.resources[state.resource].fields;
  elements.resourceForm.innerHTML = '';
  const formHeading = document.createElement('h3');
  formHeading.textContent = item ? 'Update record' : 'Create record';
  elements.resourceForm.appendChild(formHeading);

  for (const field of fields) {
    const fieldWrapper = document.createElement('label');
    fieldWrapper.className = 'label';
    fieldWrapper.textContent = field.label;

    if (field.type === 'select') {
      const select = createSelectField(field, item);
      if (field.reference) {
        await fillReferenceSelect(select, field, item);
      } else if (field.options) {
        fillStaticSelect(select, field, item);
      }
      fieldWrapper.appendChild(select);
    } else if (field.type === 'checkbox') {
      const input = document.createElement('input');
      input.name = field.name;
      input.type = 'checkbox';
      input.checked = item ? !!item[field.name] : false;
      fieldWrapper.appendChild(input);
    } else if (field.type === 'file') {
      const input = document.createElement('input');
      input.name = field.name;
      input.type = 'file';
      fieldWrapper.appendChild(input);
    } else {
      const input = document.createElement('input');
      input.name = field.name;
      input.type = field.type;
      input.placeholder = field.placeholder || (item && field.name === 'password' ? 'Leave blank to keep unchanged' : '');
      if (field.step) input.step = field.step;
      if (field.required && !(item && field.name === 'password')) input.required = true;
      if (item && item[field.name] !== undefined && item[field.name] !== null) {
        if (Array.isArray(item[field.name])) {
          input.value = item[field.name].join(', ');
        } else if (field.type === 'date') {
          input.value = String(item[field.name]).substring(0, 10);
        } else {
          input.value = item[field.name];
        }
      }
      fieldWrapper.appendChild(input);
    }
    elements.resourceForm.appendChild(fieldWrapper);
  }

  const recordId = item ? getRecordId(item) : '';
  if (recordId) {
    const idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.name = 'recordId';
    idInput.value = recordId;
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
    clearOptionsCache();
    fetchList();
    void populateForm();
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
  void populateForm();
}

function saveToken() {
  if (elements.apiUrl) state.apiUrl = elements.apiUrl.value.trim() || state.apiUrl;
  if (elements.authToken) state.authToken = elements.authToken.value.trim();
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
    localStorage.setItem('elearningAuthToken', state.authToken);
    // save user info if returned
    if (data.data && data.data.user) localStorage.setItem('elearningUser', JSON.stringify(data.data.user));
    if (elements.authToken) elements.authToken.value = state.authToken;
    setMessage('Logged in successfully', 'success');
    updateAuthUI();
    fetchList();
  } catch (err) {
    setMessage(err.message || JSON.stringify(err), 'error');
  }
}

function clearToken() {
  logoutAdmin();
}

function syncSettingsFields() {
  if (elements.apiUrl) elements.apiUrl.value = state.apiUrl;
  if (elements.authToken) elements.authToken.value = state.authToken;
}

function refreshAuthToken() {
  state.authToken = localStorage.getItem('adminAuthToken')
    || localStorage.getItem('elearningAuthToken')
    || '';
  return Boolean(state.authToken);
}

function updateAuthUI() {
  const isLoggedIn = refreshAuthToken();
  const loginPanel = document.getElementById('adminLoginPanel');
  const logoutBtn = elements.logoutBtn;
  const actions = elements.adminActions;

  if (loginPanel) loginPanel.hidden = isLoggedIn;
  if (logoutBtn) logoutBtn.hidden = !isLoggedIn;
  if (actions) actions.classList.toggle('is-authenticated', isLoggedIn);

  try {
    const user = JSON.parse(localStorage.getItem('elearningUser') || 'null');
    if (user && elements.adminName) elements.adminName.textContent = user.name || user.email || 'Admin';
    if (user && elements.adminEmail) elements.adminEmail.textContent = user.email || '';
  } catch (e) {
    // ignore
  }
}

function logoutAdmin() {
  state.authToken = '';
  localStorage.removeItem('adminAuthToken');
  localStorage.removeItem('elearningAuthToken');
  localStorage.removeItem('elearningUser');
  if (elements.authToken) elements.authToken.value = '';
  updateAuthUI();
  setMessage('Logged out successfully', 'success');
  window.location.href = 'login.html';
}

function renderResource() {
  buildNav();
  const selected = state.resources[state.resource];
  elements.resourceLabel.textContent = selected.label;
  syncSettingsFields();
  clearOptionsCache();
  void populateForm();
  fetchList();
}

function init() {
  syncSettingsFields();
  if (elements.saveToken) elements.saveToken.addEventListener('click', saveToken);
  if (elements.clearToken) elements.clearToken.addEventListener('click', clearToken);
  if (elements.loginBtn) elements.loginBtn.addEventListener('click', loginAdmin);
  if (elements.logoutBtn) elements.logoutBtn.addEventListener('click', logoutAdmin);
  elements.refreshBtn.addEventListener('click', fetchList);
  elements.clearFormBtn.addEventListener('click', resetForm);
  elements.resourceForm.addEventListener('submit', saveResource);
  if (elements.searchBtn) elements.searchBtn.addEventListener('click', () => { setMessage('Search is client-side: use Refresh to reload', 'info'); });
  if (elements.newResourceBtn) elements.newResourceBtn.addEventListener('click', () => void populateForm());
  if (elements.openLogs) elements.openLogs.addEventListener('click', () => setMessage('Logs not available in static UI', 'info'));
  if (elements.clearCache) elements.clearCache.addEventListener('click', () => { localStorage.clear(); setMessage('Local storage cleared', 'success'); window.location.reload(); });

  checkApiHealth();
  buildNav();
  updateAuthUI();
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
