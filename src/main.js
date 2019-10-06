import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import './plugins/element.js'
import './basscss.scss'
import store from './store'
import router from "./router"

Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
