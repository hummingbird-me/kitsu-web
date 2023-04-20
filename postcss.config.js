module.exports = {
  plugins: [
    require('postcss-custom-media')({
      importFrom: './src/styles/globals/breakpoints.css',
      exportTo: './src/styles/globals/breakpoints.json',
    }),
    require('postcss-normalize'),
    require('postcss-nesting'),
    require('autoprefixer'),
    require('postcss-easings'),
    require('postcss-preset-env'),
    require('postcss-custom-properties')({
      importFrom: './src/styles/globals/colors.css',
      exportTo: './src/styles/globals/colors.json',
      disableDeprecationNotice: true,
    }),
    require('./postcss/resolveLocalCustomProperties'),
    require('postcss-color-mod-function'),
  ],
};
