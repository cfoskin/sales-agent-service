'use strict';

const SalesAgent = require('../model/SalesAgent');

exports.create = (req, res) => {
    const salesAgent = new SalesAgent(req.body);
    salesAgent.id = Date.now().toString();
    salesAgent.save()
        .then(newSalesAgent => {
            return res.status(201).json(newSalesAgent);
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Error creating sales agent',
                error: err
            });
        })
};

exports.getOne = (req, res) => {
    SalesAgent.findOne({ id: req.params.id })
        .then(salesAgent => {
            if (salesAgent != null) {
                return res.status(200).json(salesAgent)
            }
        })
        .catch(err => {
            return res.status(404).json({
                message: 'id not found',
                error: err
            })
        })
};

exports.getAll = (req, res) => {
    SalesAgent.find({}).exec()
        .then(salesAgents => {
            return res.status(200).json(salesAgents);
        })
};

exports.update = (req, res) => {
    SalesAgent.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { 'new': true })
        .then(salesAgent => {
            if (salesAgent != null) {
                return res.status(200).json(salesAgent);
            }
        })
        .catch(err => {
            return res.status(404).json({
                message: 'id not found',
                error: err
            });
        })
};

exports.delete = (req, res) => {
    SalesAgent.remove({ id: req.params.id })
        .then(salesAgent => {
            return res.status(204).json(salesAgent);
        })
        .catch(err => {
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
            return res.status(200).json(salesAgents);
        })
        .catch(err => {
            return res.status(404).end({
                message: 'No agents found!',
                error: err
            });
        })
};

exports.searchAgentsInRange = (req, res) => {
    //descoped from sprint due to android feature missing
    return res.status(200).json([]);
};