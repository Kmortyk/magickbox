var server = require("./server/server");
var router = require("./routes/router");
var requestHandlers = require("./handlers/requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/item"] = requestHandlers.item;
handle["/comments"] = requestHandlers.comments;
handle["/account"] = requestHandlers.account;

server.start(router.route, handle);