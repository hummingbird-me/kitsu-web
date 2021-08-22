// jest.config.js

// TODO: switch to https://github.com/sodatea/vite-jest
module.exports = {
  setupFiles: ['dotenv/config'],
  collectCoverage: process.env.COVERAGE === 'true',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.(jpe?g|png|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': 'identity-obj-proxy',
    '^app/(.*)$': '<rootDir>/src/$1',
  },
  cacheDirectory: '.jest/cache',
};
