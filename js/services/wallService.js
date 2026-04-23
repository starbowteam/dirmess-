import { getAllWallPosts, addWallPost } from '../storage/localStorageDB.js';
import { generateId } from '../utils/helpers.js';

export class WallService {
  static getPosts() {
    return getAllWallPosts();
  }

  static publishPost(author, content) {
    const post = {
      id: generateId(),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      content,
      timestamp: Date.now(),
      likes: []
    };
    addWallPost(post);
    return post;
  }
}