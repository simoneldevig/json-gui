import { FakerList } from '@/types/faker';
import { generateFakerList } from '@/services/faker';

export default {
  setEndpoints (state: { endpoints: any }, response: { data: any }) {
    state.endpoints = response.data;
  },
  setModels (state: { models: any }, response: { data: any }) {
    state.models = response.data;
  },
  setSettings (state: { settings: any }, response: { data: any }) {
    state.settings = response.data;
  },
  setCurrentModel (state: { currentModel: any }, data: any) {
    state.currentModel = data;
  },
  setFakerList (state: { fakerList: FakerList}) {
    state.fakerList = generateFakerList();
  }
};
