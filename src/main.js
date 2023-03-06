import Vue from 'vue'

import App from './App.vue'
import router from './router'
import filters from "./filters";

import './assets/main.css'

Vue.mixin({
  filters: filters
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
