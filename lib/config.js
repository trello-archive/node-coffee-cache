var assign = require('lodash.assign');

// Defaults
var config = {
  // Directory to store compiled source
  cache: '.coffee',
  // Root directory of project - use current working directory by default
  root: '.',
  // Extra arguments to coffee.compile
  compileOptions: {},
};

Object.defineProperty(config, 'set', {
  enumerable: false,
  configurable: true,
  value: assign.bind(null, config),
});

// Overrides from environment
config.set({
  cache: process.env['COFFEE_CACHE_DIR'] || config.cache,
  root: process.env['COFFEE_ROOT_DIR'] || config.root,
});

module.exports = config;
