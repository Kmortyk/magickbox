//include base.js
//include local_storage.js

document.addEventListener("DOMContentLoaded", function(event) {

    var login = getParameterByName("login");

    var req = newXMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var itemJson = req.responseText;
            if(itemJson === ""){ return; }
            var item_attr = JSON.parse(itemJson);


            document.querySelector("div#profile-avatar>img").src = item_attr.iconPath;
            document.querySelector("div#profile-login").innerHTML = "Login " + login;
            document.querySelector("div#profile-email").innerHTML = "Email " + item_attr.email;
            if(item_attr.login===login)document.querySelector("div#profile-available-money").innerHTML = "Ur money!";

        }
        else { console.log("HTTP error: " + req.status); }
    };

    req.open("POST", "/AccountServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("type=profile&login=" + login);
    id++;

});