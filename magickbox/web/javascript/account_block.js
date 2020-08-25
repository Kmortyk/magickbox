//include local_storage

document.addEventListener("DOMContentLoaded", function(event) {

    document.querySelector("img#account-icon").onclick = function () {
        var account_block = document.querySelector("div#account-block");
        if (account_block.style.display === "none" || account_block.style.display === "") {
            account_block.style.display = "block";
        } else {
            account_block.style.display = "none";
        }
    };

    var buttons = document.querySelectorAll("div.account-block-button");
    toggleAccountButtons("none", "block", buttons);

    document.querySelector("div#account-block-exit-button").onclick = function () {
        DeleteAccountStorage("user");
        location.reload();
    };

    user = GetAccountStorage();
    if(user !== null){
        document.querySelector("img#account-icon").src = user.iconPath;
        toggleAccountButtons("block", "none", buttons);
        document.querySelector("div#account-block-login").textContent = user.login;
        document.querySelector("div#account-block-profile-button>a").href = "profile.html?login=" + user.login;
    }
});

function toggleAccountButtons(value_in, value_out, allbuttons) {
    if(!allbuttons) allbuttons = document.querySelectorAll("div.account-block-button");

    for(i = 0; i < allbuttons.length; i++){
        if (allbuttons[i].classList.contains("account-in-button")) {
            allbuttons[i].style.display = value_in;
        } else {
            allbuttons[i].style.display = value_out;
        }
    }
    document.querySelector("div#account-block-login").style.display = value_in;
}