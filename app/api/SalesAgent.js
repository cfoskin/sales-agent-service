'use strict';
const SalesAgent = require('../model/SalesAgent');
const winston = require('winston');
require('winston-loggly-bulk');

winston.add(winston.transports.Loggly, {
    token: process.env.LOGGLY_TOKEN,
    subdomain: "columfoskin",
    tags: ["sales-agent-service"],
    json: true
});

if(process.env.NODE_ENV === 'test'){
    winston.remove(winston.transports.Console);
};

exports.create = (req, res) => {
    const salesAgent = new SalesAgent(req.body);
    winston.info('Received request to create new sales agent: ' + salesAgent + ' - requestId: ' + req.requestId);
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
    winston.info('Received request to get sales agent' + req.params.id + ' - requestId: ' + req.requestId);
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
    winston.info('Received request to get all sales agents - requestId: ' + req.requestId);
    SalesAgent.find({}).exec()
        .then(salesAgents => {
            winston.info('retrieved sales agents' + JSON.stringify(salesAgents));
            return res.status(200).json(salesAgents);
        })
};

exports.update = (req, res) => {
    console.log(req.body);
    winston.info('Received request to update sales agent: ' + req.params.id + ' - requestId: ' + req.requestId);
     SalesAgent.findOne({ id: req.params.id })
        .then(salesAgent => {
            let coordinates = [
                [],
                []
            ];
            //setting the cordinates on the 2d array for geospatial query
            coordinates[0] = req.body.latitude;
            coordinates[1] = req.body.longitude;
            //update agent details
            salesAgent.latitude = req.body.latitude;
            salesAgent.longitude = req.body.longitude;
            salesAgent.coordinates = coordinates;
            salesAgent.status = req.body.status;
            salesAgent.save().then(newSalesAgent => {
                    winston.info('updated sales agent' + JSON.stringify(salesAgent));
                    return res.status(204).json(newSalesAgent);
                })
                .catch(err => {
                    winston.error(JSON.stringify(err));
                    return res.status(500).json({
                        message: 'Error updating sales agent',
                        error: err
                    });
                });
        }).catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(404).json({
                message: 'id not found',
                error: err
            });
        });
};

exports.delete = (req, res) => {
    winston.info('Received request to delete sales agent: ' + req.params.id + ' - requestId: ' + req.requestId);
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
    winston.info('Received request to search for agents in : ' + req.query.status + ' ' + req.query.location + ' - requestId: ' + req.requestId);
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
    winston.info('Received request to search for agents in range of: lat:' + req.query.latitude + ',  long: ' + req.query.longitude
     + ' - requestId: ' + req.requestId);
    var limit = req.query.limit || 10;
    var radius = req.query.radius;
    radius /= 111.12;
    var coords = [];
    coords[0] = req.query.latitude;
    coords[1] = req.query.longitude;
    // find an agent in the radius of the circle on the map
    SalesAgent.find({
        coordinates: {
            $near: coords,
            $maxDistance: radius
        }
    }).limit(limit).exec(function(err, salesAgents) {
        if (err) {
            winston.error(JSON.stringify(err));
            return res.status(204).json({
                message: 'no agents found',
                salesAgents: []
            });
        }
        winston.info('found sales agents:' + JSON.stringify(salesAgents));
        res.status(200).json(salesAgents);
    });
};
