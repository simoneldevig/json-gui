import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import 'es6-promise/auto';
import './plugins/element.js';
import './basscss.scss';
import store from './store/index.js';
import router from "./router";

// Import lodash
import cloneDeep from 'lodash.clonedeep';
import lodash from 'lodash';


const lodashBundle = {
  cloneDeep,
  lodash
};

Object.defineProperty(Vue.prototype, '$lodash', { value: lodashBundle });


Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
