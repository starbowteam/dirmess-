const KEYS = {
  USERS: 'drm_users',
  CURRENT_USER: 'drm_currentUser',
  MESSAGES: 'drm_messages',
  CHATS: 'drm_chats',
  WALL: 'drm_wall'
};

export function initStorage() {
  for (let key of Object.values(KEYS)) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(key === KEYS.MESSAGES || key === KEYS.CHATS ? {} : []));
    }
  }
}

export const getUsers = () => JSON.parse(localStorage.getItem(KEYS.USERS));
export const saveUser = user => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};
export const findUserByTag = tag => getUsers().find(u => u.tag?.toLowerCase() === tag?.toLowerCase());
export const getCurrentUser = () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
export const setCurrentUser = user => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));

export const getUserChats = userId => {
  const all = JSON.parse(localStorage.getItem(KEYS.CHATS));
  return all[userId] || [];
};
export const addChatToUser = (userId, chatId) => {
  const all = JSON.parse(localStorage.getItem(KEYS.CHATS));
  if (!all[userId]) all[userId] = [];
  if (!all[userId].includes(chatId)) all[userId].push(chatId);
  localStorage.setItem(KEYS.CHATS, JSON.stringify(all));
};
export const saveChatMeta = chat => localStorage.setItem(`chat_${chat.id}`, JSON.stringify(chat));
export const getChatMeta = chatId => JSON.parse(localStorage.getItem(`chat_${chatId}`));

export const getMessages = chatId => {
  const all = JSON.parse(localStorage.getItem(KEYS.MESSAGES));
  return all[chatId] || [];
};
export const saveMessage = (chatId, msg) => {
  const all = JSON.parse(localStorage.getItem(KEYS.MESSAGES));
  if (!all[chatId]) all[chatId] = [];
  all[chatId].push(msg);
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(all));
};

export const getAllWallPosts = () => JSON.parse(localStorage.getItem(KEYS.WALL));
export const addWallPost = post => {
  const posts = getAllWallPosts();
  posts.unshift(post);
  localStorage.setItem(KEYS.WALL, JSON.stringify(posts));
};