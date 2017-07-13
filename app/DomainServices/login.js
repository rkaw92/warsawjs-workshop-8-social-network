'use strict';

// Note: this uses an eventually-consistent data store for actually
//  verifying the password, so it can be considered outside the
//  core domain.

const jwt = require('jsonwebtoken');

/**
 * Login the current user and return a JSON Web Token which can be used for
 *  accessing the system's API. Also set a cookie if possible.
 * @param {Object} deps
 * @param {Object} params
 * @param {string} params.email - The e-mail to use for logging in.
 * @param {string} params.password - The password to present for verification.
 * @returns {Promise.<string>} A Promise for a JSON Web Token string.
 */
module.exports = async function login({ authDB, config, res }, { email, password }) {
  const user = await authDB.authenticate(email, password);
  const token = jwt.sign(user, config.tokenSecret, { expiresIn: 86400, algorithm: 'HS256' });
  // Conditionally set a cookie if running in an HTTP context
  // (there are no other "contexts" as of now)
  if (res) {
    res.setCookie('token', token, {  httpOnly: true });
  }
  return token;
};
