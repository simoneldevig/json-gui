import Vue from 'vue';

const renameObjectKey = (oldObject, oldKey, newKey) => {
  const keys = Object.keys(oldObject);
  const newObject = keys.reduce((acc, val) => {
    if (val === oldKey) {
      acc[newKey] = oldObject[oldKey];
    }
    else {
      acc[val] = oldObject[val];
    }

    if (Array.isArray(oldObject[val])) {
      let clonedObject = Vue.prototype.$lodash.cloneDeep(acc[val][0].value);
      acc[val][0].value = renameObjectKey(clonedObject, oldKey, newKey);
    }

    return acc;
  }, {});
  
  return newObject;
};

const setObjectValue = (obj, newObj) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        setObjectValue(obj[key], newObj);
      } else if (key === 'value' && obj.id === newObj.id) {
        obj[key] = newObj.value;
      }
    }
  }
  return obj;
};

const deleteObject = (obj, idToDelete) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key].id === idToDelete) {
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
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export { renameObjectKey, setObjectValue, generateGuid, deleteObject };
