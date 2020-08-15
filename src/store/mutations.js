export default {
  setEndpoints (state, response) {
    state.endpoints = response.data;
  },
  setModels (state, response) {
    state.models = response.data;
  },
  setCurrentModel (state, data) {
    console.log(data);
    state.currentModel = data;
  }
};
