const sqlite3 = require('sqlite3').verbose();
//let db = new sqlite3.Database('./database/magickbox.db');
let logger = require("../logger");

function handle(data, response) {

    let type = data.type;

    if(type === "addcomment") {
        var comment = {};
        comment.item_id = data.item_id;
        comment.login = data.login;
        comment.message = data.message;
        comment.rating = 0;
        comment.iconPath = data.iconPath;

        addComment(comment, (err) => {
            if(err) {
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.end("{ \"successfully\": false }");
                logger.log(err.message);
            }else{
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.end("{ \"successfully\": true }");
            }
        });

        logger.log("Add comment handled.");
        return;
    }

    if(type === "getcomments") {
        getComments(data.item_id, (err, rows) => {
            if(err) {
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.end("{ \"successfully\": false }");
                logger.log(err.message);
            }

            if(rows.length === 0){
                response.end("");
            }else{
                let json = JSON.stringify(rows);
                response.end(json);
            }
        });
        return;
    }

    response.end();
}

function addComment(comment, callback) {
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        db.run("INSERT INTO Comments (itemid, login, message, rating, iconpath) " +
            "VALUES ( " +
            "\'" + comment.item_id + "\', "    +
            "\'" + comment.login + "\', " +
            "\'" + comment.message + "\', "    +
            "\'" + comment.rating + "\', " +
            "\'" + comment.iconPath + "\' " +
            ")",
            callback);
        db.close();
        return true;
    });
}

function getComments(item_id, callback) {
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        if (err) {
            return logger.log(err.message);
        }
        let sql = 'SELECT * FROM Comments WHERE itemid LIKE ?';
        db.all(sql, [item_id], callback);
        db.close();
    });
}

exports.handle = handle;