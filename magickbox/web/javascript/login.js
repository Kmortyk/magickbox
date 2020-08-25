//local_storage.js
//base.js

document.addEventListener("DOMContentLoaded", function(event) {
    //action="/AccountServlet" method="POST"
    // var loginForm = document.querySelector("form#main-form");
    //
    //
    // loginForm.onsubmit = function () {
    //
    // };

});

/**
 * @return {boolean}
 */
function submitLogin(loginForm){
    var formElements = loginForm.elements;
    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var accountJson = req.responseText;
            if(LogIn(accountJson, loginForm)){
                window.location = "index.html";
            }
        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("POST", "/AccountServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("type=login&login="+formElements.login.value+"&password="+formElements.password.value);
}

/**
 * @return {boolean}
 */
function LogIn(accountJson, form) {
    if(accountJson === "") return false;
    var result = true;
    var account_attr = JSON.parse(accountJson);

    if(account_attr.checklogin === false || account_attr.checkpassword === false){
        form.elements.login.style.backgroundColor = "#FFCDD2";
        form.elements.password.style.backgroundColor = "#FFCDD2";
        result = false;
    }else{
        form.elements.login.style.backgroundColor = "#F1F8E9";
        form.elements.password.style.backgroundColor = "#F1F8E9";
    }

    if(result){
        SetAccountStorage(account_attr.id, account_attr.login, account_attr.iconPath);
    }

    return result;
}