var ipList = {};
const requestIp = require('request-ip');
var timeout = require('../configs/timeout');
module.exports = function(req, res, next) {
    var ip = requestIp.getClientIp(req)
    var time = timeout - Date.now() + ipList[ip] || 0;
    console.log(`${ip}...${time}`);
    setTimeout(function() {
        ipList[ip] = Date.now();
        next();
    }, time);
}