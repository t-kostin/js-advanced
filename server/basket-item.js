'use strict';
Vue.component('basket-item', {
  props: ['item', 'remove-from-basket'],
  template: `
    <div class="container-basket">
        <div class="item-name">{{ item.product_name }}</div>
        <div class="item-price">{{ item.price }}&nbsp;₽</div>
        <div class="item-quantity">{{ item.quantity }}</div>
        <div class="item-total">{{ item.price * item.quantity }}&nbsp₽</div>
        <button type="button" class="remove-button" @click.preventDefault="removeFromBasket(item)">Удалить</button>
    </div>`
});

