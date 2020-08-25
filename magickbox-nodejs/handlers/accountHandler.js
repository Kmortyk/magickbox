const sqlite3 = require('sqlite3').verbose();
let logger = require("../logger");

function handle(data, response) {

    var type = data.type;

    //post
    if(type === "profile"){
        let login = data.login;
        getAccount(login, function (err, row) {
            if(err) { logger.log(err.emessage); }
            if(row) {
                let json = JSON.stringify(row);
                response.end(json);
            }
        });
        return;
    }

    if(type === "login"){
        getAccount(data.login, function (err, row) {
            if(err) { logger.log(err.message); }
            if(row)
            {
                row.checkpassword = (data.password === row.password);
                let json = JSON.stringify(row);
                response.end(json);
            }
        });
        return;
    }

    if(type === "registration"){
        var account = {};
        account.login = data.login;
        account.email = data.email;
        account.password = data.password;
        if(account.iconPath == null) account.iconPath = "img/account_icon.png";

        response.writeHead(200, {"Content-Type": "text/json"});

        var uniqueKey = getUniqueKey(account.login);

        addUnverifiedAccount(account, uniqueKey, function (err) {
            if(err) { logger.log(err.message); return; }
            response.end();
        });
    }

    if(type === "verification")
    {
        confirmAccount(data.uk, function (err) {
                if(err) { response.end("{ \"successfully\": false }"); logger.log(err.message); return; }
                response.end("{ \"successfully\": true }");
        });
        return;
    }

    response.end();
}

function getAccount(login, callback) {
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        let sql = 'SELECT * FROM Accounts WHERE login LIKE \'?\'';
        db.get(sql, [login], callback);
        db.close();
    });
}

function addUnverifiedAccount(account, uniqueKey, callback){
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        db.run("INSERT INTO UnverifiedAccounts (login, password, email, iconpath, UniqueKey) " +
            "VALUES ( " +
            "\'" + account.login + "\', "    +
            "\'" + account.password + "\', " +
            "\'" + account.email + "\', "    +
            "\'" + account.iconPath + "\'," +
            "\'" + uniqueKey + "\' )",
            callback);
        db.close();
        return true;
    });
}

function confirmAccount(uniqueKey, callback){
    let db = new sqlite3.Database('./database/magickbox.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        let sql = "SELECT * FROM UnverifiedAccounts WHERE UniqueKey LIKE \'?\'";
        db.get(sql, [uniqueKey], function (err, row) {
            if (err)  { response.end(""); throw err; }

            let sql = "INSERT INTO Accounts (login, password, email, iconpath) " +
                "VALUES ( " +
                "\'" + row.login + "\', "    +
                "\'" + row.password + "\', " +
                "\'" + row.email + "\', "    +
                "\'" + row.iconPath + "\' )";
            db.run("DELETE FROM UnverifiedAccounts WHERE UniqueKey LIKE \'" + uniqueKey + "\'", [], callback);
        });

        db.close();
    });
}

function getUniqueKey(login){
    return randomBytes() * 2 * login;
}

exports.handle = handle;