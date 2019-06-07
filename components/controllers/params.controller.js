/**
 * Url controller for url mongo model
 */
const config = require('../../config');
const Params = require('../models/params');
module.exports = {
    // To save query params data in DB
    save: async function(data) {
        let urlParams = new Params(data);
        let err, result;
        try {
            result = await urlParams.save();
        } catch (ex) {
            err = ex;
        }
        return [err, result];
    },
    // To get record from DB based on queryParams, e.g. find record by md5
    getOneby: async function(queryParams) {
        let err, result;
        try {
            result = await Params.findOne(queryParams);
        } catch (ex) {
            err = ex;
        }
        return [err, result];
    }
};