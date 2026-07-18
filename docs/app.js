const USERS_KEY = 'demoUsers';
const LOGGED_IN_USER_KEY = 'demoLoggedInUser';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY));
  } catch (error) {
    return null;
  }
}

function saveLoggedInUser(user) {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
}

function clearLoggedInUser() {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
}

function showMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `message ${type}`;
}

function handleSignupSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const message = form.querySelector('.message');

  if (!fullName || !email || !password) {
    showMessage(message, 'Please fill in all fields.', 'error');
    return;
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    showMessage(message, 'This email is already registered. Please log in instead.', 'error');
    return;
  }

  users.push({ fullName, email, password });
  saveUsers(users);
  showMessage(message, 'Signup successful. You can log in now.', 'success');
  form.reset();
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const message = form.querySelector('.message');

  const users = readUsers();
  const matchedUser = users.find((user) => user.email === email && user.password === password);

  if (!matchedUser) {
    showMessage(message, 'Invalid email or password.', 'error');
    return;
  }

  saveLoggedInUser(matchedUser);
  window.location.href = 'dashboard.html';
}

function renderDashboard() {
  const user = readLoggedInUser();
  const profileContainer = document.getElementById('profile-details');
  const logoutButton = document.getElementById('logout-btn');

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="detail-box">
        <strong>Full Name</strong>
        <span>${user.fullName}</span>
      </div>
      <div class="detail-box">
        <strong>Email ID</strong>
        <span>${user.email}</span>
      </div>
      <div class="detail-box">
        <strong>Password</strong>
        <span>${user.password}</span>
      </div>
    `;
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearLoggedInUser();
      window.location.href = 'login.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  const dashboardPage = document.getElementById('dashboard-page');
  if (dashboardPage) {
    renderDashboard();
  }
});
