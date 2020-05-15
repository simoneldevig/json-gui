import Vue from 'vue';
const faker = require('faker');

const generateFakerValues = (obj, timesToRepeat) => {
  for (let i = 0; i < timesToRepeat; i++) {
    for (const key in obj[0].value) {
      if (Array.isArray(obj[0].value[key]) && obj[0].value[key].length < obj[0].value[key][0].timesToRepeat) {
        generateFakerValues(obj[0].value[key], obj[0].value[key][0].timesToRepeat);
      }
    }
    let clonedObject = Vue.prototype.$lodash.cloneDeep(obj[0].value);
    const mutatedObj = setFakerValues(clonedObject);
    obj.push(mutatedObj);

    // Remove the original model object
    if (obj.length === timesToRepeat + 1) {
      obj.shift();
    }
  }
  return obj;
};

const setFakerValues = (obj) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      // if (typeof (obj[key]) !== 'object') {
      //   delete obj[key];
      // } 
      // else
      if (typeof (obj[key]) === 'object') {
        if (obj[key].type === 'object' || obj[key].type === 'array') {
          const generatedData = setFakerValues(obj[key].value);
          delete obj[key];
          obj[key] = generatedData;
        }

        if (obj[key].type === 'string' && obj[key].value.toString().startsWith('faker') || obj[key].type === 'number' && obj[key].value.toString().startsWith('faker')) {
          try {
            const fakerValue = eval(obj[key].value);
            delete obj[key];
            obj[key] = fakerValue;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err, 'Invalid faker function');
          }
        } 
        else if (obj[key].type === 'string') {
          const value = obj[key].value;
          delete obj[key];
          obj[key] = value;
        }

        else if (obj[key].type === 'number') {
          const value = obj[key].value;
          delete obj[key];
          obj[key] = parseInt(value);
        }

        else if (obj[key].type === 'boolean') {
          const value = obj[key].value === 'random' ? faker.random.boolean() : obj[key].value;
          delete obj[key];
          obj[key] = value;
        }
      }
    }
  }
  return obj;
};

export { generateFakerValues, setFakerValues };
