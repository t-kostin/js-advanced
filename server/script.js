'use strict';
import './goods-list.js';
import './goods-item.js';
import './basket.js';
import './basket-item.js';
import './error-component.js';
import './search-component.js';
import { makeGetRequest, makePutRequest } from './html-requests.js'

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
    basketHandler() {
      this.isVisibleBasket = !this.isVisibleBasket;
    },
    addToBasket(item) {
      makePostRequest('/addBasketItem', item).then( (response) => {
        if (response === 'error') {
          this.isBasketError = true;
        } else {
          this.basket = JSON.parse(response);
        }
      });
    },
    removeFromBasket(item) {
      makePostRequest('removeBasketItem', item).then( (response) => {
        if (response === 'error') {
          this.isBasketError = true;
        } else {
          this.basket = JSON.parse(response);
        }
      });
    }
  },
  mounted() {
    makeGetRequest('/catalog').
      then((goods) => {
        this.goods = JSON.parse(goods);
        this.filteredGoods = this.goods;
      }).
      catch(() => {
        this.isServerError = true;
      });
    makeGetRequest('/basket').
      then((basketItems) => {
        this.basket = JSON.parse(basketItems);
      }).
      catch(() => {
        this.isBasketError = true;
      });
  }
});

