// istanbul ignore file

const config = {
  plugins: ['prettier-plugin-jinja-template'],
  overrides: [
    {
      files: ['*.njk'],
      options: {
        parser: 'jinja-template'
      }
    }
  ],
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  // doubleQuote: true,
  trailingComma: 'none'
};

export default config;
