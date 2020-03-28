import axios from 'axios';
import router from '../router';
import { renameObjectKey, setObjectValue } from '@/utils';
import cloneDeep from 'lodash.clonedeep';

export default {
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

  async saveModel (context, props) {
    await axios({
      method: 'delete',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      url: 'http://localhost:8002/' + props.id
    }).then(function (response) {
      axios({
        method: 'post',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        url: 'http://localhost:8002/' + props.id,
        data: context.state.currentModel
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
