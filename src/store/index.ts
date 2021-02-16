import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { generateFakerList } from '@/services/faker';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    endpoints: {},
    cleanModels: {},
    currentModel: {},
    models: {},
    settings: {},
    fakerList: []
  },

  getters,
  actions,
  mutations
});
