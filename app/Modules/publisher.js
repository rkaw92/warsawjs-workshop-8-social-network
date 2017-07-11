'use strict';

const esdf = require('esdf');

module.exports = function() {
  this.requires('streamer');
  this.provides('publisher', function({ streamer }) {
    const eventPublisher = new esdf.test.DummyEventBusPublisher();
    streamer.setPublisher(eventPublisher);
    return eventPublisher;
  });
};
