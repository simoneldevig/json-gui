import Vue from 'vue';
import { BaseDTO } from '@/types';
import store from '../store';

const renameObjectKey = (oldObject: BaseDTO, oldKey: string, newKey: string): BaseDTO => {
  const newObject = Object.keys(oldObject).reduce((acc: { [key: string]: BaseDTO }, val) => {
    if (val === oldKey) {
      acc[newKey] = oldObject[oldKey];
    } else {
      acc[val] = oldObject[val];
    }

    if (oldObject[val] && acc[val] && (oldObject[val].type === 'array' || oldObject[val].type === 'object')) {
      const clonedObject = Vue.prototype.$lodash.cloneDeep(acc[val].value);
      acc[val].value = renameObjectKey(clonedObject, oldKey, newKey);
    }

    return acc;
  }, {});

  return newObject as BaseDTO;
};

const setObjectValue = (obj: BaseDTO, newObj: BaseDTO) => {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        setObjectValue(obj[key], newObj);
      } else if (key === 'value' && obj.id === newObj.id) {
        obj[key] = newObj.value;
      }
    });
  }
  return obj;
};

async function replaceModelRefs (obj: BaseDTO) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof obj.value === 'object') {
        Object.keys(obj.value).forEach(async key => {
          if (obj.value[key].type === 'model' && obj.value[key].value) {
            const referencedModel = Vue.prototype.$lodash.cloneDeep(Object.values(store.state.models).find(x => (x as BaseDTO).id === obj.value[key].value));
            const remappedValues: any = await replaceModelRefs(referencedModel);
            remappedValues.type = 'object';
            delete obj.value[key];
            obj.value[key] = remappedValues;
          } else {
            replaceModelRefs(obj.value[key]);
          }
        });
      }
      resolve(obj);
    } catch (error) {
      reject(error);
    }
  });
}

const deleteObject = (obj: BaseDTO, idToDelete: string) => {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key].id === idToDelete) {
        delete obj[key];
      } else {
        deleteObject(obj[key], idToDelete);
      }
    });
  }
  return obj;
};

const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const resetObjectIds = (obj: BaseDTO) => {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        resetObjectIds(obj[key]);
      } else if (key === 'id') {
        obj[key] = generateGuid();
      }
    });
  }
  return obj;
};

const addToObject = (obj: any, key: any, value: any, index: any) => {
  // Create a temp object and index variable
  const temp: any = {};
  let i = 0;

  // Loop through the original object
  Object.keys(obj).forEach(prop => {
    // If the indexes match, add the new item
    if (i === index && key && value) {
      temp[key] = value;
    }
    // Add the current item in the loop to the temp obj
    temp[prop] = obj[prop];
    // Increase the count
    i++;
  });

  // If no index, add to the end
  if (!index && key && value) {
    temp[key] = value;
  }

  return temp;
};

export {
  renameObjectKey,
  setObjectValue,
  generateGuid,
  deleteObject,
  addToObject,
  resetObjectIds,
  replaceModelRefs
};
