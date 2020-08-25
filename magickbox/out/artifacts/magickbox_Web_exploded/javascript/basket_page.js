//include base.js
//include local_storage.js

var basket_items_array = [];
var basket_items_price = 0;

document.addEventListener("DOMContentLoaded", function(event) {

    var storage = GetBasketItemsStorage();
    basket_items_array = storage.basketItems;
    basket_items_price = storage.basketPrice;
    var basket_items = document.querySelector("div#basket-items");
    document.querySelector("div#basket-total-price").innerHTML = "Total: " + "<br /> $" + basket_items_price;

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
            document.querySelector("div#basket-total-price").innerHTML = "Total: " + "<br /> $" + basket_items_price;
        };

        basket_items.appendChild(basketItem);
    }

});