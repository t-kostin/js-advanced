'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


/*
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
list.fetchGoods().then(()=> {list.render();});
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
        return `<div class="basket-item"><p>${this.product_name}, Цена: ${this.price}, Количество: ${this.quantity}</p></div>`;
    }
}

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        isVisibleBasket: false
    },
    methods: {
        makeGetRequest(url) {
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
        },
        searchHandler() {
            if (this.searchLine === '') {
                this.filteredGoods = this.goods;
            } else {
                const compareLine = this.searchLine.trim().toLowerCase();
                this.filteredGoods = this.goods.filter(item => {
                    return item.product_name.toLowerCase().includes(compareLine);
                });
                this.searchLine = '';
            }
        },
        basketHandler() {
            this.isVisibleBasket = !this.isVisibleBasket;
        }
    },
    mounted() {
        this.makeGetRequest(`${API_URL}/catalogData.json`).
            then((goods) => {
                this.goods = JSON.parse(goods);
                this.filteredGoods = this.goods;
            });
    }
});

