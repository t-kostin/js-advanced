'use strict';
Vue.component('error-component', {
  props: ['is_error'],
  template: `
        <h3 v-if="is_error">
            Server error
        </h3>`
});

