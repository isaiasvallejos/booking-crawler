const alias = require('alias-hq')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: alias.get('jest')
}
