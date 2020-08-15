import axios from 'axios';
import router from '../router';
import { renameObjectKey, setObjectValue, deleteObject } from '@/utils';
import { generateFakerValues } from '@/utils/faker';
import Vue from 'vue';
const serverPorts = require('../../portMapping');

export default {
  getModels (context) {
    axios.get('http://localhost:8002/db')
      .then(function (response) {
        context.commit('setModels', response);
      });
  },
  
  getEndpoints (context) {
    axios.get('http://localhost:8004/db')
      .then(function (response) {
        context.commit('setEndpoints', response);
      });
  },

  updateModelProperty (context, props) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    if (props.propertyName !== props.oldPropertyName) {
      clonedObject = renameObjectKey(clonedObject, props.oldPropertyName, props.propertyName);
    }
    clonedObject = setObjectValue(clonedObject, props.value);
    context.commit('setCurrentModel', clonedObject);
  },

  deleteModelProperty (context, props) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    clonedObject = deleteObject(clonedObject, props.obj);
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

  async saveData (context, props) {
    const port = serverPorts[props.type];

    await axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: `http://localhost:${port}/${props.id}`
    }).then(function () {
      axios({
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: `http://localhost:${port}/${props.id}`,
        data: context.state.currentModel
      }).then(function () {
        context.dispatch('getModels');
      });
    });
  },

  saveAndGenerate (context, props) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    clonedObject = generateFakerValues(clonedObject, clonedObject[0].timesToRepeat);

    axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:8000/' + props.id
    }).then(function () {
      axios({
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: 'http://localhost:8000/' + props.id,
        data: clonedObject
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
