'use strict';

const modules = [
  require('./app/Modules/config'),
  require('./app/Modules/sink'),
  require('./app/Modules/streamer'),
  require('./app/Modules/publisher'),
  require('./app/Modules/subscriber'),
  require('./app/Modules/repository'),
  require('./app/Modules/services'),
  require('./app/Modules/webAPI'),
  require('./app/Modules/eventLog'),
  require('./app/Modules/projectionDB'),
  require('./app/Modules/projectionBuilder')
];

const CompositionManager = require('app-compositor').CompositionManager;
const app = new CompositionManager();
app.runModules(modules).then(function({ streamer }) {
  // Start propagating Domain Events to subscribers:
  streamer.start();
}).done();
