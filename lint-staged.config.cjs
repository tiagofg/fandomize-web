// lint-staged.config.cjs  <-- CommonJS
module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write', 'npm run --workspace fandomize test --bail --passWithNoTests'],
  '**/*.{json,md,css,scss}': 'prettier --write'
};
