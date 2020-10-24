import Vue from 'vue';
import store from '../store';
const faker = require( 'faker' );

const generateFakerValues = ( obj, timesToRepeat ) => {
  if ( obj.type === 'array' ) {
    obj = new Array( obj );
  }
  let originalObj = obj[ 0 ];

  for ( let i = 0; i < timesToRepeat; i++ ) {
    for ( const key in originalObj.value ) {
      if ( originalObj.value[ key ].type === 'array' ) {
        originalObj.value[ key ] = new Array( originalObj.value[ key ] );
        let originalChildObj = originalObj.value[ key ][ 0 ];

        if ( originalObj.value[ key ].length < originalChildObj.timesToRepeat ) {
          generateFakerValues( originalObj.value[ key ], originalChildObj.timesToRepeat );
        }
      }
    }
    let clonedObject = Vue.prototype.$lodash.cloneDeep( originalObj.value );
    const mutatedObj = setFakerValues( clonedObject );
    obj.push( mutatedObj );

    // Remove the original model object
    if ( obj.length === timesToRepeat + 1 ) {
      obj.shift();
    }
  }
  return obj;
};

const setFakerValues = ( obj ) => {
  if ( typeof obj === 'object' ) {
    for ( const key in obj ) {
      if ( typeof ( obj[ key ] ) === 'object' ) {
        if ( obj[ key ].type === 'model' ) {
          const referencedModel = Object.values( store.state.models ).find( x => x.id === obj[ key ].value );
          const generatedData = setFakerValues( referencedModel.value );
          delete obj[ key ];
          obj[ key ] = generatedData;
        }

        if ( obj[ key ].type === 'object' || obj[ key ].type === 'array' ) {
          const generatedData = setFakerValues( obj[ key ].value );
          delete obj[ key ];
          obj[ key ] = generatedData;
        }

        if ( obj[ key ].type === 'string' && obj[ key ].value.toString().startsWith( 'faker' ) || obj[ key ].type === 'number' && obj[ key ].value.toString().startsWith( 'faker' ) ) {
          try {
            const fakerValue = eval( obj[ key ].value );
            delete obj[ key ];
            obj[ key ] = fakerValue;
          } catch ( err ) {
            // eslint-disable-next-line no-console
            console.error( err, 'Invalid faker function' );
          }
        } else if ( obj[ key ].type === 'string' ) {
          const value = obj[ key ].value;
          delete obj[ key ];
          obj[ key ] = value;
        } else if ( obj[ key ].type === 'number' ) {
          const value = obj[ key ].value;
          delete obj[ key ];
          obj[ key ] = parseInt( value );
        } else if ( obj[ key ].type === 'boolean' ) {
          const value = obj[ key ].value === 'random' ? faker.random.boolean() : obj[ key ].value;
          delete obj[ key ];
          obj[ key ] = value;
        }
      }
    }
  }
  return obj;
};

export {
  generateFakerValues,
  setFakerValues
};
