import { addChatToUser, getChatMeta, saveChatMeta, getUserChats } from '../storage/localStorageDB.js';
import { generateId } from '../utils/helpers.js';
import { findUserByTag } from '../storage/localStorageDB.js';

export class ChatService {
  static getChatsForUser(userId) {
    const chatIds = getUserChats(userId);
    return chatIds.map(getChatMeta).filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  static createPrivateChat(currentUser, targetTag) {
    const target = findUserByTag(targetTag);
    if (!target) throw new Error('Пользователь не найден');
    if (target.id === currentUser.id) throw new Error('Нельзя создать чат с самим собой');
    
    // Проверяем, нет ли уже чата
    const existing = this.getChatsForUser(currentUser.id)
      .find(c => c.type !== 'group' && c.participants.some(p => p.id === target.id));
    if (existing) return existing;
    
    const chat = {
      id: generateId(),
      type: 'private',
      participants: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        { id: target.id, name: target.name, avatar: target.avatar }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastMessage: ''
    };
    saveChatMeta(chat);
    addChatToUser(currentUser.id, chat.id);
    addChatToUser(target.id, chat.id);
    return chat;
  }
}