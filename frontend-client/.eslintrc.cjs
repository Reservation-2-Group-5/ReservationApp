/* eslint-env node */
const path = require('node:path');
const createAliasSetting = require('@vue/eslint-config-airbnb/createAliasSetting');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-airbnb',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': ['error', {
      ignores: [
        'Home',
      ],
    }],
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': ['error', {
      selector: 'ForInStatement',
      message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    }, {
      selector: 'LabeledStatement',
      message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    }, {
      selector: 'WithStatement',
      message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    }],
  },
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, './src')}`,
    }),
  },
};
