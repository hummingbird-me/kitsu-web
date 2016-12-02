module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  env: {
    browser: true
  },
  globals: {
    'MediumEditor': true,
    'rangy': true,
    'toMarkdown': true,
    'MobileDetect': true
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'space-before-function-paren': 'off',
    'prefer-rest-params': 'off',
    'func-names': 'off',
    'no-useless-escape': 'off'
  }
};
