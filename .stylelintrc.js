module.exports = {
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'theme',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
  },
  extends: require.resolve('@umijs/max/stylelint'),
};
