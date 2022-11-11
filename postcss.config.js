module.exports = {
  plugins: [
    require('postcss-custom-media')({
      importFrom: './src/styles/globals/breakpoints.css',
    }),
    require('postcss-nesting'),
    require('autoprefixer'),
    require('postcss-easings'),
    require('postcss-preset-env'),
    require('postcss-custom-properties')({
      importFrom: './src/styles/globals/colors.css',
    }),
    require('./postcss/resolveLocalCustomProperties'),
    require('postcss-color-mod-function'),
  ],
};
