module.exports = {
  typescript: true,
  icon: true,
  native: false,
  memo: false,
  jsxRuntime: 'automatic',
  svgProps: {},
  replaceAttrValues: {},
  plugins: [
    '@svgr/plugin-svgo',
    '@svgr/plugin-jsx',
    '@svgr/plugin-prettier',
  ],
  prettierConfig: {
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'all',
    proseWrap: 'never',
  },
  svgoConfig: {
    plugins: [],
  },
};
