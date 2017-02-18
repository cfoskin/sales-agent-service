'use strict';
const SalesAgent = require('../model/SalesAgent');
const winston = require('winston');
const mdk_express = require('datawire_mdk_express');
const mdk_winston = require('datawire_mdk_winston');
// Route Winston logging to the MDK:
const options = {
    mdk: mdk_express.mdk,
    name: 'sales-agent-service-account'
}
winston.add(mdk_winston.MDKTransport, options);
//authentication to be implemented
exports.login = (req, res) => {
    const salesAgent = req.body;

    winston.info('Received request to log in sales agent: ' + salesAgent.loginName + ', password:' + salesAgent.password);
    SalesAgent.findOne({ loginName: salesAgent.loginName })
        .then(foundSalesAgent => {
            if (foundSalesAgent) {
                if (foundSalesAgent.password === salesAgent.password) {
                    winston.info('found sales agent : ' + foundSalesAgent);
                    return res.status(200).json(foundSalesAgent)
                } 
                else {
                    winston.warn('unauthorised');
                    return res.status(401).end('unauthorised');
                }
            } 
            else {
                winston.warn('user not found');
                return res.status(404).end('user not found');
            }
        }).catch(err => {
            winston.error(JSON.stringify(err));
            return res.status(500).json({
                message: 'server error',
                error: err
            });
        });
};

exports.logout = (req, res) => {
    return res.status(200).json('logged out');
};
