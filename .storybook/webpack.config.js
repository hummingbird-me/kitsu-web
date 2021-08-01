const path = require('path');

module.exports = ({ config }) => {
  config.resolve.alias = {
    app: path.resolve(__dirname, '..', 'src'),
  };

  const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));

  const assetLoader = {
    loader: assetRule.loader,
    options: assetRule.options || assetRule.query,
  };

  // Merge our rule with existing assetLoader rules
  config.module.rules.unshift({
    test: /\.svg$/,
    use: ['@svgr/webpack', assetLoader],
  });

  return config;
};
