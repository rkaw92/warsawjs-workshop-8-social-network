'use strict';

const { EventSourcedAggregate, Event } = require('esdf').core;
const bcrypt = require('bcrypt');
const Message = require('../Types/Message');

/**
 * A User is a participant of public discourse, with the capability to present
 *  selected information about themselves and post messages on their Board.
 * @extends {external:EventSourcedAggregate}
 */
class User extends EventSourcedAggregate {
  constructor() {
    super();
    this._registered = false;
    this._displayName = null;
    this._email = null;
    this._passwordHash = null;
    this._messages = [];
    this._messageIDs = new Set();
  }

  /**
   * Register the user in the system, giving them a name, e-mail address and password.
   * @param {Object} params
   * @param {string} params.displayName - The name to show to others.
   * @param {string} params.email - The e-mail address to use for logging on.
   * @param {string} params.password - The password chosen for the user.
   * @param {Object} env
   * @param {Object} env.config - System configuration parameters from the environment.
   * @returns {Promise}
   */
  async register({ displayName, email, password }, { config: { passwordCost = User.constants.defaultPasswordCost } }) {
    // Guard clause: validate inputs.
    if (!displayName || !email || !password) {
      throw new Error('Missing or invalid input data');
    }
    // Guard clause: check if the user is already registered and deduplicate the command if so:
    if (this._registered) {
      return;
    }
    const passwordHash = await bcrypt.hash(password, passwordCost);
    this._stageEvent(new Event('Registered', { displayName, email, passwordHash }));
  }

  /**
   * Publish a message on the user's public Board.
   * @param {Object} params
   * @param {Message} params.message - An object in the shape of a Message, but with "from" and "date" possibly missing (filled in automatically).
   * @param {Object}
   */
  postMessage({ message }, { currentUser }) {
    // Guard clause: validate inputs.
    if (!message || typeof message !== 'object') {
      throw new Error('A message needs to be provided for posting');
    }
    // Construct an actual message object out of the provided "prototype" and
    //  context information about the caller. This way, we do not have to rely
    //  on the caller identifying themselves truthfully.
    const messageInput = {
      ID: message.ID,
      body: message.body,
      from: { ID: currentUser.ID, displayName: currentUser.displayName },
      // Also take the current date to disallow time travelling:
      date: new Date()
    };
    message = new Message(messageInput);
    // Deduplicate the message by ID:
    if (this._messageIDs.has(message.ID)) {
      return;
    }
    // Also deduplicate by content - no need to allow spamming:
    if (this._messages.length > 0 && this._messages[this._messages.length - 1].isSameAs(message)) {
      return;
    }
    // Make sure the message is being posted on an existing user's board:
    if (!this._registered) {
      throw new Error('This user is not registered and no messages may be posted on their board');
    }

    this._stageEvent(new Event('MessagePosted', { message }));
  }

  onRegistered({ eventPayload: payload }) {
    this._registered = true;
    this._displayName = payload.displayName;
    this._email = payload.email;
    this._passwordhash = payload.passwordHash;
  }

  onMessagePosted({ eventPayload: payload }) {
    const message = new Message(payload.message);
    this._messages.push(message);
  }
}
User.constants = {
  defaultPasswordCost: 10
};

module.exports = User;
