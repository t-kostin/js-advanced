'use strict';

const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

/* 
 * Добавлены значения аргументов по умолчанию, сокращена запись - убран оператор return
 */
const renderGoodsItem = (title = 'Title placeholder', price = 0) => `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;

/*
 * Запятые появляются из-за того, что goodsList - это массив. При присвоении innerHTML
 * массив преобразуется в строку с сохранением разделитей - запятых.
 * Достаточно преобразовать его в строку методом join и запятые исчезнут
 */
const renderGoodsList = (list) => {
//  let goodsList = list.map(item => renderGoodsItem(item.title, item.price)); // с запятыми
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price)).join(''); // и без
    document.querySelector('.goods-list').innerHTML = goodsList;
}

renderGoodsList(goods);
