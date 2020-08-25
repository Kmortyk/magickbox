var querystring = require("querystring");
var itemsHandler = require(__dirname + "/itemsHandler");
var commentsHandler = require(__dirname + "/commentsHandler");
var accountHandler = require(__dirname + "/accountHandler");
var fs = require("fs");
let logger = require("../logger");

function start(response, requestData) {
    fs.readFile('web/index.html', function(err, content) {
        if (err) {
            response.writeHead(500);
            response.end(err);
            logger.log("Start page error.");
            return;
        }
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
        logger.log("Start page handled.");
    });
}


function item(response, requestData) {
    var data = querystring.parse(requestData);
    itemsHandler.handle(data, response);
}

function comments(response, requestData) {
    var data = querystring.parse(requestData);
    commentsHandler.handle(data, response);
}

function account(response, requestData){
    var data = querystring.parse(requestData);
    accountHandler.handle(data, response);
}

exports.start = start;
exports.item = item;
exports.comments = comments;
exports.account = account;