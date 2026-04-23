import { getMessages, saveMessage, getChatMeta, saveChatMeta } from '../storage/localStorageDB.js';
import { generateId } from '../utils/helpers.js';

export class MessageService {
  static getChatMessages(chatId) {
    return getMessages(chatId);
  }

  static sendMessage(chatId, sender, text) {
    const msg = {
      id: generateId(),
      chatId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      text,
      timestamp: Date.now()
    };
    saveMessage(chatId, msg);
    
    // Обновляем мета-информацию чата
    const chat = getChatMeta(chatId);
    if (chat) {
      chat.lastMessage = text;
      chat.updatedAt = Date.now();
      saveChatMeta(chat);
    }
    return msg;
  }
}