'use strict';

const bcrypt = require('bcrypt');

/**
 * Invalid password or user does not exist.
 * @extends Error
 * @property {string} name - Always set to InvalidPasswordError.
 */
class InvalidPasswordError extends Error {
  constructor() {
    super('Invalid password or user does not exist');
    this.name = 'InvalidPasswordError';
  }
}

/**
 * The AuthDB is an in-memory database storing data needed for authenticating
 *  users by checking passwords. Note that this database is totally volatile.
 */
class AuthDB {
  constructor() {
    this._users = new Map();
  }

  /**
   * Add a user entry into the internal authentication store.
   * @param {string} email - The e-mail, serving as user ID.
   * @param {Object} authEntry - The entry to store as corresponding to the user.
   */
  addUser(email, authEntry) {
    if (!email || !authEntry || !authEntry.passwordHash || !authEntry.user) {
      throw new Error('Invalid input for AuthDB#addUser');
    }
    // Note that we don't do duplicate checking - this preserves idempotence.
    this._users.set(email, authEntry);
  }

  /**
   * Check the password for a given user and yield their user details.
   * @param {string} email - The e-mail address ("login") of the user.
   * @param {string} password - The password to verify.
   * @returns {Promise.<Object>} A Promise that resolves with the auth entry's user property.
   */
  authenticate(email, password) {
    if (!this._users.has(email)) {
      return Promise.reject(new InvalidPasswordError());
    }
    const entry = this._users.get(email);
    return bcrypt.compare(password, entry.passwordHash).then(function throwIfPasswordInvalid(isSame) {
      if (!isSame) {
        throw new InvalidPasswordError();
      }
      // Passwords match - return the "user" part of the entry.
      return entry.user;
    }).catch(function(error) {
      //TODO: This is the only spot where we can intercept and log non-password
      // errors, such as bcrypt system failures. Exercise left to the reader.
      // Coalesce ALL errors to a login error to conceal te existence of the
      //  user every time login fails, regardless of the error.
      throw new InvalidPasswordError();
    });
  }
}

module.exports = AuthDB;
