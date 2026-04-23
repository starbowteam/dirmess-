import { EventBus } from './eventBus.js';
import { Router } from './router.js';
import { initStorage } from '../storage/localStorageDB.js';
import { runMigrations } from '../storage/migrations.js';
import AuthUI from '../ui/authUI.js';
import MainUI from '../ui/mainUI.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  
  // Инициализируем хранилище и миграции
  initStorage();
  runMigrations();

  // Глобальная шина событий
  window.EventBus = new EventBus();

  // Роутер
  const router = new Router({
    auth: AuthUI,
    main: MainUI
  });

  // Проверяем сессию
  const currentUser = JSON.parse(localStorage.getItem('drm_currentUser'));

  if (currentUser) {
    router.navigate('main', { user: currentUser });
  } else {
    router.navigate('auth');
  }

  loading.style.display = 'none';
});