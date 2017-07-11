'use strict';

const esdf = require('esdf');

module.exports = function() {
  this.requires('publisher');
  this.provides('subscriber', function({ publisher }) {
    const eventSubscriber = new esdf.test.DummyEventBusSubscriber(publisher);
    return eventSubscriber;
  });
};
