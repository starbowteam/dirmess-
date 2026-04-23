export class Chat {
  constructor({ id, type = 'private', participants = [], name = '', avatar = null }) {
    this.id = id;
    this.type = type;
    this.participants = participants;
    this.name = name;
    this.avatar = avatar;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.lastMessage = '';
  }
}