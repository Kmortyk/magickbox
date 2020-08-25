//local_storage.js
//base.js

function addComment(loginForm, item_id){
    var formElements = loginForm.elements;
    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var comment_attr = JSON.parse(req.responseText);
            if(comment_attr.successfully === true){
                window.location.reload(false);
            }else{
                alert("Ошибка! Комментарий не добавился!");
            }
        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("POST", "/CommentsServlet", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var user = GetAccountStorage();
    if(user){
        req.send("type=addcomment&item_id="+item_id+"&login="+user.login+
            "&message="+encodeURIComponent(formElements.message.value)+"&iconpath="+user.iconPath);
    }
}

function loadComments(item_id){
    var shopItemComments = document.querySelector("div#shop-item-comments");

    var req = newXMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var comments = JSON.parse(req.responseText);
            var shopItemComments = document.querySelector("div#shop-item-comments");

            for(var i = 0; i < comments.length; i++){
                var commentHtml = "<div class=\"shop-item-comment\"> <div class=\"shop-item-comment-account\"> " +
                                  "<div class=\"shop-item-comment-icon\"><img src=\"" + comments[i].iconPath + "\">" +
                                  "<div class=\"shop-item-comment-login\">" +
                                  "<a href=\"profile.html?login=" + comments[i].login + "\">" + comments[i].login +"</a></div>" +
                                  "</div></div>" +
                                  "<div class=\"shop-item-comment-text\">" + comments[i].message + "</div>" +
                                  "</div>";
                var comment = document.createElement('div');
                comment.innerHTML = commentHtml;
                shopItemComments.appendChild(comment);
            }

        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("GET", "/CommentsServlet?type=getcomments&item_id="+item_id, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
}