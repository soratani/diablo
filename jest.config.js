/* eslint-disable no-undef */
const base = require('./jest.config.base.js');

module.exports = {
    ...base,
    setupFiles: ['<rootDir>/jest-setup.js','jest-canvas-mock'],
    projects:
    [
        '<rootDir>/packages/*/jest.config.js'
    ],
    coverageDirectory: '<rootDir>/coverage/'
};