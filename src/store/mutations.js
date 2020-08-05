export default {
  setData (state, response) {
    state.data = response.data;
  },
  setModels (state, response) {
    state.models = response.data;
  },
  setCurrentModel (state, data) {
    console.log(data);
    state.currentModel = data;
  }
};
