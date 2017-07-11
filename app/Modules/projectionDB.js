'use strict';

const firebase = require('firebase');

module.exports = function() {
  this.requires('config');
  this.provides('projectionDB', function({ config }) {
    const firebaseConfig = {
      apiKey: "AIzaSyCDfx5eDU2b70rluCc1lM8QRQYoeYnBtWU",
      authDomain: "esdf-rs-firebase.firebaseapp.com",
      databaseURL: "https://esdf-rs-firebase.firebaseio.com",
      projectId: "esdf-rs-firebase",
      storageBucket: "esdf-rs-firebase.appspot.com",
      messagingSenderId: "611816333944"
    };
    const app = firebase.initializeApp(firebaseConfig);
    const db = app.database();
    return app.auth().signInWithEmailAndPassword(config.firebase.email, config.firebase.password).then(function() {
      return db;
    });
  });
};
