/**
 * Worker to intiate crawling of medium.com urls
 *
 */
const cheerio = require('cheerio'),
    config = require('../config'),
    lib = require('../lib'),
    controllers = require('../components/controllers');

let queue = [];
let runningProcess = 0;
let urlCounter = 0;
let mediumUrl = 'https://medium.com/';

// Max number of process allowed
const MAX_PROCESS = config.MAX_PROCESS || 5;
// Experimental config
const MAX_URLS = config.MAX_URLS || 8;
const DELAY = config.DELAY || 1000;


queue.push(mediumUrl);
/**
 * This function crawls medium urls recursively in batches of 5.
 * If encountered url is new after filtering unique url then 
 * that url is saved in DB,similar process happens for query params 
 */
function crawlProcess() {
    let href = queue.shift();
    console.log("Fethching from " + href + "...");
    runningProcess++;
    // Fetching page with url
    lib.fetch(href).then(async(res) => {
        let htmlRes = res.body;
        const $ = cheerio.load(htmlRes);
        let querySelectorString = `a[href^="${mediumUrl}"]`;
        let anchorUrls = [];
        // Running query selector to get all anchore nodes
        // which have href starting with ${mediumUrl}
        $(querySelectorString).filter((key, node) => {
            anchorUrls.push(node.attribs.href);
        });
        //Stripping end slashes and filtering duplicate Urls
        anchorUrls = lib.filterDuplicates(anchorUrls);
        queue = queue.concat(anchorUrls);

        let urlInfo = href ? href.split("?") : "";
        let url = urlInfo[0];
        // Building params for db to store
        let data = {
            url: url,
            md5: lib.generateMD5(url)
        };
        // Parsing url query params
        let urlParams = urlInfo[1] ? lib.parseQueryParams(urlInfo[1]) : null;
        let urlRes, queryRes;

        try {
            // See if url data already exist in DB or not;
            urlRes = await controllers.urlCtrl.getOneby({ md5: data.md5 });
            if (!urlRes[1] || !urlRes[1]._id) {
                // Saving new url data in DB
                urlRes = await controllers.urlCtrl.save(data);
                urlCounter++;
                console.log("URL COUNTER: ", urlCounter);
            }
            if (urlParams && urlRes && urlRes[1]) {
                let queryKeys = Object.keys(urlParams);
                let queryValues = queryKeys.map((key) => {
                    return urlParams[key];
                });
                let queryData = {
                    uid: urlRes[1]._id,
                    params: queryKeys,
                    values: queryValues,
                    meta: {
                        href: href
                    },
                    md5: lib.generateMD5(href)
                };
                // See if query data already exist in DB or not;
                queryRes = await controllers.paramsCtrl.getOneby({ md5: queryData.md5 });
                if (!queryRes[1] || !queryRes[1]._id) {
                    // Saving new query params data in DB
                    queryRes = await controllers.paramsCtrl.save(queryData);
                }
            }
        } catch (ex) {
            console.debug(ex);
        }
        if (runningProcess < MAX_PROCESS && queue.length) {
            crawlProcess();
        }
        runningProcess--;
    }, (reject) => {
        console.debug("Fetching error ", reject);
        queue.push(href);
        setTimeout(() => {
            crawlProcess();
        }, (runningProcess + 1) * 1000);
    });
    // Setting up MAX_PROCESS (5) asynchronous crawcallslProcess
    // for the first after fetching landing page, otherwise it will always process 1-1;
    if (runningProcess < MAX_PROCESS && queue.length) {
        crawlProcess();
    }
}

module.exports = crawlProcess;