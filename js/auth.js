import { getUsers, saveUser, findUserByTag, setCurrentUser } from './storage.js';
import { showMainScreen, showError } from './ui.js';
import { generateId } from './utils.js';

export function initAuth() {
    renderAuthForms();
    setupAuthListeners();
}

function renderAuthForms() {
    const container = document.getElementById('auth-forms');
    container.innerHTML = `
        <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Вход</button>
            <button class="auth-tab" data-tab="register">Регистрация</button>
        </div>
        <div id="login-form" class="auth-form">
            <div class="input-group">
                <label>Тег</label>
                <input type="text" id="loginTag" placeholder="your_tag">
            </div>
            <div class="input-group">
                <label>Пароль</label>
                <input type="password" id="loginPassword" placeholder="••••••••">
            </div>
            <div class="error-message" id="loginError"></div>
            <button class="btn-primary" id="loginBtn">Войти</button>
        </div>
        <div id="register-form" class="auth-form" style="display: none;">
            <div class="input-group">
                <label>Имя (отображается)</label>
                <input type="text" id="regName" placeholder="Иван">
            </div>
            <div class="input-group">
                <label>Уникальный тег</label>
                <input type="text" id="regTag" placeholder="ivan2000">
            </div>
            <div class="input-group">
                <label>Пароль</label>
                <input type="password" id="regPassword" placeholder="••••••••">
            </div>
            <div class="error-message" id="regError"></div>
            <button class="btn-primary" id="registerBtn">Зарегистрироваться</button>
        </div>
    `;
}

function setupAuthListeners() {
    // Переключение табов
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('login-form').style.display = isLogin ? 'flex' : 'none';
            document.getElementById('register-form').style.display = isLogin ? 'none' : 'flex';
        });
    });

    // Логин
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
}

function handleLogin() {
    const tag = document.getElementById('loginTag').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    if (!tag || !password) {
        errorEl.textContent = 'Заполните все поля';
        return;
    }

    const user = findUserByTag(tag);
    if (!user || user.password !== password) {
        errorEl.textContent = 'Неверный тег или пароль';
        return;
    }

    // Сохраняем сессию (без пароля)
    const sessionUser = { ...user };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    
    showMainScreen(sessionUser);
    import('./chat.js').then(m => m.initChat());
}

function handleRegister() {
    const name = document.getElementById('regName').value.trim();
    const tag = document.getElementById('regTag').value.trim();
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('regError');

    if (!name || !tag || !password) {
        errorEl.textContent = 'Заполните все поля';
        return;
    }

    if (tag.length < 3) {
        errorEl.textContent = 'Тег должен быть не менее 3 символов';
        return;
    }

    if (password.length < 4) {
        errorEl.textContent = 'Пароль должен быть не менее 4 символов';
        return;
    }

    if (findUserByTag(tag)) {
        errorEl.textContent = 'Этот тег уже занят';
        return;
    }

    const newUser = {
        id: generateId(),
        name,
        tag,
        password,
        avatar: name.charAt(0).toUpperCase()
    };

    saveUser(newUser);
    
    // Автоматический вход
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    
    showMainScreen(sessionUser);
    import('./chat.js').then(m => m.initChat());
}