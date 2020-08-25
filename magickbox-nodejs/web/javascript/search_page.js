//include base.js
//include shop_item.js

var items;
var id = 0;

document.addEventListener("DOMContentLoaded", function(event) {

    var value = getParameterByName("v");

    if(value){
        var req = newXMLHttpRequest();
        req.onreadystatechange = function () {

            if (req.readyState === 4 && req.status === 200) {
                var json = req.responseText;
                if(json === ""){ return; }
                items = JSON.parse(json);
                loadItemCount(8);
                addScrollEvent();
            }
            else { console.log("HTTP error: " + req.status); }

        };
        req.open("GET", "/item?type=itemsearch&v=" + value, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send();
    }


    var formElements = document.querySelector("form#search-page-form").elements;
    formElements.searchname.value = value;

});


function loadItemCount(count) {
    if(count === undefined) count = 1;
    for(var i = 0; i < count; i++){
        createItemHtml(items[id]);
        id++;
        if(id >= items.length) id = 0;
    }
}

function addScrollEvent(){
    window.onscroll = function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if(scrollTop + window.innerHeight > getDocumentHeight() - 100) {
            loadItemCount(4);
        }
    };
}

function submitSearch(searchForm){

    var formElements = searchForm.elements;

    var items_content = document.querySelector("div#items-content");
    while(items_content.firstChild){
        items_content.removeChild(items_content.firstChild);
    }

    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var json = req.responseText;
            if(json === ""){ return; }
            items = JSON.parse(json);
            loadItemCount(8);
            addScrollEvent();
        }
        else { console.log("HTTP error: " + req.status); }
    };

    req.open("GET", "/ItemsServlet?type=itemsearch&v=" + formElements.searchname.value + "&min=" + formElements.searchstartcost.value
        + "&max=" + formElements.searchendcost.value + "&c=" + formElements.selectcategory.value, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
}