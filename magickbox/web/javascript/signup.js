//local_storage.js
//base.js

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function submitRegistration(loginForm){
    var formElements = loginForm.elements;

    if(!validateEmail(formElements.email.value)){
        formElements.email.style.backgroundColor = "#FFCDD2";
        return;
    }else{
        formElements.email.style.backgroundColor = "#FFFFFF";
    }


    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {

            if(req.responseText === ""){
                alert("Ошибка регистрации, проверьте все поля!");
            }else{
                var registration_attr = JSON.parse(req.responseText);
                sendMail(formElements.email.value, registration_attr.uk);
                alert("Успешно! Подтвердите аккаунт по почте");
                window.location = "index.html";
            }
        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("POST", "/AccountServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("type=registration&login="+formElements.login.value+"&email="+formElements.email.value+
    "&password="+formElements.password.value);
}

function sendMail(email, uk){
    var req = newXMLHttpRequest();
    req.open("POST", "/MailServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("type=v&mail=" + email + "&uk=" + uk);
    alert("I dont know");
}