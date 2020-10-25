import Vue from 'vue';
import { BaseDTO } from '@/types';

const renameObjectKey = (oldObject: BaseDTO, oldKey: string, newKey: string): BaseDTO => {
  const keys = Object.keys(oldObject);
  const newObject = keys.reduce((acc: { [key: string]: BaseDTO }, val) => {
    if (val === oldKey) {
      acc[newKey] = oldObject[oldKey];
    } else {
      acc[val] = oldObject[val];
    }
    if (typeof oldObject[val].value === 'object' && oldObject[val] && oldObject[val].type !== 'array') {
      const clonedObject = Vue.prototype.$lodash.cloneDeep(acc[val].value);
      acc[val].value = renameObjectKey(clonedObject, oldKey, newKey);
    }

    return acc;
  }, {});

  return newObject as BaseDTO;
};

const setObjectValue = (obj: BaseDTO, newObj: BaseDTO) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        setObjectValue(obj[key], newObj);
      } else if (key === 'value' && obj.id === newObj.id) {
        obj[key] = newObj.value;
      }
    }
  }
  return obj;
};

const deleteObject = (obj: BaseDTO, idToDelete: string) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, 'key')) {
        if (typeof obj[key] === 'object' && obj[key].id === idToDelete) {
          delete obj[key];
        } else {
          deleteObject(obj[key], idToDelete);
        }
      }
    }
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

const addToObject = (obj: any, key: any, value: any, index: any) => {
  // Create a temp object and index variable
  const temp: any = {};
  let i = 0;

  // Loop through the original object
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, 'key')) {
      // If the indexes match, add the new item
      if (i === index && key && value) {
        temp[key] = value;
      }
      // Add the current item in the loop to the temp obj
      temp[prop] = obj[prop];
      // Increase the count
      i++;
    }
  }

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
  addToObject
};
