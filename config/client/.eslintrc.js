module.exports = {
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "root": true,
  "env": {
    "es6": true,
    "browser": true,
    "amd": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "allowImportExportEverywhere": true
  },
  "globals": {
    "process": true,
    "module": true,
    "__webpack_public_path__": true
  },
  "rules": {
    "array-bracket-spacing": [2, "never"],
    "block-scoped-var": 2,
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    "camelcase": 0,
    "computed-property-spacing": [2, "never"],
    "eol-last": 2,
    "new-cap": 1,
    "no-console": 0,
    "no-extend-native": 2,
    "no-mixed-spaces-and-tabs": 2,
    "no-trailing-spaces": 2,
    "no-unused-vars": ["error"],
    "no-undef": ["error"],
    "no-use-before-define": [2, "nofunc"],
    "no-useless-escape": 1,
    "object-curly-spacing": [2, "always"],
    "quotes": [2, "single", "avoid-escape"],
    "semi": ["error", "always"],
    "keyword-spacing": [2, {"before": true, "after": true}],
    "space-before-function-paren": ["error", "always"],
    "space-unary-ops": 2,
    "comma-spacing": ["error", { "before": false, "after": true }],
    "space-infix-ops": ["error"],
    "space-before-blocks": ["error"],
    "arrow-spacing":  ["error"],
    "block-spacing": ["error"],
    "indent": ["error", 2]
  }
};
