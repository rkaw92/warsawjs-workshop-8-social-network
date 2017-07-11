'use strict';

module.exports = function() {
  this.requires('subscriber');
  this.provides('eventLog', function({ subscriber }) {
    console.log('--- Event log:');
    subscriber.queue('eventLog').bind('*.*').listen(function({ event, commit }) {
      console.log('* %s.%s (%s): %j', commit.aggregateType, event.eventType, commit.sequenceID, event.eventPayload);
    });
  });
};
