'use strict';

const AuthDB = require('../Infrastructure/AuthDB');

module.exports = function() {
  this.provides('authDB', function() {
    const db = new AuthDB();
    return db;
  });
};
