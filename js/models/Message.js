export class Message {
  constructor({ id, chatId, senderId, senderName, senderAvatar, text, timestamp = Date.now() }) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.senderName = senderName;
    this.senderAvatar = senderAvatar;
    this.text = text;
    this.timestamp = timestamp;
  }
}