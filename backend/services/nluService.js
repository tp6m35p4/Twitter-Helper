var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var apikey = require('../configs/apikey');
var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: apikey.nluServiceKey,
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

var parameters = {
  
  'features': {
    'keywords': {
      'sentiment': true,
      'emotion': true,
      'limit': 2
    }
  }
};



module.exports = function(data, cb) {
    parameters.text = data;
    naturalLanguageUnderstanding.analyze(parameters, function(err, response) {
        if (err)
            cb(true, null);
        else {
            var resKeywords = [];
            response.keywords.forEach(element => {
                resKeywords.push(element.text);
            });
            cb(false, resKeywords);
        }
    });
}