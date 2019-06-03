/**
 * Worker to intiate crawling of medium.com urls
 */
const cheerio = require('cheerio'),
    config = require('../config'),
    lib = require('../lib'),
    controllers = require('../components/controllers');

let queue = [];
let runningProcess = 0;
let urlCounter = 0;
let mediumUrl = 'https://medium.com/';

const MAX_PROCESS = config.MAX_PROCESS || 5;
// Experimental config
const MAX_URLS = config.MAX_URLS || 8;
const DELAY = config.DELAY || 1000;


queue.push(mediumUrl);

function crawlProcess() {
    let href = queue.shift();
    console.log("Fethching from " + href + "...");
    //  Number of URLs to track
    //    if (href && urlCounter <= (MAX_URLS - MAX_PROCESS)) {
    runningProcess++;
    lib.fetch(href).then(async(res) => {
        let htmlRes = res.body;
        const $ = cheerio.load(htmlRes);
        let querySelectorString = `a[href^="${mediumUrl}"]`;
        let anchorUrls = [];
        $(querySelectorString).filter((key, node) => {
            anchorUrls.push(node.attribs.href);
        });
        anchorUrls = lib.filterDuplicates(anchorUrls);
        queue = queue.concat(anchorUrls);
        let urlInfo = href ? href.split("?") : "";
        let url = urlInfo[0];
        let data = {
            url: url,
            md5: lib.generateMD5(url)
        };
        //console.log("RUNNING PROCESS: ", runningProcess);
        let urlParams = urlInfo[1] ? lib.parseQueryParams(urlInfo[1]) : null;
        let urlRes, queryRes;
        try {
            // See if url data already exist or not;
            urlRes = await controllers.urlCtrl.getOneby({ md5: data.md5 });
            if (!urlRes[1] || !urlRes[1]._id) {
                urlRes = await controllers.urlCtrl.save(data);
                // update urlCounter on saving new url
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
                // See if query data already exist or not;
                queryRes = await controllers.paramsCtrl.getOneby({ md5: queryData.md5 });
                //console.log("queryRes", queryRes);
                if (!queryRes[1] || !queryRes[1]._id) {
                    queryRes = await controllers.paramsCtrl.save(queryData);
                }
            }
            //console.log("response ", urlRes, queryRes);
        } catch (ex) {
            console.debug(ex);
        }
        if (runningProcess < MAX_PROCESS && queue.length) {
            //console.log("sync run");
            // linear multiplier can be  added to provide processing delay e.g. runningProcess*100
            crawlProcess();
        }
        runningProcess--;
    }, (reject) => {
        console.log("Fetching error ", reject);
        queue.push(url);
        setTimeout(() => {
            crawlProcess();
        }, (runningProcess + 1) * 1000);
    });
    if (runningProcess < MAX_PROCESS && queue.length) {
        //console.log("async run");
        // linear multiplier can be  added to provide processing delay e.g. runningProcess*100
        crawlProcess();
    }
    //}
    // else {
    //     console.log("I AM DONE !");
    // }
}

module.exports = crawlProcess;