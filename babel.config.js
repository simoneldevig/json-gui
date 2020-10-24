module.exports = {
  presets: [
    '@vue/app'
  ],
  ecmaFeatures: {
    legacyDecorators: true
  },
  plugins: [
    [ '@babel/proposal-decorators', {
      legacy: true
    } ],
    [ '@babel/proposal-class-properties', {
      loose: true
    } ]
  ]
};
