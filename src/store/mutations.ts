export default {
  setEndpoints (state: { endpoints: any }, response: { data: any }) {
    state.endpoints = response.data;
  },
  setModels (state: { models: any }, response: { data: any }) {
    state.models = response.data;
  },
  setCurrentModel (state: { currentModel: any }, data: any) {
    state.currentModel = data;
  }
};
