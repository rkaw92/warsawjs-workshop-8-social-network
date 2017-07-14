'use strict';

const firebase = require('firebase/app');
require('firebase/database');
const config = require('./config');
firebase.initializeApp(config);

const App = require('./components/App.jsx');
const react = require('react');
const appElement = react.createElement(App, { firebase });

const ReactDOM = require('react-dom');
ReactDOM.render(appElement, document.getElementById('app'));
