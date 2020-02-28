import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0,
  models: {}
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setModels (state, response) {
    state.models = response.data;
  },
  setData (state, response) {
    state.models = response.data;
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  getModels (context) {
    axios.get('http://localhost:3000/db')
      .then(function (response) {
        context.commit('setModels', response);
      });
  },
  
  createNewRoute (context, props) {
    console.log(props)
    axios({
      method: 'post',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:3000/' + props
    }).then(function (response) {
      context.dispatch('getModels').then(function () {
        router.push({ path: props })
      });
    });
  },

  updateEntry (context, props) {
    axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:3000/' + props.url
    }).then(function (response) {
      axios({
        method: 'push',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: 'http://localhost:3000/api/' + props.url,
        data: props.payload
      }).then(function (response) {
        console.log(response);
      });
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