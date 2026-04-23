import SidebarUI from './sidebarUI.js';
import ChatUI from './chatUI.js';
import WallUI from './wallUI.js';
import { ChatService } from '../services/chatService.js';

export default class MainUI {
  static render(payload) {
    const container = document.getElementById('main-container');
    container.innerHTML = `
      <aside class="sidebar" id="sidebar"></aside>
      <main class="chat-area" id="chatArea">
        <div class="chat-header">
          <button class="mobile-back-btn" id="mobileBackBtn"><i class="fas fa-arrow-left"></i></button>
          <div class="chat-info">
            <div class="avatar" id="chatAvatar"></div>
            <div class="chat-details">
              <h3 id="chatTitle">Выберите чат</h3>
              <p id="chatSubtitle"></p>
            </div>
          </div>
          <div class="chat-actions"></div>
        </div>
        <div class="messages-container" id="messagesContainer">
          <div class="empty-chat-message"><i class="fas fa-comments"></i><p>Выберите чат</p></div>
        </div>
        <div class="message-input-area" id="messageInputArea" style="display: none;">
          <input type="text" id="messageInput" placeholder="Сообщение...">
          <button class="send-btn" id="sendMessageBtn"><i class="fas fa-paper-plane"></i></button>
        </div>
      </main>
    `;
    container.style.display = 'flex';
    const user = payload.user;
    const sidebar = new SidebarUI(user, (chatId) => {
      new ChatUI(user, chatId, () => {
        document.getElementById('sidebar').classList.remove('hidden');
      });
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('hidden');
      }
    });
    // Обработчик мобильного возврата
    document.getElementById('mobileBackBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('hidden');
    });
    // Переключение на стену из сайдбара
    // (добавляем через EventBus или прямой вызов)
  }
}