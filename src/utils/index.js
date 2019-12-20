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

export { renameObjectKey };
