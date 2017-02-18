'use strict';
const SalesAgent = require('../model/SalesAgent');
const winston = require('winston');
const mdk_express = require('datawire_mdk_express');
const mdk_winston = require('datawire_mdk_winston');
// Route Winston logging to the MDK:
const options = {
    mdk: mdk_express.mdk,
    name: 'sales-agent-service'
};
winston.add(mdk_winston.MDKTransport, options);

exports.create = (req, res) => {
    const salesAgent = new SalesAgent(req.body);
    winston.info('Received request to create new sales agent: ' + salesAgent);
    salesAgent.id = Date.now().toString();
    salesAgent.save()
        .then(newSalesAgent => {
            winston.info('created sales agent: ' + JSON.stringify(salesAgent));
            return res.status(201).json(newSalesAgent);
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(500).json({
                message: 'Error creating sales agent',
                error: err
            });
        });
};

exports.getOne = (req, res, next) => {
    winston.info('Received request to get sales agent' + req.params.id);
    SalesAgent.findOne({ id: req.params.id })
        .then(salesAgent => {
            if (salesAgent != null) {
                winston.info('retrieved sales agent' + JSON.stringify(salesAgent));
                return res.status(200).json(salesAgent)
            }
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(404).json({
                message: 'id not found',
                error: err
            });
        });
};

exports.getAll = (req, res) => {
    winston.info('Received request to get all sales agents');
    SalesAgent.find({}).exec()
        .then(salesAgents => {
            winston.info('retrieved sales agents' + JSON.stringify(salesAgents));
            return res.status(200).json(salesAgents);
        })
};

exports.update = (req, res) => {
    winston.info('Received request to update sales agent: ' + req.params.id);
    SalesAgent.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { 'new': true })
        .then(salesAgent => {
            console.log(salesAgent);
            if (salesAgent != null) {
                winston.info('updated sales agent' + JSON.stringify(salesAgent));
                return res.status(200).json(salesAgent);
            };
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(501).json({
                message: 'error updating',
                error: err
            });
        })
};

exports.delete = (req, res) => {
    winston.info('Received request to delete sales agent: ' + req.params.id);
    SalesAgent.remove({ id: req.params.id })
        .then(salesAgent => {
            winston.info('deleted sales agent: ' + JSON.stringify(salesAgent));
            return res.status(204).json(salesAgent);
        })
        .catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(404).json({
                message: 'id not found',
                error: err
            });
        });
};

var createFilterObject = (path, filter) => {
    const filterObject = {};
    const comparator = {};
    const operator = '$eq';
    comparator[operator] = filter;
    filterObject[path] = comparator;
    return filterObject;
};

exports.searchAgents = (req, res) => {
    winston.info('Received request to search for agents in : ' + req.query.status + ' ' + req.query.location);
    let filterObject = {};
    let path;
    if (req.query.status != '') {
        path = Object.keys(req.query)[0];
        filterObject = createFilterObject(path, req.query.status);
    } else if (req.query.location != '') {
        path = Object.keys(req.query)[1];
        filterObject = createFilterObject(path, req.query.location);
    }
    SalesAgent.find(filterObject || {})
        .exec().then(salesAgents => {
            winston.info('found sales agents:' + JSON.stringify(salesAgents));
            return res.status(200).json(salesAgents);
        });
};

exports.searchAgentsInRange = (req, res) => {
    //descoped from sprint due to android feature missing
    return res.status(200).json([]);
};
