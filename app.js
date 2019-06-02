const request = require('request'),
    util = require('util'),
    //fs = require('fs'),
    crypto = require('crypto'),
    cheerio = require('cheerio'),
    config = require('./config');

let todo = [];
let runningProcess = 0;
let mediumUrl = 'https://medium.com';
const MAX_URLS = 10e6;
const MAX_PROCESS = 5;

todo.push(mediumUrl);

function generateMD5(string) {
    return crypto.createHash('md5').update(string).digest("hex");
}

async function fetch(url) {
    const requestPromise = util.promisify(request);
    const response = await requestPromise(url);
    return response.body;
}

async function process(url) {
    console.log(config);
    const htmlRes = await fetch(url);
    const $ = cheerio.load(htmlRes);
    let querySelectorString = `a[href^="${mediumUrl}"]`;
    let anchorTags = $(querySelectorString);
    anchorTags.each((key, node) => {
        if (node.attribs && node.attribs.href) {
            console.log(key, node.attribs.href, generateMD5(node.attribs.href));
        }
    });

    //console.log(anchorTags);
}
//Intiate crawling
process(mediumUrl);