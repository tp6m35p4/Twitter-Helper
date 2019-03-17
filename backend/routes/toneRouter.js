var express = require('express');
var router = express.Router();
var toneController = require('../controllers/toneController');
var discoveryService = require('../services/discoveryService');
var analyzerMiddleware = require('../middlewares/analyzerMiddleware');
router.get('/', function(req, res) {
    res.send("success");
})
router.post('/', analyzerMiddleware, toneController.toneAnalysis);
// router.options('/',  function(req, res) {
//     return res.status(200);
// });
// router.get('/dis', analyzerMiddleware, function(req, res) {
//     discoveryService(["drug", "border"], function(err, data) {
//         res.json(data)
//     });
// })
module.exports = router;