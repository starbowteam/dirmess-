import { initAuth } from './auth.js';
import { initStorage, getCurrentUser } from './storage.js';
import { initUI, showScreen, showMainScreen } from './ui.js';
import { initChat } from './chat.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация хранилища
    await initStorage();
    
    // Проверяем сессию
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Пользователь авторизован
        showMainScreen(currentUser);
        initChat();
    } else {
        // Показываем экран авторизации
        showScreen('auth');
        initAuth();
    }
    
    // Скрываем загрузку
    document.getElementById('loading').style.display = 'none';
});