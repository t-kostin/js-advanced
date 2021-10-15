'use strict';
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

