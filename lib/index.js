const crypto = require('crypto'),
    config = require('../config');

function parseUrlQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function generateMD5(string) {
    return crypto.createHash('md5').update(string).digest("hex");
}

function awaitHandler(outerFunc) {
    return function(...params) {
        return outerFunc(...params).catch(console.error);
    };
}

function filterDuplicates(arr) {
    var uniqueLinks = {};
    var results = [];
    arr.forEach(element => {
        if (!uniqueLinks[element]) {
            uniqueLinks[element] = true;
            results.push(element);
        }
    });
    return results;
}


module.exports = {
    parseQueryParams: parseUrlQuery,
    generateMD5: generateMD5,
    filterDuplicates: filterDuplicates,
    To: awaitHandler
}