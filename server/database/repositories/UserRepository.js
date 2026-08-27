/**
 * GitQuest Backend Repository: User & Authentication Queries
 */

import { db } from '../db.js';

export class UserRepository {
  static findById(id) {
    return db.get('SELECT id, username, email, created_at, last_login, is_active FROM users WHERE id = ?', [id]);
  }

  static findByUsername(username) {
    return db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username.trim()]);
  }

  static findByEmail(email) {
    return db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  }

  static findByUsernameOrEmail(identifier) {
    const clean = identifier.trim();
    return db.get(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
      [clean, clean]
    );
  }

  static create(user) {
    return db.run(
      `INSERT INTO users (id, username, email, password_hash, salt, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, user.username, user.email, user.passwordHash, user.salt, user.createdAt || new Date().toISOString()]
    );
  }

  static updateLastLogin(userId) {
    return db.run(
      'UPDATE users SET last_login = ? WHERE id = ?',
      [new Date().toISOString(), userId]
    );
  }

  static updatePassword(userId, passwordHash, salt) {
    return db.run(
      'UPDATE users SET password_hash = ?, salt = ? WHERE id = ?',
      [passwordHash, salt, userId]
    );
  }

  static count() {
    return db.get('SELECT COUNT(*) as count FROM users')?.count || 0;
  }
}
