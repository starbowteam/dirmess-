import { getCurrentUser } from './storage.js';

export function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    if (screenName === 'auth') {
        document.getElementById('auth-screen').style.display = 'flex';
    } else if (screenName === 'main') {
        document.getElementById('main-screen').style.display = 'flex';
    }
}

export function showMainScreen(user) {
    showScreen('main');
    updateUserProfile(user);
}

export function updateUserProfile(user) {
    document.getElementById('currentUserTag').textContent = `@${user.tag}`;
    document.getElementById('currentUserAvatar').textContent = user.avatar || user.name.charAt(0);
}

export function showError(message) {
    alert(message); // временно
}

// Рендеринг списка чатов
export function renderChatList(chats, currentUserId) {
    const container = document.getElementById('chatListContainer');
    if (chats.length === 0) {
        container.innerHTML = '<div class="empty-chat-message" style="padding:20px;">Нет чатов</div>';
        return;
    }
    
    container.innerHTML = chats.map(chat => {
        const otherUser = chat.participants.find(p => p.id !== currentUserId);
        const lastMsg = chat.lastMessage || 'Нет сообщений';
        return `
            <div class="chat-item" data-chat-id="${chat.id}">
                <div class="avatar">${otherUser?.avatar || '?'}</div>
                <div class="chat-item-info">
                    <div class="chat-item-title">
                        <span>${otherUser?.name || 'Чат'}</span>
                        <span class="chat-time">${formatTime(chat.updatedAt)}</span>
                    </div>
                    <div class="chat-item-lastmsg">${lastMsg}</div>
                </div>
            </div>
        `;
    }).join('');
}

export function renderMessages(messages, currentUserId) {
    const container = document.getElementById('messagesContainer');
    if (!messages || messages.length === 0) {
        container.innerHTML = '<div class="empty-chat-message">Нет сообщений</div>';
        return;
    }
    
    container.innerHTML = messages.map(msg => {
        const isOwn = msg.senderId === currentUserId;
        return `
            <div class="message-row ${isOwn ? 'own' : ''}">
                <div class="message-avatar">${msg.senderAvatar || '?'}</div>
                <div class="message-bubble">
                    ${msg.text}
                    <div class="message-meta">${formatTime(msg.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
    container.scrollTop = container.scrollHeight;
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function showModal(content) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    container.innerHTML = content;
    overlay.style.display = 'block';
    container.style.display = 'block';
}

export function hideModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('modal-container').style.display = 'none';
}