import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';
import { renameObjectKey, setObjectValue } from '@/utils';
import cloneDeep from 'lodash.clonedeep';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0,
  models: {},
  cleanModels: {},
  currentModel: {}
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
  },
  setCurrentModel (state, data) {
    state.currentModel = data;
  },
  updateProperty (state, data) {
    let clonedObject = cloneDeep(state.currentModel);
    if (data.propertyName !== data.oldPropertyName) {
      clonedObject = renameObjectKey(clonedObject, data.oldPropertyName, data.propertyName);
    }
    console.log('da');
    console.log(setObjectValue(clonedObject, data.value));
    // setCurrentModel(setObjectValue(clonedObject, data.value));
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  getModels (context) {
    axios.get('http://localhost:8002/db')
      .then(function (response) {
        context.commit('setModels', response);
      });
  },
  updateModelProperty (context, props) {
    let clonedObject = cloneDeep(state.currentModel);
    if (props.propertyName !== props.oldPropertyName) {
      clonedObject = renameObjectKey(clonedObject, props.oldPropertyName, props.propertyName);
    }
    clonedObject = setObjectValue(clonedObject, props.value);
    context.commit('setCurrentModel', clonedObject);
  },
  createNewRoute (context, props) {
    axios({
      method: 'post',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:8002/' + props
    }).then(function (response) {
      context.dispatch('getModels').then(function () {
        router.push({ path: props });
      });
    });
  },

  saveModel (context, props) {
    axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:8002/' + props.id
    }).then(function (response) {
      axios({
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: 'http://localhost:8001/' + props.id,
        data: props.content
      });
    });
  },

  saveAndGenerate (context, props) {
    axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:8000/' + props.id
    }).then(function (response) {
      axios({
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: 'http://localhost:8000/' + props.id,
        data: props.content
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
  }
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
