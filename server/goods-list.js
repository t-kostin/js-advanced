'use strict'
Vue.component('goods-list', {
  props: ['goods', 'add-to-basket'],
  template: `
        <div class="goods-list">
            <goods-item v-for="good in goods" :good="good" :add-to-basket="addToBasket" :key="good.product_name"></goods-item>
        </div>`
});
