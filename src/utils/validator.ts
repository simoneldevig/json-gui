import store from '../store';
import { ValidationResult } from '@/types';

const validateEntry = (type: string, value: string) => {
  const state = store.state;
  let validationResult: ValidationResult = {
    valid: true,
    touched: true,
    validationMessage: ''
  };

  if (!value) {
    validationResult = {
      valid: false,
      touched: true,
      validationMessage: 'Please enter a value'
    };
    return validationResult;
  }

  if (Object.keys(state.endpoints).includes(value) || Object.keys(state.models).includes(value)) {
    validationResult = {
      valid: false,
      touched: true,
      validationMessage: `A ${type} with the name ${value} already exist`
    };
  }

  return validationResult;
};

export {
  validateEntry
};
