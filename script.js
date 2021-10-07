'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

/*
 *
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
 *
 */

Vue.component('goods-list', {
    props: ['goods'],
    template: `
        <div class="goods-list">
            <goods-item v-for="good in goods" :good="good" :key="good.product_name"></goods-item>
        </div>`
});

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <div class="goods-item">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
        </div>`
});

Vue.component('basket', {
    props: ['basket'], 
    template: `
        <div class="basket">
            <div class="container-basket">
                <div class="item-name first-row">Goods name</div>
                <div class="item-price first-row">Price</div>
                <div class="item-quantity first-row">Quantity</div>
                <div class="item-total first-row">{{ basket[0].product_name }}</div>
            </div>
            <basket-item v-for="item in basket" :item="item" :key="item.product_name"></basket-item>
            <div class="container-basket">
                <div class="basket-total">SUBTOTAL</div>
                <div class="basket-total">{{ this.basketTotal() }}&nbsp;₽</div>
            </div>
        </div>`,
    methods: {
        basketTotal() {
            return this.basket.map(item => item.price * item.quantity).reduce((prev, curr) => prev + curr);
        }
    }
});

Vue.component('basket-item', {
    props: ['item'],
    template: `
    <div class="container-basket">
        <div class="item-name">{{ item.product_name }}</div>
        <div class="item-price">{{ item.price }}&nbsp;₽</div>
        <div class="item-quantity">{{ item.quantity }}</div>
        <div class="item-total">{{ item.price * item.quantity }}&nbsp₽</div>
    </div>`
});
 
Vue.component('error-component', {
    props: ['is_error'],
    template: `
        <h3 v-if="is_error">
            Server error
        </h3>`
});

Vue.component('goods-search', {
    props: ['goodsprop'],
    data: function () {
        return { searchLine: '' }
    },
    template:`
        <div>
            <input type="text" class="goods-search" v-model="searchLine">
            <button class="cart-button" type="button" @click="searchHandler">Поиск</button>
        </div>`,
    methods: {
        searchHandler() {
            if (this.searchLine === '') {
                this.$parent.filteredGoods = this.$parent.goods;
            } else {
                const compareLine = this.searchLine.trim().toLowerCase();
                this.$parent.filteredGoods = this.$parent.goods.filter(item => {
                    return item.product_name.toLowerCase().includes(compareLine);
                });
                this.searchLine = '';
            }
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        basket: [
            {
                product_name: 'Мышка',
                price: 1000,
                quantity: 3
            },
            {
                product_name: 'Ноутбук',
                price: 45600,
                quantity: 2
            }
        ],
        isVisibleBasket: false,
        isServerError: false
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
        basketHandler() {
            this.isVisibleBasket = !this.isVisibleBasket;
        }
    },
    mounted() {
        this.makeGetRequest(`${API_URL}/catalogData.json`).
            then((goods) => {
                this.goods = JSON.parse(goods);
                this.filteredGoods = this.goods;
            }).
            catch(() => {
                this.isServerError = true;
            });
    }
});

