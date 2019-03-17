var toneService = require('../services/toneService');
var nluService = require('../services/nluService');
var discoveryService = require('../services/discoveryService');
var async = require('async');
module.exports = {
    toneAnalysis: function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");

        async.parallel([
            function(cb) {
                toneService(req.body.text, function(err, data) {
            
                    if(err) cb(true, null)
                    else cb(null, data);
                })
            },
            function(cb) {
                async.waterfall([
                    function(callback) {
                        nluService(req.body.text, function(err, data) {
                            if(err) callback(true, null)
                            else callback(null, data)
                        })
                    },
                    function(arg1, callback) {
                        discoveryService(arg1, function(err, data) {
                            if(err) callback(true, null)
                            else callback(null, data)
                        })
                    }
                ], function(err, result) {
                    cb(null, result)
                });
                
            }
        ], function(errs, results) {
            if(errs) return res.status(404);
            else {
                var resJson = {
                    tone: results[0],
                    news: results[1]
                }
                return res.json(resJson);
            }
        })

    }
}