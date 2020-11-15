import axios from 'axios';
import router from '../router';
import {
  renameObjectKey,
  setObjectValue,
  deleteObject
} from '@/utils';
import {
  generateFakerValues
} from '@/services/faker';
import Vue from 'vue';

export default {
  getModels (context: any) {
    axios.get('http://localhost:5000/api/models')
      .then(function (response) {
        context.commit('setModels', response);
      });
  },

  getEndpoints (context: any) {
    axios.get('http://localhost:5000/api/endpoints')
      .then(function (response) {
        context.commit('setEndpoints', response);
      });
  },

  updateModelProperty (context: any, props: any) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    if (props.propertyName !== props.oldPropertyName) {
      clonedObject.value = renameObjectKey(clonedObject.value, props.oldPropertyName, props.propertyName);
    }
    clonedObject = setObjectValue(clonedObject, props.value);
    context.commit('setCurrentModel', clonedObject);
  },

  setModel (context: any, props: any) {
    context.commit('setCurrentModel', props);
  },

  deleteModelProperty (context: any, props: any) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    clonedObject = deleteObject(clonedObject, props.id);
    context.commit('setCurrentModel', clonedObject);
  },

  createNewRoute (context: any, props: any) {
    axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: 'http://localhost:http://localhost:5000/api/' + props
    }).then(function () {
      context.dispatch('getModels').then(function () {
        router.push({
          path: props
        });
      });
    });
  },

  async saveData (context: any, props: any) {
    console.log(props);
    await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5000/api/${props.type}/${props.id}`,
      data: context.state.currentModel
    }).then(function () {
      if (props.type === 'endpoints') {
        context.dispatch('getEndpoints');
      } else if (props.type === 'models') {
        context.dispatch('getModels');
      }
    });
  },

  saveAndGenerate (context: any, props: any) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    clonedObject = generateFakerValues(clonedObject, clonedObject.timesToRepeat);
    console.log(clonedObject);
    axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5000/api/${props.type}/${props.id}`,
      data: clonedObject
    });
  }

  // updateEntry (context: any, props: any) {
  //   axios({
  //     method: 'delete',
  //     headers: {
  //       'content-type': 'application/json; charset=utf-8'
  //     },
  //     url: 'http://localhost:3000/' + props.url
  //   }).then(function () {
  //     (axios as any)({ method: 'push', headers: { 'content-type': 'application/json; charset=utf-8' }, url: 'http://localhost:3000/api/' + props.url, data: props.payload }).then(function (response: any) {
  //       console.log(response);
  //     });
  //   });
  // }
};
