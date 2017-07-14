'use strict';

const React = require('react');

class App extends React.Component {
  constructor(props) {
    super(props);
    this._db = props.firebase;
    this._cleanupTasks = [];
    this.state = {
      // Start with an empty template of a database:
      db: {
        profiles: {}
      }
    };
  }

  componentWillMount() {
    const self = this;
    // Set up our listener:
    function updateProfiles(profiles) {
      // Copy over all keys from state:
      self.setState(Object.assign({}, self.state, {
        // Copy all keys from db:
        db: Object.assign({}, self.state.db, {
          // Just replace "profiles":
          profiles: profiles
        })
      }));
    }
    this._profileUpdater = updateProfiles;
    const profilesRef = this._db.database().ref('/profiles');
    profilesRef.on('value', updateProfiles);
    this._cleanupTasks.push(function removeListener() {
      profilesRef.off('value', updateProfiles);
    });
  }

  render() {
    return <pre>{JSON.stringify(this.state.db.profiles)}</pre>;
  }

  componentWillUnmount() {
    this._cleanupTasks.forEach(function(task) {
      task();
    });
  }
}

module.exports = App;
