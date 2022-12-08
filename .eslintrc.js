module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  plugins: ['prettier'],
  extends: [
    'airbnb-base',
    'eslint-config-prettier',
    'plugin:compat/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-return-assign': ['error', 'except-parens'],
    'no-void': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': ['error', {functions: false}],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  settings: {
    polyfills: [
      // App which dependence this lib should pollyfill these methods:
      'Symbol'
    ]
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  }
};
