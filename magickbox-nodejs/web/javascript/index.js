//include base.js
//include shop_item.js

var id = 0;
var i = 0;

document.addEventListener("DOMContentLoaded", function(event) {

    // var move_direction = 150;
    // $("div#hide-button").click(function(){
    //     $("div#left-sidebar").animate({ right: move_direction+'px' });
    //     $("div#hide-button").animate({ 	left:  move_direction+'px' });
    //     move_direction *= -1;
    // });
    var category = getParameterByName("category");

    window.onscroll = function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if(scrollTop + window.innerHeight > getDocumentHeight() - 100) {
            loadItemCount(4, category);
        }
    };
    loadItemCount(8, category);

    //кнопки категорий
    var categoryButtons = document.querySelectorAll("div.left-sidebar-button");
    for(i = 0; i < categoryButtons.length; i++){
        addEventToCategoryButton(categoryButtons[i]);
    }

    document.querySelector("div#reset-category-button").onclick = function () {
        var url = window.location.href;
        var parameterStartIndex = url.indexOf('?');
        if(parameterStartIndex > -1){
            url = url.substr(0, parameterStartIndex);
            window.location.href = url;
        }
    };

    document.querySelector("div#hide-button").onclick = function () {
        var sidebar = document.querySelector("div#left-sidebar");
        var time = 0;

        var timer = setInterval(function () {
            time -= 3;
            sidebar.style.left = time + 'px';
            if(time < -150){
                document.querySelector("div#show-button").style.display = "block";
                clearInterval(timer);
            }
        }, 1);
    };

    var showButton = document.querySelector("div#show-button");
    showButton.style.display = "none";
    showButton.onclick = function () {
        var sidebar = document.querySelector("div#left-sidebar");
        var time = -150;

        showButton.style.display = "none";
        var timer = setInterval(function () {
            time += 3;
            sidebar.style.left = time + 'px';
            if(time >= 0){
                clearInterval(timer);
            }
        }, 1);
    };

    var searchForm = document.querySelector("form#search-form");
    searchForm.onsubmit = function () {
        window.location.href = "http://" + window.location.host + "/search.html?v=" + searchForm.elements.searchitem.value;
        return false;
    }
    
});

function loadItemCount(count, category) {
	if(count === undefined) count = 1;
	for(var i = 0; i < count; i++){
        if(!category)loadItem();
        else loadItemCategory(category);
	}
}

function loadItem(){
    var req = newXMLHttpRequest();
    req.onreadystatechange = function () {

        if (req.readyState === 4 && req.status === 200) {
            var itemJson = req.responseText;
            if(itemJson === ""){ id = 0; return; }
            var item_attr = JSON.parse(itemJson);
            createItemHtml(item_attr); }
        else { console.log("HTTP error: " + req.status); }

    };
    req.open("GET", "/item?type=item&id=" + id, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
    id++;
}

function loadItemCategory(category) {
    var req = newXMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var itemJson = req.responseText;
            if(itemJson === ""){ id = 0; return; }
            var item_attr = JSON.parse(itemJson);
            if(item_attr.correctCategory) createItemHtml(item_attr);
            else loadItemCategory(category);
        }
        else { console.log("HTTP error: " + req.status); }
    };

    req.open("GET", "/item?type=itemcategory&id=" + id+"&category=" + category, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
    id++;
}

function addEventToCategoryButton(categoryButton){
   categoryButton.onclick = function () {
       var url = window.location.href;
       var parameterStartIndex = url.indexOf('?');
       if(parameterStartIndex > -1){ url = url.substr(0, parameterStartIndex); }
       url += "?category="+categoryButton.innerHTML.toLowerCase();
       window.location.href = url;
   }
}