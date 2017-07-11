'use strict';

const User = require('../Entities/User');

/**
 * Post a message to a user's public board.
 * @param {Object} deps
 * @param {Object} params
 * @param {string} params.userID - ID of the user on whose board to post.
 * @param {Message} params.message - The Message to put on the board. The date and "from" field can be left undefined.
 */
module.exports = async function postMessage({ repository, currentUser }, params) {
  return await repository.invoke(User, params.userID, function(userInstance) {
    return userInstance.postMessage(params, { currentUser });
  });
};
