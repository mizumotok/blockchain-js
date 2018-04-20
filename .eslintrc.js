module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb-base", "plugin:jest/recommended"],
  "plugins": ["flowtype", "jest", "import"],
  "rules": {
      "no-console": 0,
  },
  "env": {
      "jest": true
  }
};
