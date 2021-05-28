// jest.config.js
module.exports = {
  preset: 'ts-jest',
  collectCoverage: process.env.COVERAGE === 'true',
  testRunner: 'jest-circus/runner',
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1',
  },
  cacheDirectory: '.jest/cache',
};
