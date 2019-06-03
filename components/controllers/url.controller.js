/**
 * Url controller for url mongo model
 */
const config = require('../../config');
const Urls = require('../models/urls');
module.exports = {
    save: async function(data) {
        let url = new Urls(data);
        let err, result;
        try {
            result = await url.save();
        } catch (ex) {
            err = ex;
        }
        return [err, result];
    },
    getOneby: async function(params) {
        let err, result;
        try {
            result = await Urls.findOne(params);
        } catch (ex) {
            err = ex;
        }
        return [err, result];
    }
};