'use strict';

/**
 * A Message is a ValueObject representing a single piece of information
 *  communicated by somebody.
 * @property {string} ID - The unique ID of this message. Must be 36 characters long (UUID).
 * @property {string} body - The text content of the communication.
 * @property {Object} from - An identification of the user who posted the message.
 * @property {string} from.ID - ID of the message's sender.
 * @property {string} from.displayName - The name of the user who posted the message, at the time of posting.
 * @property {Date} date - The date/time of posting.
 */
class Message {
  constructor({ ID, body, from, date }) {
    if (!ID || typeof ID !== 'string' || ID.length !== 36) {
      throw new Error('Validation error: Message#ID');
    }
    if (!body || typeof body !== 'string' || body.length > 140) {
      throw new Error('Validation error: Message#body');
    }
    if (!from || typeof from !== 'object' || !from.ID || !from.displayName || typeof from.ID !== 'string' || typeof from.displayName !== 'string') {
      throw new Error('Validation error: Message#from');
    }
    // Catch invalid dates, too:
    if (!date || isNaN((new Date(date)).getTime())) {
      throw new Error('Validation error: Message#date');
    }
    this.ID = ID;
    this.body = body;
    this.from = from;
    this.date = new Date(date);
    Object.freeze(this);
  }

  /**
   * Check if this message is considered equivalent content-wise to another
   *  message. This is true iff the message is posted by the same user,
   *  and has the same body.
   * @returns {boolean}
   */
  isSameAs(otherMessage) {
    return (
      otherMessage.body === this.body &&
      otherMessage.from &&
      otherMessage.from.ID === this.from.ID &&
      otherMessge.from.displayName === this.from.displayName
    );
  }
}
module.exports = Message;
