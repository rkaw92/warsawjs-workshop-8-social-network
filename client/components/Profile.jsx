'use strict';

const Post = require('./Post.jsx');
const React = require('react');

function Profile({ ID, displayName, messages = {} }) {
  const posts = Object.keys(messages).map(function(messageID) {
    const message = messages[messageID];
    return {
      ID: message.ID,
      date: new Date(message.date),
      body: message.body,
      from: message.from
    };
  }).sort(function linearMessageSort(a, b) {
    if (a.date.getTime() < b.date.getTime()) {
      return -1;
    } else if (a.date.getTime() > b.date.getTime()) {
      return 1;
    } else {
      return (a.ID < b.ID) ? -1 : 1;
    }
  });
  return <div className="profile">
    <div className="user-info">
      <h1>{displayName}</h1>
      <span className="user-id">{ID}</span>
    </div>
    <div className="user-posts">
      <h2>Posty na tablicy</h2>
      { posts.map((post) => <Post key={post.ID} ID={post.ID} date={post.date} body={post.body} from={post.from} />) }
    </div>
  </div>;
}

module.exports = Profile;
