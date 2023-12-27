module.exports = {
  plugins: [
    require('@csstools/postcss-global-data')({
      files: [
        './src/styles/globals/fonts.css',
        './src/styles/globals/breakpoints.css',
        './src/styles/globals/themes.css',
        './src/styles/globals/layers.css',
      ]
    }),
    require('postcss-normalize'),
    require('autoprefixer'),
    require('postcss-easings'),
    require('postcss-preset-env')({
      stage: 2,
      features: {
        'custom-selectors': { preserve: false },
      }
    }),
    require('./postcss/resolveLocalCustomProperties'),
    require('postcss-color-mod-function'),
  ],
};
