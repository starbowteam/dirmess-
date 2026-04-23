// Ключи localStorage
const KEYS = {
    USERS: 'drm_users',
    CURRENT_USER: 'drm_currentUser',
    MESSAGES: 'drm_messages',
    CHATS: 'drm_chats'
};

// Инициализация (создаём начальные данные если нет)
export async function initStorage() {
    if (!localStorage.getItem(KEYS.USERS)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.MESSAGES)) {
        localStorage.setItem(KEYS.MESSAGES, JSON.stringify({}));
    }
    if (!localStorage.getItem(KEYS.CHATS)) {
        localStorage.setItem(KEYS.CHATS, JSON.stringify({}));
    }
}

// Пользователи
export function getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
}

export function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function findUserByTag(tag) {
    return getUsers().find(u => u.tag.toLowerCase() === tag.toLowerCase());
}

export function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
}

// Сессия
export function setCurrentUser(user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getCurrentUser() {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
}

export function logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
}

// Чаты (для каждого пользователя храним список ID чатов)
export function getUserChats(userId) {
    const allChats = JSON.parse(localStorage.getItem(KEYS.CHATS)) || {};
    return allChats[userId] || [];
}

export function addChatToUser(userId, chatId) {
    const allChats = JSON.parse(localStorage.getItem(KEYS.CHATS)) || {};
    if (!allChats[userId]) allChats[userId] = [];
    if (!allChats[userId].includes(chatId)) {
        allChats[userId].push(chatId);
        localStorage.setItem(KEYS.CHATS, JSON.stringify(allChats));
    }
}

// Сообщения
export function getMessages(chatId) {
    const allMessages = JSON.parse(localStorage.getItem(KEYS.MESSAGES)) || {};
    return allMessages[chatId] || [];
}

export function saveMessage(chatId, message) {
    const allMessages = JSON.parse(localStorage.getItem(KEYS.MESSAGES)) || {};
    if (!allMessages[chatId]) allMessages[chatId] = [];
    allMessages[chatId].push(message);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMessages));
}