'use strict';

const eventHandlers = {
  'User.Registered': function(db, event, commit) {
    const authEntry = {
      passwordHash: event.eventPayload.passwordHash,
      user: {
        ID: commit.sequenceID,
        displayName: event.eventPayload.displayName
      }
    };
    return db.addUser(event.eventPayload.email, authEntry);
  }
};

module.exports = function() {
  this.requires('subscriber');
  this.requires('authDB');
  this.provides('authBuilder', function({ subscriber, authDB }) {
    subscriber.queue('authBuilder').bind('User.*').listen(function({ event, commit }) {
      const eventName = `${commit.aggregateType}.${event.eventType}`;
      if (eventHandlers[eventName]) {
        return eventHandlers[eventName](authDB, event, commit);
      }
    });
  });
};
