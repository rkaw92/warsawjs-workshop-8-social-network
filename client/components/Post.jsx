'use strict';

const React = require('react');
const formatDate = require('date-fns/format')

function Post({ ID, body, from, date }) {
  return <div className="post">
    <div className="post-metadata">
      <span className="post-author">{ from.displayName }</span><span> / </span><span className="post-date">{ formatDate(date, 'YYYY-MM-DD HH:mm:ss') }</span>
    </div>
    <span className="post-body">{ body }</span>
  </div>;
}

module.exports = Post;
