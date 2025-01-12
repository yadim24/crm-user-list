const commonRules = {
  'import/prefer-default-export': 'off',
  'import/no-default-export': 'error',
  'react/jsx-props-no-spreading': 'off',
  'react/react-in-jsx-scope': 'off',
  'import/imports-first': ['error', 'absolute-first'],
  'react/prop-types': 'off',
  'react/require-default-props': 'off',
  'no-param-reassign': [
    'error',
    { props: true, ignorePropertyModificationsFor: ['draft'] },
  ],
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'arrow-function',
    },
  ],
  'react/jsx-no-useless-fragment': [
    'error',
    {
      allowExpressions: true,
    },
  ],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    { allowExpressions: true, allowTypedFunctionExpressions: true },
  ],
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: ['return', 'block-like'] },
    { blankLine: 'always', prev: ['block-like'], next: '*' },
  ],
};

module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
  },
  env: {
    browser: true,
    es2021: true,
  },
  rules: { ...commonRules },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.ts', '.tsx'],
      },
    },
  },
};
