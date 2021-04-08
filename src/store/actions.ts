import axios from 'axios';
import router from '../router';
import {
  renameObjectKey,
  setObjectValue,
  deleteObject,
  generateGuid
} from '@/utils';
import {
  generateFakerValues
} from '@/services/faker';
import Vue from 'vue';
import { BaseDTO } from '@/types/index';

export default {
  getModels (context: any) {
    axios.get('http://localhost:5001/json-gui/models')
      .then(function (response) {
        context.commit('setModels', response);
      });
  },

  getEndpoints (context: any) {
    axios.get('http://localhost:5001/json-gui/endpoints')
      .then(function (response) {
        context.commit('setEndpoints', response);
      });
  },

  getSettings (context: any) {
    axios.get('http://localhost:5001/json-gui/settings')
      .then(function (response) {
        context.commit('setSettings', response);
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
    console.log(clonedObject);
    context.commit('setCurrentModel', clonedObject);
  },

  createNewItem (context: any, props: any) {
    const newItem = new BaseDTO({
      type: props.type,
      id: generateGuid(),
      timesToRepeat: props.type === 'endpoint' ? 1 : undefined
    });
    axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      data: newItem,
      url: `http://localhost:5001/json-gui/${props.type}s/${props.name}`
    }).then(function () {
      if (props.type === 'endpoint') {
        context.dispatch('getEndpoints').then(function () {
          router.push({
            path: props.name
          });
        });
      } else if (props.type === 'model') {
        context.dispatch('getModels').then(function () {
          router.push({
            path: props.name
          });
        });
      }
    });
  },

  async saveData (context: any, props: any) {
    await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5001/json-gui/${props.type}/${props.id}`,
      data: context.state.currentModel
    }).then(function () {
      if (props.type === 'endpoints') {
        context.dispatch('getEndpoints');
      } else if (props.type === 'models') {
        context.dispatch('getModels');
      }
    });
  },

  async saveAndGenerate (context: any, props: any) {
    let clonedObject = Vue.prototype.$lodash.cloneDeep(context.state.currentModel);
    clonedObject = await generateFakerValues(clonedObject, clonedObject.timesToRepeat);
    axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5001/json-gui/${props.type}/${props.id}`,
      data: clonedObject
    });
  },

  async saveSettings (context: any, props: any) {
    await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: 'http://localhost:5001/json-gui/settings',
      data: props
    }).then(function () {
      context.dispatch('getSettings');
    });
  },

  async deleteEntry (context: any, props: any) {
    await axios({
      method: 'delete',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5001/json-gui/${props.type}/${props.name}`
    }).then(function () {
      if (props.type === 'endpoints') {
        context.dispatch('getEndpoints');
      } else if (props.type === 'models') {
        context.dispatch('getModels');
      }
    });
  },

  async editEntry (context: any, props: any) {
    await axios({
      method: 'put',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      url: `http://localhost:5001/json-gui/${props.type}/${props.name}`,
      data: props
    }).then(function () {
      if (props.type === 'endpoints') {
        context.dispatch('getEndpoints');
      } else if (props.type === 'models') {
        context.dispatch('getModels');
      }
    });
  }
};
