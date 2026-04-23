import { ChatService } from '../services/chatService.js';
import { UserService } from '../services/userService.js';
import { WallService } from '../services/wallService.js';
import { formatTime } from '../utils/helpers.js';

export default class SidebarUI {
  constructor(user, onChatSelect) {
    this.user = user;
    this.onChatSelect = onChatSelect;
    this.currentTab = 'chats';
    this.render();
  }

  render() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="user-profile" id="profileBtn">
          <div class="avatar avatar-lg">${this.user.avatar}</div>
          <div class="user-info">
            <strong>${this.user.name}</strong>
            <span class="status">онлайн</span>
          </div>
        </div>
        <button class="icon-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" id="searchInput" placeholder="Поиск...">
      </div>
      <div class="chat-tabs">
        <button class="tab-btn active" data-tab="chats">Чаты</button>
        <button class="tab-btn" data-tab="groups">Группы</button>
        <button class="tab-btn" data-tab="wall">Стена</button>
        <button class="tab-btn" data-tab="users">Люди</button>
      </div>
      <div class="chat-list-container" id="chatList"></div>
      <button class="new-chat-btn" id="newChatBtn"><i class="fas fa-plus"></i> Новый чат</button>
    `;
    this.loadChats();
    this.attachEvents();
  }

  loadChats() {
    let items = [];
    if (this.currentTab === 'chats') {
      items = ChatService.getChatsForUser(this.user.id).filter(c => c.type !== 'group');
    } else if (this.currentTab === 'groups') {
      items = ChatService.getChatsForUser(this.user.id).filter(c => c.type === 'group');
    } else if (this.currentTab === 'users') {
      this.showUsersList();
      return;
    } else if (this.currentTab === 'wall') {
      this.showWallPreview();
      return;
    }
    this.renderChatList(items);
  }

  renderChatList(items) {
    const container = document.getElementById('chatList');
    if (!items.length) {
      container.innerHTML = '<div style="padding:20px;color:var(--text-secondary)">Пусто</div>';
      return;
    }
    container.innerHTML = items.map(chat => {
      const other = chat.participants?.find(p => p.id !== this.user.id) || {};
      const name = chat.name || other.name || 'Группа';
      const avatar = chat.avatar || other.avatar || '?';
      return `
        <div class="chat-item" data-id="${chat.id}">
          <div class="avatar avatar-lg">${avatar}</div>
          <div class="chat-item-info">
            <div class="chat-item-title">
              <span>${name}</span>
              <span>${formatTime(chat.updatedAt)}</span>
            </div>
            <div class="chat-item-lastmsg">${chat.lastMessage || '...'}</div>
          </div>
        </div>
      `;
    }).join('');
    container.querySelectorAll('.chat-item').forEach(el => {
      el.addEventListener('click', () => this.onChatSelect(el.dataset.id));
    });
  }

  showUsersList() {
    const users = UserService.getAllUsers().filter(u => u.id !== this.user.id);
    const container = document.getElementById('chatList');
    container.innerHTML = users.map(u => `
      <div class="chat-item" data-user-id="${u.id}">
        <div class="avatar avatar-lg">${u.avatar}</div>
        <div class="chat-item-info">
          <div class="chat-item-title">${u.name}</div>
          <div class="chat-item-lastmsg">@${u.tag}</div>
        </div>
      </div>
    `).join('');
    container.querySelectorAll('.chat-item').forEach(el => {
      el.addEventListener('click', () => {
        const userId = el.dataset.userId;
        const target = UserService.getUserByTag(u.tag);
        if (target) {
          const chat = ChatService.createPrivateChat(this.user, target.tag);
          this.onChatSelect(chat.id);
        }
      });
    });
  }

  showWallPreview() {
    const posts = WallService.getPosts();
    const container = document.getElementById('chatList');
    container.innerHTML = '<div style="padding:20px;color:var(--text-secondary)">🌐 Общая стена</div>';
    // Можно добавить краткий список
  }

  attachEvents() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('drm_currentUser');
      location.reload();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        this.loadChats();
      });
    });

    document.getElementById('searchInput').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.chat-item').forEach(el => {
        const title = el.querySelector('.chat-item-title span')?.textContent?.toLowerCase() || '';
        el.style.display = title.includes(q) ? '' : 'none';
      });
    });

    document.getElementById('newChatBtn').addEventListener('click', () => {
      this.showNewChatModal();
    });
  }

  showNewChatModal() {
    const modal = document.getElementById('modal-container');
    const overlay = document.getElementById('modal-overlay');
    modal.innerHTML = `
      <h3>Новый чат</h3>
      <div class="input-group">
        <label>Тег пользователя</label>
        <input type="text" id="modalTag" placeholder="@viktor">
      </div>
      <div class="error-message" id="modalError"></div>
      <div style="display:flex; gap:8px; margin-top:16px;">
        <button class="btn-primary" id="modalCreate">Создать</button>
        <button class="btn-secondary" id="modalCancel">Отмена</button>
      </div>
    `;
    overlay.style.display = 'block';
    modal.style.display = 'block';
    document.getElementById('modalCreate').onclick = () => {
      const tag = document.getElementById('modalTag').value.trim().replace('@', '');
      try {
        const chat = ChatService.createPrivateChat(this.user, tag);
        overlay.style.display = 'none';
        modal.style.display = 'none';
        this.onChatSelect(chat.id);
        this.loadChats();
      } catch (err) {
        document.getElementById('modalError').textContent = err.message;
      }
    };
    document.getElementById('modalCancel').onclick = () => {
      overlay.style.display = 'none';
      modal.style.display = 'none';
    };
  }
}

if (this.currentTab === 'wall') {
  new WallUI(this.user);
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.add('hidden');
  return;
}