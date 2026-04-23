import { getCurrentUser, getUserChats, addChatToUser, getMessages, saveMessage, findUserByTag } from './storage.js';
import { renderChatList, renderMessages, showModal, hideModal } from './ui.js';
import { generateId } from './utils.js';

let currentChatId = null;
let currentUser = null;

export function initChat() {
    currentUser = getCurrentUser();
    if (!currentUser) return;
    
    loadChats();
    setupEventListeners();
    setupMobileResponsive();
}

function loadChats() {
    const chatIds = getUserChats(currentUser.id);
    // В реальном приложении нужно загружать данные чатов по ID из отдельного хранилища
    // Для простоты будем хранить чаты в том же объекте, но с ключом chat_metadata
    const chats = chatIds.map(id => getChatMetadata(id)).filter(Boolean);
    renderChatList(chats, currentUser.id);
}

function getChatMetadata(chatId) {
    // Упрощённо: ищем в localStorage по ключу chat_ + chatId
    const data = localStorage.getItem(`chat_${chatId}`);
    return data ? JSON.parse(data) : null;
}

function saveChatMetadata(chat) {
    localStorage.setItem(`chat_${chat.id}`, JSON.stringify(chat));
}

function setupEventListeners() {
    // Выбор чата
    document.getElementById('chatListContainer').addEventListener('click', (e) => {
        const chatItem = e.target.closest('.chat-item');
        if (chatItem) {
            const chatId = chatItem.dataset.chatId;
            openChat(chatId);
        }
    });

    // Создание нового чата
    document.getElementById('newChatBtn').addEventListener('click', () => {
        showNewChatModal();
    });

    // Отправка сообщения
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Поиск
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterChats(e.target.value);
    });

    // Вкладки Чаты / Пользователи
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.tab === 'users') {
                showUsersList();
            } else {
                loadChats();
            }
        });
    });

    // Мобильная кнопка назад
    document.getElementById('mobileBackBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('hidden');
    });
}

function openChat(chatId) {
    currentChatId = chatId;
    const chat = getChatMetadata(chatId);
    if (!chat) return;

    // Обновить заголовок
    const otherUser = chat.participants.find(p => p.id !== currentUser.id);
    document.getElementById('chatTitle').textContent = otherUser?.name || 'Чат';
    document.getElementById('chatAvatar').textContent = otherUser?.avatar || '?';
    document.getElementById('chatSubtitle').textContent = 'онлайн';
    
    // Показать поле ввода
    document.getElementById('messageInputArea').style.display = 'flex';
    document.querySelector('.empty-chat-message')?.remove();
    
    // Загрузить сообщения
    const messages = getMessages(chatId);
    renderMessages(messages, currentUser.id);
    
    // На мобильных скрыть сайдбар
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('hidden');
    }
}

function sendMessage() {
    if (!currentChatId) return;
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    const message = {
        id: generateId(),
        chatId: currentChatId,
        senderId: currentUser.id,
        senderAvatar: currentUser.avatar,
        text,
        timestamp: Date.now()
    };

    saveMessage(currentChatId, message);
    
    // Обновить lastMessage в метаданных чата
    const chat = getChatMetadata(currentChatId);
    if (chat) {
        chat.lastMessage = text;
        chat.updatedAt = Date.now();
        saveChatMetadata(chat);
    }
    
    // Перерисовать сообщения
    const messages = getMessages(currentChatId);
    renderMessages(messages, currentUser.id);
    
    input.value = '';
}

function showNewChatModal() {
    showModal(`
        <h3>Новый чат</h3>
        <div class="input-group">
            <label>Введите тег пользователя</label>
            <input type="text" id="newChatTag" placeholder="@tag">
        </div>
        <div class="error-message" id="modalError"></div>
        <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="btn-primary" id="createChatBtn">Создать</button>
            <button class="btn-secondary" id="cancelModalBtn">Отмена</button>
        </div>
    `);
    
    document.getElementById('createChatBtn').addEventListener('click', async () => {
        const tag = document.getElementById('newChatTag').value.trim().replace('@', '');
        const errorEl = document.getElementById('modalError');
        
        if (!tag) {
            errorEl.textContent = 'Введите тег';
            return;
        }
        
        const targetUser = findUserByTag(tag);
        if (!targetUser) {
            errorEl.textContent = 'Пользователь не найден';
            return;
        }
        
        if (targetUser.id === currentUser.id) {
            errorEl.textContent = 'Нельзя создать чат с самим собой';
            return;
        }
        
        // Проверить, существует ли уже чат
        const existingChats = getUserChats(currentUser.id);
        for (const chatId of existingChats) {
            const chat = getChatMetadata(chatId);
            if (chat && chat.participants.some(p => p.id === targetUser.id)) {
                errorEl.textContent = 'Чат уже существует';
                return;
            }
        }
        
        // Создать новый чат
        const chatId = generateId();
        const chat = {
            id: chatId,
            participants: [
                { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
                { id: targetUser.id, name: targetUser.name, avatar: targetUser.avatar }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastMessage: ''
        };
        
        saveChatMetadata(chat);
        addChatToUser(currentUser.id, chatId);
        addChatToUser(targetUser.id, chatId);
        
        hideModal();
        loadChats();
        openChat(chatId);
    });
    
    document.getElementById('cancelModalBtn').addEventListener('click', hideModal);
}

function showUsersList() {
    // Загружаем всех пользователей и показываем
    const users = JSON.parse(localStorage.getItem('drm_users') || '[]');
    const container = document.getElementById('chatListContainer');
    container.innerHTML = users.filter(u => u.id !== currentUser.id).map(user => `
        <div class="chat-item" data-user-id="${user.id}">
            <div class="avatar">${user.avatar || user.name.charAt(0)}</div>
            <div class="chat-item-info">
                <div class="chat-item-title">${user.name}</div>
                <div class="chat-item-lastmsg">@${user.tag}</div>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const userId = item.dataset.userId;
            // Проверить, есть ли чат
            const existingChats = getUserChats(currentUser.id);
            let chatId = null;
            for (const id of existingChats) {
                const chat = getChatMetadata(id);
                if (chat && chat.participants.some(p => p.id === userId)) {
                    chatId = id;
                    break;
                }
            }
            if (chatId) {
                openChat(chatId);
            } else {
                // Создать чат
                const targetUser = users.find(u => u.id === userId);
                if (targetUser) {
                    createChatWithUser(targetUser);
                }
            }
        });
    });
}

function createChatWithUser(targetUser) {
    const chatId = generateId();
    const chat = {
        id: chatId,
        participants: [
            { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
            { id: targetUser.id, name: targetUser.name, avatar: targetUser.avatar }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastMessage: ''
    };
    saveChatMetadata(chat);
    addChatToUser(currentUser.id, chatId);
    addChatToUser(targetUser.id, chatId);
    loadChats();
    openChat(chatId);
}

function filterChats(query) {
    // Простая фильтрация по имени в списке
    const items = document.querySelectorAll('.chat-item');
    items.forEach(item => {
        const title = item.querySelector('.chat-item-title span')?.textContent.toLowerCase() || '';
        item.style.display = title.includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

function setupMobileResponsive() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.getElementById('sidebar').classList.remove('hidden');
        }
    });
}