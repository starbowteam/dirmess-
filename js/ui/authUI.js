import { AuthService } from '../services/authService.js';

export default class AuthUI {
  static render() {
    const container = document.getElementById('auth-container');
    container.style.display = 'flex';
    container.innerHTML = `
      <div class="auth-screen">
        <div class="auth-header">
          <h1>.drm</h1>
          <p>серебряный мессенджер</p>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Вход</button>
          <button class="auth-tab" data-tab="register">Регистрация</button>
        </div>
        <div id="auth-forms"></div>
      </div>
    `;
    this.showLoginForm();
    this.attachEvents();
  }

  static showLoginForm() {
    const forms = document.getElementById('auth-forms');
    forms.innerHTML = `
      <form class="auth-form" id="login-form">
        <div class="input-group">
          <label>Тег</label>
          <input type="text" id="loginTag" placeholder="your_tag">
        </div>
        <div class="input-group">
          <label>Пароль</label>
          <input type="password" id="loginPassword" placeholder="••••••••">
        </div>
        <div class="error-message" id="loginError"></div>
        <button type="submit" class="btn-primary">Войти</button>
      </form>
    `;
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const tag = document.getElementById('loginTag').value.trim();
      const pass = document.getElementById('loginPassword').value;
      try {
        const user = AuthService.login(tag, pass);
        window.appRouter.navigate('main', { user });
      } catch (err) {
        document.getElementById('loginError').textContent = err.message;
      }
    });
  }

  static showRegisterForm() {
    const forms = document.getElementById('auth-forms');
    forms.innerHTML = `
      <form class="auth-form" id="register-form">
        <div class="input-group">
          <label>Имя</label>
          <input type="text" id="regName" placeholder="Виктор">
        </div>
        <div class="input-group">
          <label>Тег</label>
          <input type="text" id="regTag" placeholder="viktor">
        </div>
        <div class="input-group">
          <label>Пароль</label>
          <input type="password" id="regPassword" placeholder="••••••••">
        </div>
        <div class="error-message" id="regError"></div>
        <button type="submit" class="btn-primary">Зарегистрироваться</button>
      </form>
    `;
    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const tag = document.getElementById('regTag').value.trim();
      const pass = document.getElementById('regPassword').value;
      try {
        const user = AuthService.register(name, tag, pass);
        window.appRouter.navigate('main', { user });
      } catch (err) {
        document.getElementById('regError').textContent = err.message;
      }
    });
  }

  static attachEvents() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'login') this.showLoginForm();
        else this.showRegisterForm();
      });
    });
  }
}