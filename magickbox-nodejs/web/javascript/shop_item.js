//include base.js

var clicked_item;
var basket_icon, basket_icon_bounds;
var is_drag = false, is_href = false, clickedX = 0, clickedY = 0, deltaX = 0, deltaY = 0;
var max_zindex = findHighestZIndex('div') + 1;
var basket_items_array = [];
var basket_items_price = 0;
var basket_icon_block;
var basket_items;

document.addEventListener("DOMContentLoaded", function(event) {

    basket_icon = document.querySelector("div#basket-icon");
    basket_icon_bounds = basket_icon.getBoundingClientRect();
    basket_icon_block = basket_icon.querySelector("div#basket-icon-block");
    basket_items = basket_icon_block.querySelector("div#basket-items");

    document.onmousedown = function (event) {
        var target = event.target || event.srcElement;
        if(!target) return;
        var item = findParent(target, "item-block");

        if(item){
            clicked_item = item;
            clickedX = event.pageX;
            clickedY = event.pageY;
            item.style.opacity = 0.9;
            if(target.className === "item-href") is_href = true;
        }
    };

    document.onmousemove = function (event) {
        if(clicked_item){
            if(!is_drag){
                clicked_item.style.opacity = 1;
                var bounds = clicked_item.getBoundingClientRect();
                clicked_item = clicked_item.cloneNode(true);
                clicked_item.style.opacity = 0.8;

                var pageOffset = getPageOffsets();

                deltaX = clickedX - bounds.left - pageOffset.left;
                deltaY = clickedY - bounds.top - pageOffset.top;

                clicked_item.style.position = 'absolute';
                clicked_item.style.zIndex = max_zindex;
                document.body.appendChild(clicked_item);
                is_drag = true;
            }

            clicked_item.style.left = event.pageX - deltaX + 'px';
            clicked_item.style.top = event.pageY - deltaY + 'px';
        }
    };

    document.onmouseup = function (event) {
        if(clicked_item){
            if(is_drag){
                if(contains(clicked_item.getBoundingClientRect(), basket_icon_bounds)) {
                    basket_icon.style.opacity = 0.8;
                    setTimeout(function () {
                        basket_icon.style.opacity = 1;
                    }, 300);

                    var itemPrice_str = clicked_item.querySelector("div.item-price").innerHTML;
                    var itemPrice = parseInt(itemPrice_str.substr(1));

                    var basket_item = { id: clicked_item.getAttribute("item_id"),
                                        itemName: clicked_item.querySelector("div.item-name").innerHTML,
                                        itemImagePath: clicked_item.querySelector("div.item-img>img").src,
                                        itemPrice: itemPrice };
                    basket_items_array.push(basket_item);
                    basket_items_price += itemPrice;
                    SetBasketItemsStorage(basket_items_array, basket_items_price);
                    updateIcon();
                    reloadBasketBlock();
                }
                document.body.removeChild(clicked_item);
                is_drag = false;
                clicked_item = null;
                return false;
            }else{
                if(is_href){
                    window.open("shop_item.html?id="+clicked_item.getAttribute('item_id'));
                    clicked_item = null;
                    is_href = false;
                    return false;
                }
            }
            clicked_item.style.opacity = 1;
            clicked_item = null;
        }
    };

    basket_icon.querySelector("img#basket-icon-image").onmousedown = function () {

        if (basket_icon_block.style.display === "none" || basket_icon_block.style.display === "") {
            reloadBasketBlock();
            basket_icon_block.style.display = "block";
        } else {
            basket_icon_block.style.display = "none";
        }
    };

    var storage = GetBasketItemsStorage();
    basket_items_array = storage.basketItems;
    basket_items_price = storage.basketPrice;
    if(!basket_items_array) { basket_items_array = []; basket_items_price = 0; }
    updateIcon();
});

function createItemHtml(item_attr){
    var itemHtml = "<div class=\"item-img\"><img src=\"" + item_attr.imagePath + "\" ondragstart=\"return false;\">" +
        "</div> <div class=\"item-name\">" + item_attr.name + "</div>" +
        "</div><div class=\"item-text\">" +
        item_attr.description +
        "</div>" +
        "<div class=\"item-href\">Открыть -></div>" +
        "<div class=\"item-price\">" + '$' + item_attr.price + "</div>";

    var item = document.createElement('div');
    item.innerHTML = itemHtml;
    item.className = "item-block";
    item.setAttribute('item_id', item_attr.id);
    document.querySelector("div#items-content").appendChild(item);
}

function updateIcon(){
    document.querySelector("div#basket-items-count").innerHTML = basket_items_array.length;
    document.querySelector("div#basket-total-price").innerHTML = "Total: $" + basket_items_price;
}

function reloadBasketBlock(){
    //очистка от детей
    while(basket_items.firstChild){
        basket_items.removeChild(basket_items.firstChild);
    }

    for(var i = 0; i < basket_items_array.length; i++){
        var basketItemHtml = "<div class=\"basket-item-image\"><img src=\"" +
            basket_items_array[i].itemImagePath + "\"></div>" +
            "<div class=\"basket-item-description\">" +
            "<div class=\"basket-item-name\">" + basket_items_array[i].itemName + "</div>" +
            "<div class=\"basket-item-price\">" + '$' + basket_items_array[i].itemPrice + "</div>" +
            "</div>" +
            "<img class=\"basket-remove-button\" src=\"img/remove_item.png\">";
        var basketItem = document.createElement('div');
        basketItem.className = "basket-item";
        basketItem.innerHTML = basketItemHtml;
        basketItem.setAttribute('item_id', basket_items_array[i].id);

        basketItem.querySelector("img.basket-remove-button").onclick = function () {
            var currentItem = this.parentNode;
            var basket_item_array = basket_items_array.find(function (element, index, array) {
                return element.id === currentItem.getAttribute('item_id');
            });
            basket_items_price -= basket_item_array.itemPrice;
            var index = basket_items_array.indexOf(basket_item_array);
            basket_items.removeChild(currentItem);
            if (index > -1) {
                basket_items_array.splice(index, 1);
            }
            SetBasketItemsStorage(basket_items_array, basket_items_price);
            updateIcon();
        };

        basket_items.appendChild(basketItem);
    }
}