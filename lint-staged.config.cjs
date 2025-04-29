// lint-staged.config.cjs  <-- CommonJS
module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,css,scss}': 'prettier --write'
};
