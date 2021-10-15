'use strict';
Vue.component('basket', {
  props: ['basket', 'remove-from-basket'], 
  template: `
        <div class="basket">
            <div class="container-basket">
                <div class="item-name first-row">Goods name</div>
                <div class="item-price first-row">Price</div>
                <div class="item-quantity first-row">Quantity</div>
                <div class="item-total first-row">{{ basket[0].product_name }}</div>
                <div class="item-empty-zone"></div>
            </div>
            <basket-item v-for="item in basket" :item="item" :key="item.product_name" :remove-from-basket="removeFromBasket"></basket-item>
            <div class="container-basket">
                <div class="basket-total">SUBTOTAL</div>
                <div class="basket-total">{{ basketTotal }}&nbsp;₽</div>
                <div class="item-empty-zone"></div>
            </div>
        </div>`,
  computed: {
    basketTotal() {
      return this.basket.map(item => item.price * item.quantity).
        reduce((prev, curr) => prev + curr);
    }
  }
});

