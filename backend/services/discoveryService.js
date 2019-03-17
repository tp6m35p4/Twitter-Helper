var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var moment = require('moment');
var apikey = require('../configs/apikey');
var discovery = new DiscoveryV1({
  version: '2018-12-03',
  iam_apikey: apikey.discoveryServiceKey,
  url: 'https://gateway.watsonplatform.net/discovery/api'
});

var params = {
    environment_id: 'system',
    collection_id: 'news-en',
    deduplicate: true,
    count: 3,
    return: "title,url"
}

module.exports = function(data, cb) {
    
    data.forEach(element => {
        element = `enriched_text.keywords.text:"${element}"`
    });
    params.query = data.join(',');
    params.filter = [
        "language:(english|en)",
        `crawl_date<${moment().format('YYYY-MM-DDThh:mm:ssZZ')}`

    ].join(',');
    discovery.query(params, function(err, resp) {
        if(err) throw err;
        else {
            resp.results.forEach( element => {
                delete element.id;
                delete element.result_metadata
            });
            cb(null, resp.results);
        }
    })
}