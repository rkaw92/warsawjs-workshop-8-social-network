'use strict';

const React = require('react');
const Profile = require('./Profile.jsx');

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
          profiles: profiles.val()
        })
      }));
    }
    const profilesRef = this._db.database().ref('/profiles');
    profilesRef.on('value', updateProfiles);
    this._cleanupTasks.push(function removeListener() {
      profilesRef.off('value', updateProfiles);
    });
  }

  render() {
    const userProfiles = Object.keys(this.state.db.profiles).map((profileID) => this.state.db.profiles[profileID]);
    return <div>
      { userProfiles.map((profile) => <Profile key={profile.ID} ID={profile.ID} displayName={profile.displayName} messages={profile.messages} />) }
    </div>;
  }

  componentWillUnmount() {
    this._cleanupTasks.forEach(function(task) {
      task();
    });
  }
}

module.exports = App;
