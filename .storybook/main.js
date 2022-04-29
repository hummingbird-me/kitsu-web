const path = require('path');

module.exports = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.tsx',
  ],
  addons: [
    'storybook-addon-themes',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false },
    },
    'storybook-addon-designs',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-css-modules-preset',
  ],
  async webpackFinal(config) {
    config.resolve.alias = {
      app: path.resolve(__dirname, '..', 'src'),
      // HACK: Webpack is fucking something up and this fixes it idk
      './app': path.resolve(__dirname, '..', 'src'),
    };

    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));

    const assetLoader = {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query,
    };

    // Merge our rule with existing assetLoader rules
    config.module.rules.unshift({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false,
              },
            },
          },
        },
        assetLoader,
      ],
    });

    return config;
  },
};
