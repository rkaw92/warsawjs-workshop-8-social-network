'use strict';

const eventHandlers = {
  'User.Registered': function(db, event, commit) {
    return Promise.all([
      db.ref(`/accounts/${commit.sequenceID}`).update({
        ID: commit.sequenceID,
        displayName: event.eventPayload.displayName,
        email: event.eventPayload.email,
        passwordHash: event.eventPayload.passwordHash
      }),
      db.ref(`/profiles/${commit.sequenceID}`).update({
        ID: commit.sequenceID,
        displayName: event.eventPayload.displayName,
        posts: []
      })
    ]);
  },
  'User.MessagePosted': function(db, event, commit) {
    return db.ref(`/profiles/${commit.sequenceID}/messages/${event.eventPayload.message.ID}`).update(event.eventPayload.message);
  }
};

module.exports = function() {
  this.requires('subscriber');
  this.requires('projectionDB');
  this.provides('projectionBuilder', function({ subscriber, projectionDB }) {
    subscriber.queue('projectionBuilder').bind('*.*').listen(function({ event, commit }) {
      const eventName = `${commit.aggregateType}.${event.eventType}`;
      // Execute a handler to reflect the effect of the given event on our
      //  projection, if any:
      if (eventHandlers[eventName]) {
        return eventHandlers[eventName](projectionDB, event, commit);
      }
    });
  });
};
