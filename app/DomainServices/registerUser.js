'use strict';

const User = require('../Entities/User');

/**
 * Register a user account.
 * @param {Object} deps
 * @param {Object} params
 * @param {string} params.userID - ID of the user to register.
 * @param {string} params.displayName - The full name to assign to the user.
 * @param {string} params.email - The e-mail address used for logging on.
 * @param {string} params.password - The plain-text form of the password to give to the user.
 */
module.exports = async function registerUser({ repository, config }, params) {
  return await repository.invoke(User, params.userID, async function(userInstance) {
    return await userInstance.register(params, { config });
  });
};
