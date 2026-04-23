import { initStorage } from './localStorageDB.js';

export function runMigrations() {
  // Здесь можно добавлять начальные данные, если нужно
  const users = JSON.parse(localStorage.getItem('drm_users'));
  if (users.length === 0) {
    // Ничего не делаем, пользователи регистрируются сами
  }
}