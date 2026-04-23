import { getUsers, saveUser, findUserByTag, setCurrentUser } from '../storage/localStorageDB.js';
import { generateId } from '../utils/helpers.js';

export class AuthService {
  static login(tag, password) {
    const user = findUserByTag(tag);
    if (!user) throw new Error('Пользователь не найден');
    if (user.password !== password) throw new Error('Неверный пароль');
    const session = { ...user };
    delete session.password;
    setCurrentUser(session);
    return session;
  }

  static register(name, tag, password) {
    if (!name || !tag || !password) throw new Error('Заполните все поля');
    if (tag.length < 3) throw new Error('Тег должен быть не менее 3 символов');
    if (password.length < 4) throw new Error('Пароль должен быть не менее 4 символов');
    if (findUserByTag(tag)) throw new Error('Этот тег уже занят');

    const newUser = {
      id: generateId(),
      name,
      tag,
      password,
      avatar: name.charAt(0).toUpperCase()
    };
    saveUser(newUser);
    const session = { ...newUser };
    delete session.password;
    setCurrentUser(session);
    return session;
  }

  static logout() {
    localStorage.removeItem('drm_currentUser');
  }
}