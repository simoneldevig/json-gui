export default {
  setModels (state, response) {
    state.models = response.data;
  },
  setData (state, response) {
    state.models = response.data;
  },
  setCurrentModel (state, data) {
    state.currentModel = data;
  }
};
