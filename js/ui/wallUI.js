import { WallService } from '../services/wallService.js';
import { formatTime } from '../utils/helpers.js';

export default class WallUI {
  constructor(user) {
    this.user = user;
    this.render();
  }

  render() {
    document.getElementById('chatTitle').textContent = 'Общая стена';
    document.getElementById('chatSubtitle').textContent = 'Сообщество .drm';
    document.getElementById('chatAvatar').textContent = '🌐';
    document.getElementById('messageInputArea').style.display = 'flex';
    document.getElementById('messageInput').placeholder = 'Что нового?';
    this.loadPosts();
    this.attach();
  }

  loadPosts() {
    const posts = WallService.getPosts();
    const container = document.getElementById('messagesContainer');
    if (!posts.length) {
      container.innerHTML = '<div class="empty-chat-message"><i class="fas fa-newspaper"></i><p>На стене пока пусто</p></div>';
      return;
    }
    container.innerHTML = posts.map(p => `
      <div class="wall-post">
        <div class="post-header">
          <div class="avatar">${p.authorAvatar}</div>
          <div>
            <div class="post-author">${p.authorName}</div>
            <div class="post-time">${formatTime(p.timestamp)}</div>
          </div>
        </div>
        <div class="post-content">${p.content}</div>
        <div class="post-actions">
          <span><i class="far fa-heart"></i> ${p.likes?.length || 0}</span>
          <span><i class="far fa-comment"></i></span>
        </div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }

  attach() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      WallService.publishPost(this.user, text);
      this.loadPosts();
      input.value = '';
    };
    sendBtn.onclick = send;
    input.onkeypress = e => { if (e.key === 'Enter') send(); };
  }
}