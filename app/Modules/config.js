'use strict';

module.exports = function() {
  this.provides('config', function() {
    return {
      passwordCost: 16,
      tokenSecret: process.env.TOKEN_SECRET || 'aspect3Box_Chat',
      firebase: {
        email: process.env.FIREBASE_EMAIL,
        password: process.env.FIREBASE_PASSWORD
      }
    };
  });
};
