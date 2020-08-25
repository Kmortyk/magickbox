function SetAccountStorage(id, login, iconPath){
    const user = { id: id, login: login, iconPath: iconPath };
    localStorage.setItem('user', JSON.stringify(user));
}

function GetAccountStorage(){ return JSON.parse(localStorage.getItem('user')); }

function DeleteAccountStorage(item){ localStorage.removeItem(item); }

function SetBasketItemsStorage(items, totalPrice){
    localStorage.setItem('basket_items', JSON.stringify(items));
    localStorage.setItem('basket_price', JSON.stringify(totalPrice));
}

function GetBasketItemsStorage() {
    return {
        basketItems: JSON.parse(localStorage.getItem("basket_items")),
        basketPrice: JSON.parse(localStorage.getItem("basket_price"))
    }
}