module.exports = {
  root: true,
  parserOptions: {
    "sourceType": "module",
  },
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
