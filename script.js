'use strict';

/*
const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

 
 * Добавлены значения аргументов по умолчанию, сокращена запись - убран оператор return

const renderGoodsItem = ({title = 'Title placeholder', price = 0}) => `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;


 * Запятые появляются из-за того, что goodsList - это массив. При присвоении innerHTML
 * массив преобразуется в строку с сохранением разделитей - запятых.
 * Достаточно преобразовать его в строку методом join и запятые исчезнут

const renderGoodsList = (list) => {
//  let goodsList = list.map(item => renderGoodsItem(item.title, item.price)); // с запятыми
    let goodsList = list.map(item => renderGoodsItem(item)).join(''); // и без
    document.querySelector('.goods-list').innerHTML = goodsList;
}

renderGoodsList(goods);
*/

/*
 * Урок 2
 *
 * 1) Добавил деструктуризацию в constuctor в классе GoodsItem
 *
 * 2) Изменил метод fetchgoods в классе GoodsList так, чтобы он сразу создавал массив
 *    объектов GoodsItem. В результате упростился метод render в классе GoodsList
 */

class GoodsItem {
    constructor({title, price}) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        const list = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ];
        this.goods = list.map(item => {return new GoodsItem(item)});
    }
    render() {
        let listHtml = this.goods.map(item => item.render()).join('');
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
}

const list = new GoodsList();
list.fetchGoods();
list.render();

/*
 * Задания 1 и 2 - корзина и элемент корзиных
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
    incrementQuantity(good) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0) {
            this.items[itemIndex].quantity++;
        }
    }
    decrementQuantity(good) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0 && this.items[itemIndex].quantity > 1) {
            this.items[itemIndex].quantity--;
        }
    }
    setQuantity(good, quantity) {
        const itemIndex = this.findItem(good);
        if (itemIndex >= 0) {
            this.items[itemIndex].quantity = quantity;
        }
    }
    getGoodQuantity(good, quantity) {
        const itemIndex = this.findItem(good);
        return itemIndex >= 0 ? this.items[itemIndex].quantity : 0;
    }
    findItem({title}) {
        return this.items.findIndex(item => item.title === title);
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
}

class BasketItem {
    constructor({title, price}, quantity=1) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }
}

/*
 * Элементарное тестирование работы методов корзины
 */
console.log('Basket testing');
const testList = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];
const testGoods = testList.map(item => {return new GoodsItem(item)});
const testBasket = new Basket();

testBasket.addItem(testGoods[0]);
console.log(testBasket.getTotalQuantity()); // expected 1
console.log(testBasket.getTotalPrice()); // expected 150
testBasket.addItem(testGoods[1], 4);
console.log(testBasket.getTotalQuantity()); // expected 5
console.log(testBasket.getTotalPrice()); // expected 350
testBasket.incrementQuantity(testGoods[0]);
testBasket.addItem(testGoods[2]);
testBasket.decrementQuantity(testGoods[1]);
testBasket.decrementQuantity(testGoods[2]);
console.log(testBasket.getTotalQuantity()); // expected 6
console.log(testBasket.getTotalPrice()); // expected 800
console.log(testBasket.getGoodQuantity(testGoods[0])); // expected 2
console.log(testBasket.getGoodQuantity(testGoods[1])); // expected 3
console.log(testBasket.getGoodQuantity(testGoods[2])); // expected 1
console.log(testBasket.getGoodQuantity(testGoods[3])); // expected 0

/*
 * Задание 3 - гамбургеры
 */

class Burger {
    constructor(size, stuffing) {
        this.sizes = {
            small: {price: 50, cal: 20},
            big: {price: 100, cal: 40}
        }
        this.stuffings = {
            cheese: {price: 10, cal: 20},
            salad: {price: 20, cal: 5},
            potato: {price: 15, cal: 10}
        }
        this.toppings = {
            spice: {price: 15, cal: 0},
            mayonnaise: {price: 20, cal: 5}
        }
        this.size = size;
        this.stuffing = stuffing;
        this.topping = [];
    }
    addTopping(topping) {
        const index = this.checkTopping(topping);
        if (index < 0) {
            const newTopping = {name: topping}
            Object.assign(newTopping, this.toppings[topping], {quantity: 1});
            this.topping.push(newTopping);
        } else {
            this.topping[index].quantity++;
        }
    }
    removeTopping(topping) {
        const index = this.checkTopping(topping);
        if (index >=0) {
            if (this.topping[index].quantity > 1) {
                this.topping[index].quantity--;
            } else {
                this.topping.splice(index, 1);
            }
        } 
    }
    checkTopping(topping) {
        return this.topping.findIndex(item => item.name === topping);
    }
    getSize() {
        return this.size;
    }
    getStuffing() {
        return this.stuffing;
    }
    changeStuffing(stuffing) {
        this.stuffing = stuffing;
    }
    changeSize(size) {
        this.size = size;
    }
    summarize(previous, current) {
        return previous + current;
    }
    getPrice() {
        let price = this.sizes[this.size].price;
        price += this.stuffings[this.stuffing].price;
        price += this.topping.map(item => item.quantity * item.price).reduce(this.summarize, 0)
        return price;
    }
    getCalories() {
        let calories = this.sizes[this.size].cal;
        calories += this.stuffings[this.stuffing].cal;
        calories += this.topping.map(item => item.quantity * item.cal).reduce(this.summarize, 0)
        return calories;
    }
}

/*
 * Тестирование бургера
 */
console.log('Burger testing');

let testBurger = new Burger('big', 'cheese');
console.log(testBurger.getPrice()); // expected 110
console.log(testBurger.getCalories()); // expected 60
testBurger.changeSize('small');
testBurger.changeStuffing('potato');
testBurger.addTopping('spice');
testBurger.addTopping('spice');
console.log(testBurger.getPrice()); // expected 95
console.log(testBurger.getCalories()); // expected 30
console.log(testBurger.getStuffing()); // expected potato
console.log(testBurger.getSize()); // expected small
testBurger.addTopping('mayonnaise');
testBurger.removeTopping('spice');
console.log(testBurger.getPrice()); // expected 100
console.log(testBurger.getCalories()); // expected 35
testBurger.removeTopping('spice');
testBurger.removeTopping('spice');
testBurger.removeTopping('spice');
console.log(testBurger.getPrice()); // expected 85
console.log(testBurger.getCalories()); // expected 35
