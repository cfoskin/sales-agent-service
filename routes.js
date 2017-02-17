const express = require('express');
const SalesAgentApi = require('./app/api/salesAgent');
/* routes for push configuration api */
module.exports = (function() {
    'use strict';
    const api = express.Router();
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
