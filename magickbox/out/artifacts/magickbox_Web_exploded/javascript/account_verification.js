//local_storage.js
//base.js

document.addEventListener("DOMContentLoaded", function(event) {

    var uk = getParameterByName("uk");

    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var registration_attr = JSON.parse(req.responseText);
            if(registration_attr.successfully === true){
                document.querySelector("h1#account-verification-result").innerHTML = "УСПЕШНО";
            }else{
                document.querySelector("h1#account-verification-result").innerHTML = "ОШИБКА ПОДТВЕРЖДЕНИЯ АККАУНТА";
            }
        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("POST", "/AccountServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("type=verification&uk=" + uk);
});