const express = require('express');
const SalesAgentApi = require('./app/api/salesAgent');
const AccountApi = require('./app/api/account');

/* routes for push configuration api */
module.exports = (function() {
    'use strict';
    const api = express.Router();
    api.post('/login', AccountApi.login);
    api.post('/logout', AccountApi.logout);
    //Sales Agents
    // api.post('/saleagents', SalesAgentApi.create);
    // api.delete('/saleagents/:id', SalesAgentApi.delete);
    // api.get('/salesagents/:id', SalesAgentApi.getOne); //different route to original
    // api.get('/saleagents', SalesAgentApi.getAll);
    // api.put('/saleagents/:id', SalesAgentApi.update);
    // api.get('/saleagents/searchAgents', SalesAgentApi.searchAgents);
    // api.get('/saleagents/searchagentsinrange', SalesAgentApi.searchAgentsInRange);
    return api;
})();
