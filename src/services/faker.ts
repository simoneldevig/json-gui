import Vue from 'vue';
import { BaseDTO } from '@/types';
import { FakerItem, FakerList } from '@/types/faker';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');

const setFakerValues = (obj: BaseDTO) => {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (typeof (obj[key]) === 'object') {
        if (obj[key].type === 'object' || obj[key].type === 'array') {
          let generatedData = setFakerValues(obj[key].value);
          if (obj[key].removeKey && Object.keys(generatedData).length === 1) {
            const propKey = Object.keys(generatedData)[0];
            generatedData = generatedData[propKey];
          }
          delete obj[key];
          obj[key] = generatedData;
        }

        if (Array.isArray(obj[key]) && (Object.keys(obj[key][0]).length === 1 || !Object.keys(obj[key][0]).every((val, _i, arr) => val === arr[0]))) {
          const flattenedArray: any = [];
          obj[key].forEach((item: any) => {
            const propKeys: string[] = Object.keys(item);
            propKeys.forEach((propKey: string) => {
              flattenedArray.push(obj[key][0][propKey]);
            });
          });
          delete obj[key];
          obj[key] = flattenedArray;
        }

        if ((obj[key].type === 'string' || obj[key].type === 'number') && obj[key].value.toString().startsWith('faker')) {
          try {
            // eslint-disable-next-line no-eval
            const fakerValue = eval(obj[key].value);
            delete obj[key];
            obj[key] = fakerValue;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err, 'Invalid faker function');
          }
        } else if (obj[key].type === 'string') {
          const value = obj[key].value;
          delete obj[key];
          obj[key] = value;
        } else if (obj[key].type === 'number') {
          const value = obj[key].value;
          delete obj[key];
          obj[key] = parseInt(value);
        } else if (obj[key].type === 'boolean') {
          const value = obj[key].value === 'random' ? faker.random.boolean() : obj[key].value === 'true';
          delete obj[key];
          obj[key] = value;
        }
      }
    });
  }
  return obj;
};

async function generateFakerValues (obj: BaseDTO, timesToRepeat: number) {
  return new Promise((resolve, reject) => {
    try {
      if (obj.type === 'array' || obj.type === 'object') {
        (obj as unknown as BaseDTO[]) = new Array(obj);
      }

      const originalObj = obj[0];

      [...Array(timesToRepeat)].forEach(() => {
        Object.keys(originalObj.value).forEach((key) => {
          if (originalObj.value[key].type === 'array') {
            originalObj.value[key] = new Array(originalObj.value[key]);
            const originalChildObj = originalObj.value[key][0];

            if (originalObj.value[key].length < originalChildObj.timesToRepeat || originalChildObj.type === 'array') {
              generateFakerValues(originalObj.value[key], originalChildObj.timesToRepeat);
            }
          } else if ((originalObj.value[key].type === 'object') && originalObj.value[key].value) {
            generateFakerValues(originalObj.value[key], 1);
          }
        });
        const clonedObject = Vue.prototype.$lodash.cloneDeep(originalObj.value);
        const mutatedObj = setFakerValues(clonedObject);
        obj.push(mutatedObj);

        // Remove the original model object
        if (obj.length === timesToRepeat + 1) {
          obj.shift();
        }
      });

      let generatedData = obj;
      if (originalObj.type === 'object') {
        generatedData = obj[0];
      } else if (originalObj.type === 'array') {
        const flattenedArray: any = [];
        generatedData.forEach((item: any, index: number) => {
          const propKeys: string[] = Object.keys(item);
          propKeys.forEach((propKey: string) => {
            flattenedArray.push(generatedData[index][propKey]);
          });
        });
        generatedData = flattenedArray;
      }

      resolve(generatedData);
    } catch (error) {
      reject(error);
    }
  });
};

const generateFakerList = (): FakerList => {
  let modules = Object.keys(faker);
  const fakerList: FakerList = [];

  modules = modules.sort();
  modules.forEach((module) => {
    const ignore = ['locale', 'locales', 'localeFallback', 'definitions', 'fake'];
    if (ignore.indexOf(module) !== -1) {
      return;
    }
    Object.keys(faker[module]).forEach(method => {
      if (typeof faker[module][method] === 'function') {
        const fakerMethod: FakerItem = {
          value: ''
        };
        fakerMethod.value = 'faker.' + module + '.' + method + '()';
        if (fakerList.indexOf(fakerMethod) === -1) {
          fakerList.push(fakerMethod);
        }
      }
    });
  });

  return fakerList;
};

export {
  generateFakerValues,
  setFakerValues,
  generateFakerList
};
