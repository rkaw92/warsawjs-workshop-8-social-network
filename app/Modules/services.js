'use strict';

const esdf = require('esdf');
const serviceFunctions = require('../DomainServices');

module.exports = function() {
  this.requires('config');
  this.requires('repository');
  this.requires('authDB');
  this.provides('services', function({ config, repository, authDB }) {
    const serviceContainer = new esdf.services.ServiceContainer();
    serviceContainer.addResource('config', config);
    serviceContainer.addResource('repository', repository);
    serviceContainer.addResource('authDB', authDB);
    // Add all services:
    Object.keys(serviceFunctions).forEach(function(serviceName) {
      serviceContainer.addService(serviceName, serviceFunctions[serviceName]);
    });
    return serviceContainer;
  });
};
