'use strict';

Vue.component('goods-list', {
  props: ['goods', 'add-to-basket'],
  template: `
        <div class="goods-list">
            <goods-item v-for="good in goods" :good="good" :add-to-basket="addToBasket" :key="good.product_name"></goods-item>
        </div>`
});

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
      return this.basket.map(item => item.price * item.quantity).reduce((prev, curr) => prev + curr);
    }
  }
});

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
            <button class="search-button" type="button" @click.preventDefault="searchHandler">Поиск</button>
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
    basket: [],
    isVisibleBasket: false,
    isServerError: false,
    isBasketError: false
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
    makePostRequest(url, data) {
      return new Promise((resolve) => {
        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
        } else {
          xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            resolve(xhr.responseText);
          }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      });
    },
    basketHandler() {
      this.isVisibleBasket = !this.isVisibleBasket;
    },
    addToBasket(item) {
      this.makePostRequest('/addBasketItem', item).then( (response) => {
        if (response === 'error') {
          this.isBasketError = true;
        } else {
          this.basket = JSON.parse(response);
        }
      });
    },
    removeFromBasket(item) {
      this.makePostRequest('removeBasketItem', item).then( (response) => {
        if (response === 'error') {
          this.isBasketError = true;
        } else {
          this.basket = JSON.parse(response);
        }
      });
    }
  },
  mounted() {
    this.makeGetRequest('/catalog').
      then((goods) => {
        this.goods = JSON.parse(goods);
        this.filteredGoods = this.goods;
      }).
      catch(() => {
        this.isServerError = true;
      });
    this.makeGetRequest('/basket').
      then((basketItems) => {
        this.basket = JSON.parse(basketItems);
      }).
      catch(() => {
        this.isBasketError = true;
      });
  }
});

