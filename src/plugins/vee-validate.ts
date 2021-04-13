import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, alpha } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Please enter a value that only alphabetic characters'
});

extend('alpha', {
  ...alpha,
  message: 'Please enter a value that only alphabetic characters'
});

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
