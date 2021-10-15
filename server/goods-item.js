'use strict';
Vue.component('goods-item', {
  props: ['good', 'add-to-basket'],
  template: `
        <div class="goods-item">
          <div class="goods-description">
            <h3>{{ good.product_name }}</h3>
            <p>Цена: {{ good.price }}&nbsp;₽</p>
          </div>
          <button class="add-button" @click.preventDefault="addToBasket(good)">Добавить</button>
        </div>`
});

