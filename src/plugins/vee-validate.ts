import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, alpha } from 'vee-validate/dist/rules';
import store from '../store';
const state = store.state;

extend('required', {
  ...required,
  message: 'Please enter a value that only alphabetic characters'
});

extend('alpha', {
  ...alpha,
  message: 'Please enter a value that only alphabetic characters'
});

extend('endpoint', value => {
  if (Object.keys(state.endpoints).includes(value)) {
    return `A endpoint with the name ${value} already exist`;
  }

  return true;
});

extend('model', value => {
  if (Object.keys(state.models).includes(value)) {
    return `A model with the name ${value} already exist`;
  }

  return true;
});

extend('property', (value, siblings) => {
  if (siblings.includes(value)) {
    return `A property with the name ${value} already exist`;
  }

  return true;
});

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
