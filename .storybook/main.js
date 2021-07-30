const path = require('path');
const svgr = require('vite-plugin-svgr');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-themes",
  ],
  "core": {
    "builder": "storybook-builder-vite"
  },
  viteFinal: async config => {
    config.plugins = [
      ...config.plugins,
      svgr(),
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      app: path.resolve(__dirname, '..', 'src'),
    };

    return config;
  },
}
