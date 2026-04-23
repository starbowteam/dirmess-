export class User {
  constructor({ id, name, tag, password, avatar }) {
    this.id = id;
    this.name = name;
    this.tag = tag;
    this.password = password;
    this.avatar = avatar || name.charAt(0).toUpperCase();
  }

  toSession() {
    return { id: this.id, name: this.name, tag: this.tag, avatar: this.avatar };
  }
}