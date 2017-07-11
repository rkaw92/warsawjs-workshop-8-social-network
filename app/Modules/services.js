'use strict';

const esdf = require('esdf');
const serviceFunctions = require('../DomainServices');

module.exports = function() {
  this.requires('config');
  this.requires('repository');
  this.provides('services', function({ config, repository }) {
    const serviceContainer = new esdf.services.ServiceContainer();
    serviceContainer.addResource('config', config);
    serviceContainer.addResource('repository', repository);
    // Add all services:
    Object.keys(serviceFunctions).forEach(function(serviceName) {
      serviceContainer.addService(serviceName, serviceFunctions[serviceName]);
    });
    return serviceContainer;
  });
};
