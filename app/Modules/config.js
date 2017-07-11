'use strict';

module.exports = function() {
  this.provides('config', function() {
    return {
      passwordCost: 16
    };
  });
};
