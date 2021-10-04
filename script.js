'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

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

/*
 * Урок 4 - задания 1 и 2. Замена прямой речи в однинарных кавычках. Апострофы в
 * конструкциях "isn't", "I've" и т.д. не трогаем.
 */

makeGetRequest('http://151.248.113.248:8000/lesson-4-text.txt').
    then((testText) => {
        console.log(`Original text:\n${testText}`);
        let searchPattern = /(')((I'|[A-Z])([^']+|[Ia-z]'[a-z])+[\.,\?\!])(')/g;
        let newText = testText.replace(searchPattern, '"$2"');
        console.log(`\n\nChanged text:\n${newText}`);
    });

/*
 * Урок 4 - задание 3. Форма обратной связи.
 * По заданию домен почты всегда равен mail.ru. Для более сложного варианта проверки почты со
 * всех доменов первого уровня регулярное выражение будет выглядеть так:
 * /^[a-z]+(\.|-)?[a-z]+@([a-z0-9]+-?)*[a-z0-9]\.[a-z]{2,}$/i
 */

const myForm = document.getElementById('my-form');
myForm.addEventListener('submit', validateForm);

function validateForm(event) {
    event.preventDefault();

    const formPatterns = [
        { field: 'name', regex: /^[a-z]{2,}$/i },
        { field: 'email', regex: /^[a-z]+(\.|-)?[a-z]+@mail\.ru/i },
        { field: 'phone', regex: /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/ }
    ];

    const isFormValid = formPatterns.
        map(validateField).
        reduce((previous, current) => previous && current);

    let message = document.getElementById('err-message');
    if (isFormValid) {
        message.classList.add('hidden');
        // Send validated form
    } else {
        message.classList.remove('hidden');
        // Form doesn't validated
    }
}

function validateField({field, regex}) {
    const isFieldValid = regex.test(myForm[field].value.trim());
    if (isFieldValid) {
        myForm[field].classList.remove('error-mark');
    } else {
        myForm[field].classList.add('error-mark');
    }
    return isFieldValid;
}
