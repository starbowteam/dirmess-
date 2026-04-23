import { getUsers, findUserByTag } from '../storage/localStorageDB.js';

export class UserService {
  static searchUsers(query) {
    const term = query.toLowerCase();
    return getUsers().filter(u => 
      u.tag?.toLowerCase().includes(term) || 
      u.name?.toLowerCase().includes(term)
    );
  }

  static getUserByTag(tag) {
    return findUserByTag(tag);
  }

  static getAllUsers() {
    return getUsers();
  }
}