var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var apikey = require('../configs/apikey');
var toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    iam_apikey: apikey.toneServiceKey,
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
  });


module.exports = function(text, callback) {
    // console.log(text);
    var toneParams = {
        tone_input: { 'text': text },
        content_type: 'application/json'
    };
    
    toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
        if (error) {
            console.log(error);
            callback(true, null);
        } else { 
            var resTone;
            var score;
            toneAnalysis.document_tone.tones.forEach(element => {
                if(typeof score == 'undefined' || score < parseFloat(element.score)) {
                    score = parseFloat(element.score);
                    resTone = element.tone_name;
                }
            });
            callback(false, resTone);
        }
    });
}