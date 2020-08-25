let fs = require('fs');

function log(message)
{
    let date = new Date();

    fs.appendFile("./log.txt", message + " " + date.toUTCString() + " \n", (err) => {
        if(err) throw err;
    });

    console.log(message + " " + date.toUTCString() );
}

exports.log = log;