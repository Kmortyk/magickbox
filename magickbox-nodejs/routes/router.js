let fs = require("fs");
let logger = require("../logger");

function route(handle, pathname, response, requestData) {

    let file_extension = pathname.split('.').pop();

    switch(file_extension)
    {
        case 'htm':
        case 'html':
            response.writeHead(200, {'Content-Type': 'text/html'});
            sendFile(response, pathname);
            break;
        case 'js':
            response.writeHead(200, {'Content-Type': 'text/javascript'});
            sendFile(response, pathname);
            break;
        case 'css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            sendFile(response, pathname);
            break;
        case 'png':
            response.writeHead(200, {'Content-Type': 'image/png'});
            sendFile(response, pathname);
            break;
        case 'jpg':
            response.writeHead(200, {'Content-Type': 'image/jpg'});
            sendFile(response, pathname);
            break;
        case 'gif':
            response.writeHead(200, {'Content-Type': 'image/gif'});
            sendFile(response, pathname);
            break;
        case 'ico':
            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            sendFile(response, pathname);
            break;
        default:
            if (typeof handle[pathname] === 'function') {
                handle[pathname](response, requestData);
            } else {
                logger.log("No request handler found for " + pathname);
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not found");
                response.end();
            }
            break;
    }

    logger.log("Request \'" + pathname + "\' routed.")
}

function sendFile(response, pathname) {
    fs.readFile('./web' + pathname, function (err, data) {
        if (err) {
            response.writeHead(500);
            response.end(err);
            logger.log("Error while send file \'./web" + pathname + "\'.");
            return;
        }
        response.write(data);
        response.end();
        logger.log("File \'./web" + pathname + "\' send.");
    });
}

exports.route = route;