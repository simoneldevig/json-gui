import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import db from './assets/db.json';

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0,
  db: {}
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setDb (state) {
    console.log(db);
    state.db = db;
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  setDb (context) {
    context.commit('setDb');
  }
}

// getters are functions
const getters = {
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})