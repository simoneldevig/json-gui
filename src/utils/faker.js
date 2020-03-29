import faker from 'faker';

const generateFakerValues = (obj) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof (obj[key]) !== 'object') {
        delete obj[key];
      } 
      else if (typeof (obj[key]) === 'object') {
        if (obj[key].type === 'object' || obj[key].type === 'array') {
          const generatedData = generateFakerValues(obj[key].value);
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
            console.error('Invalid faker function');
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

export { generateFakerValues };
