const sqlite3 = require('sqlite3').verbose();
//let db = new sqlite3.Database('./database/magickbox.db');
let logger = require("../logger");

function handle(data, response) {

    let type = data.type;

    response.writeHead(200, {"Content-Type": "text/plain"});

    if(type === "itempage") {
        let request_id = data.id;

        getItemPageById(request_id, (err, row) => {
            if(err) { response.end(""); throw err; }
            if (!row) { response.end(""); }
            else {
                let json = JSON.stringify(row);
                response.write(json);
                response.end();
                logger.log("Item page sended.");
            }
        });
        return;
    }

    if(type === "item") {
        let request_id = data.id;

        getItemById(request_id, (err, row) => {
            if (err)  { response.end(""); throw err; }
            if (!row) { response.end(""); }
            else {
                let json = JSON.stringify(row);
                response.write(json);
                response.end();
                logger.log("Item data sended.");
            }
        });
        return;
    }

    if(type === "itemcategory") {
        let request_id = data.id;
        let request_category = data.category;

        getItemById(request_id, (err, row) => {
            if (err)  { response.end(""); throw err; }
            if (!row) { response.end(""); }
            else {
                if(row.category === request_category) {
                    row.correctCategory = true;
                    let json = JSON.stringify(row);
                    response.write(json);

                }else{
                    response.write("{ \"correctCategory\": false }");
                }

                response.end();

            }
        });
        return;
    }

    response.end();
}

function getItemById(request_id, callback) {
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        let sql = 'SELECT * FROM ShopItems WHERE id = ?';
        db.get(sql, [request_id], callback);
        db.close();
    });
}

function getItemPageById(request_id, callback) {
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        let sql = 'SELECT * FROM ShopItems WHERE id = ?';
        db.get(sql, [request_id], callback);
        db.close();
    });
}

exports.handle = handle;