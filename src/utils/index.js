const renameObjectKey = (oldObject, oldKey, newKey) => {
  const keys = Object.keys(oldObject);
  const newObject = keys.reduce((acc, val) => {
    if (val === oldKey) {
      acc[newKey] = oldObject[oldKey];
    }
    else {
      acc[val] = oldObject[val];
    }
    return acc;
  }, {});
  
  return newObject;
};

const setObjectValue = (obj, newObj) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] == "object") {
        setObjectValue(obj[key], newObj);
      } else if (key === 'value' && obj.id === newObj.id) {
        obj[key] = newObj.value;
      }
    }
  }
  return obj;
};

export { renameObjectKey, setObjectValue };
