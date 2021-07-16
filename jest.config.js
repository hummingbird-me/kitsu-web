// jest.config.js
module.exports = {
  preset: 'ts-jest',
  collectCoverage: process.env.COVERAGE === 'true',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1',
    '\\.(jpe?g|png|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': 'identity-obj-proxy',
  },
  cacheDirectory: '.jest/cache',
};
