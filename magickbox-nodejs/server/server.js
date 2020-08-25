var http = require("http");
var url = require("url");
var logger = require("../logger");

function start(route, handle) {
    http.createServer(function (request, response) {

        var requestData = "";

        var urlObject = url.parse(request.url);
        var pathname = urlObject.pathname;

        request.setEncoding("utf8");

            request.addListener("data", function(requestDataChunk) {
                requestData += requestDataChunk;
                if (requestData.length > 1e6)
                    request.connection.destroy();
            });

            request.addListener("end", function() {
                if(request.method === 'POST') { route(handle, pathname, response, requestData); }
                if(request.method === 'GET')  { route(handle, pathname, response, urlObject.query); }
            });

    }).listen(8080);

    logger.log('Server running at http://127.0.0.1:8080/');
}

exports.start = start;
