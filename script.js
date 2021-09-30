'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

/*
 * Асинхронность через callbacks
 *
function makeGetRequest(url, callback) {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
 */

// Асинхронность через Promise (задание 1)

function makeGetRequest(url) {
    return new Promise((resolve) => {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr.responseText);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    });
}


class GoodsItem {
    constructor({id_product, product_name, price}) {
        this.id_product = id_product
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    // fetchGoods() возвращает Promise (задание 3)
    fetchGoods() {
        return makeGetRequest(`${API_URL}/catalogData.json`).then ((goods) => {
            this.goods = JSON.parse(goods).map(item => {return new GoodsItem(item)});
        });
    }
    render() {
        let listHtml = this.goods.map(item => item.render()).join('');
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
}

const list = new GoodsList();
// render() вызывается в обработчике Promise, который возвращает fetchGoods() (задание 3)
list.fetchGoods().then(()=> {list.render();});

/*
 * Задание 2 - корзина и элемент корзиных
 */

class Basket {
    constructor() {
        this.items = [];
    }
    addItem(good, quantity=1) {
        if (this.findItem(good) < 0) {
            const newItem = new BasketItem(good, quantity);
            this.items.push(newItem);
        }
    }
    removeItem(good) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0) {
            this.items.splice(itemIndex, 1);
        }
    }
    incrementQuantity(good, increment=1) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0) {
            this.items[itemIndex].quantity += increment;
        }
    }
    decrementQuantity(good, decrement=1) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0 && this.items[itemIndex].quantity > decrement) {
            this.items[itemIndex].quantity -= decrement;
        }
    }
    setQuantity(good, quantity) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0) {
            this.items[itemIndex].quantity = quantity;
        }
    }
    getItemQuantity(good) {
        const itemIndex = this.findItem(good);
        return itemIndex >= 0 ? this.items[itemIndex].quantity : 0;
    }
    findItem({product_name}) {
        return this.items.findIndex(item => item.product_name === product_name);
    }
    summarize(previous, current) {
        return previous + current;
    }
    getTotalPrice() {
        return this.items.map(item => item.quantity * item.price).reduce(this.summarize, 0);
    }
    getTotalQuantity() {
        return this.items.map(item => item.quantity).reduce(this.summarize, 0);
    }
    render() {
        let listHtml = this.items.map(item => item.render()).join('\n');
        let totalPrice = this.getTotalPrice();
        listHtml += `<h3>Общая стоимость товаров: ${totalPrice}</h3>`;
        document.querySelector('.basket-list').innerHTML = listHtml;
    }
}

class BasketItem {
    constructor({id_product, product_name, price}, quantity=1) {
        this.id_product = id_product;
        this.product_name = product_name;
        this.price = price;
        this.quantity = quantity;
    }
    render() {
        return `<div class="basket-item"><p>3${this.product_name}, Цена: ${this.price}, Количество: ${this.quantity}</p></div>`;
    }
}

/*
 * Элементарное тестирование работы методов корзины
 */
console.log('Basket testing');
let testGoods;
makeGetRequest(`${API_URL}/catalogData.json`)
    .then ((goods) => {
        testGoods = JSON.parse(goods).map(item => {return new GoodsItem(item)});
    }).then(() => {
        const testBasket = new Basket();
        testBasket.addItem(testGoods[0]);
        console.log(testBasket.getTotalQuantity()); // expected 1
        console.log(testBasket.getTotalPrice()); // expected 45600
        testBasket.addItem(testGoods[1], 4);
        console.log(testBasket.getTotalQuantity()); // expected 5
        console.log(testBasket.getTotalPrice()); // expected 49600
        testBasket.incrementQuantity(testGoods[0]);
        testBasket.decrementQuantity(testGoods[1]);
        console.log(testBasket.getTotalQuantity()); // expected 5 
        console.log(testBasket.getTotalPrice()); // expected 94200
        console.log(testBasket.getItemQuantity(testGoods[0])); // expected 2
        console.log(testBasket.getItemQuantity(testGoods[1])); // expected 3
        testBasket.removeItem(testGoods[0]);
        console.log(testBasket.getItemQuantity(testGoods[0])); // expected 0
        console.log(testBasket.getItemQuantity(testGoods[1])); // expected 3
        console.log(testBasket.getTotalPrice(testGoods[1])); // expected 3000
        testBasket.render();
    });
