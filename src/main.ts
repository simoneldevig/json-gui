import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/plugins/maz-ui.ts';
import '@/plugins/element.ts';
import '@/plugins/event-bus.ts';
import './basscss.scss';
import './assets/main.scss';

// Import lodash
import cloneDeep from 'lodash.clonedeep';
import lodash from 'lodash';

const lodashBundle = {
  cloneDeep,
  lodash
};

Object.defineProperty(Vue.prototype, '$lodash', { value: lodashBundle });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
