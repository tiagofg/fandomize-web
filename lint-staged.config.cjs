// lint-staged.config.cjs
module.exports = {
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'npm run --workspace fandomize test -- --findRelatedTests --bail --passWithNoTests'
  ],
  '**/*.{json,md,css,scss}': 'prettier --write'
};
