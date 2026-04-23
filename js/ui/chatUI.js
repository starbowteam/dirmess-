import { MessageService } from '../services/messageService.js';
import { formatTime } from '../utils/helpers.js';

export default class ChatUI {
  constructor(user, chatId, onBack) {
    this.user = user;
    this.chatId = chatId;
    this.onBack = onBack;
    this.render();
  }

  render() {
    const chat = JSON.parse(localStorage.getItem(`chat_${this.chatId}`));
    if (!chat) return;
    const other = chat.participants?.find(p => p.id !== this.user.id) || {};
    const name = chat.name || other.name || 'Чат';
    const avatar = chat.avatar || other.avatar || '?';
    document.getElementById('chatTitle').textContent = name;
    document.getElementById('chatSubtitle').textContent = chat.type === 'group' ? `${chat.participants.length} участников` : 'онлайн';
    document.getElementById('chatAvatar').textContent = avatar;
    document.getElementById('messageInputArea').style.display = 'flex';
    this.loadMessages();
    this.attach();
  }

  loadMessages() {
    const msgs = MessageService.getChatMessages(this.chatId);
    const container = document.getElementById('messagesContainer');
    if (!msgs.length) {
      container.innerHTML = '<div class="empty-chat-message"><i class="fas fa-comments"></i><p>Нет сообщений</p></div>';
      return;
    }
    container.innerHTML = msgs.map(m => {
      const own = m.senderId === this.user.id;
      return `
        <div class="message-row ${own ? 'own' : ''}">
          <div class="message-avatar">${m.senderAvatar}</div>
          <div class="message-bubble">${m.text}<div class="message-meta">${formatTime(m.timestamp)}</div></div>
        </div>
      `;
    }).join('');
    container.scrollTop = container.scrollHeight;
  }

  attach() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      MessageService.sendMessage(this.chatId, this.user, text);
      this.loadMessages();
      input.value = '';
      // Обновить список чатов в сайдбаре
      window.EventBus.emit('message:sent');
    };
    sendBtn.onclick = send;
    input.onkeypress = e => { if (e.key === 'Enter') send(); };
    document.getElementById('mobileBackBtn').onclick = () => this.onBack?.();
  }
}