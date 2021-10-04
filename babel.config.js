// Only used by Jest
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { useBuiltIns: 'entry', corejs: '2', targets: { node: 'current' } },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'babel-preset-vite',
  ],
  plugins: [
    [
      'formatjs',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        ast: true,
      },
    ],
  ],
};
