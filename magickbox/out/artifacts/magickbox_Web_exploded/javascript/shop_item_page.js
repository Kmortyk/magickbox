//include base.js
//include comments.js

var item_id;


document.addEventListener("DOMContentLoaded", function(event) {

    item_id = getParameterByName("id");

    loadItemPage(item_id);
    loadComments(item_id);
    document.querySelector("form#comment-form").onsubmit = function () { addComment(this, item_id); return false; }

});


function loadItemPage(item_id){

    var req = newXMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {

            var itemJson = req.responseText;
            var item_attr = JSON.parse(itemJson);

            document.querySelector("div#shop-item-description-name").innerHTML = item_attr.name;
            document.querySelector("div#shop-item-description-text").innerHTML = item_attr.description;
            document.querySelector("div#shop-item-description-price").innerHTML = '$' + item_attr.price;
            document.querySelector("div#shop-item-images").innerHTML = "<img src=\"" + item_attr.imagePath + "\">";
        }
        else { console.log("HTTP error: " + req.status); }
    };
    req.open("GET", "/ItemsServlet?type=itempage&id="+item_id, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
}