import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0,
  db: {}
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setDb (state, response) {
    state.db = response.data;
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  setDb (context) {
    axios.get('http://localhost:3000/api/db')
      .then(function (response) {
        context.commit('setDb', response);
      });
  },
  updateEntry (context, props) {
    axios({
      method: 'patch',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:3000/api/' + props.url,
      data: props.payload
    }).then(function (response) {
      console.log(response);
    });
  },
};

// getters are functions
const getters = {
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});