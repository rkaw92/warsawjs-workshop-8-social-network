'use strict';

const restify = require('restify');
const cookies = require('restify-cookies');
const jwt = require('jsonwebtoken');

function serviceMiddleware(serviceContainer, config) {
  return function _createServiceGetterForRequest(req, res, next) {
    const tokenCookie = (req.cookies || {}).token;
    let currentUser;
    if (tokenCookie) {
      const user = jwt.verify(tokenCookie, config.tokenSecret, { algorithms: [ 'HS256' ] });
      currentUser = { ID: user.ID, displayName: user.displayName };
    }

    req.getService = serviceContainer.createServiceGetter({ currentUser, req, res });
    return next();
  };
}

module.exports = function() {
  this.requires('services');
  this.requires('config');
  this.provides('webAPI', function({ services, config }) {
    const server = restify.createServer({
      name: 'warsawjs-workshop-8-social-network',
      version: '0.1.0'
    });
    const serverConfig = config.webAPI || {};
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.use(cookies.parse);
    server.use(serviceMiddleware(services, config));

    // Export Domain Services over HTTP:
    server.post('/services/:serviceName', async function(req, res, next) {
      try {
        // Get the service function requested by the user:
        const serviceName = req.params.serviceName;
        const serviceFunction = req.getService(serviceName);
        // Treat the request body (application/json) as service params:
        const result = await serviceFunction(req.body);
        res.send(result);
        return next();
      } catch (error) {
        // Annotate the error:
        error.data = { message: error.message };
        return next(error);
      }
    });

    server.listen(serverConfig.port || 7545);
    return new Promise(function(fulfill, reject) {
      server.on('listening', fulfill);
      server.on('error', reject);
    });
  });
};
