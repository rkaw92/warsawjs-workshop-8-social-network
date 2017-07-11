'use strict';

const modules = [
  require('./app/Modules/config'),
  require('./app/Modules/sink'),
  require('./app/Modules/streamer'),
  require('./app/Modules/publisher'),
  require('./app/Modules/subscriber'),
  require('./app/Modules/repository'),
  require('./app/Modules/services')
];

const CompositionManager = require('app-compositor').CompositionManager;
const app = new CompositionManager();
app.runModules(modules).then(async function({ services }) {
  const currentUser = { ID: '745a6334-e876-5813-ade2-352170f6b1df', displayName: 'Admin' };
  const service = services.createServiceGetter({});
  console.log(await service('registerUser')({ userID: '1c984841-a6b5-530c-a89e-c9895309c3e5', displayName: 'Rob', email: 'rob@bob.com', password: '12345' }, { currentUser }));
}).done();
