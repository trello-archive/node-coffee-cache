var coffee = require('coffee-script');
var fs = require('fs');
var mkpath = require('mkpath');
var once = require('lodash.once');
var path = require('path');

var config = require('./config');
var CachedFile = require('./cached-file');

var warn = once(function(message){
  process.stderr.write(message);
});

// Compile a file as you would with require and return the contents
var cacheFile = function(filename) {
  var cached = new CachedFile(filename);

  if (cached.isValid()) {
    return cached.read();
  }

  var compiled = cached.compile();
  try {
    cached.update(compiled);
  } catch (err) {
    warn(err.message);
  }

  return compiled.js;
};

// Set up an extension map for coffee files -- we are completely overriding
// CoffeeScript's since it only returns the compiled module.
coffee.FILE_EXTENSIONS.forEach(function(extension) {
  require.extensions[extension] = function(module, filename) {
    return module._compile(cacheFile(filename), filename);
  };
});

// Export settings
module.exports = {
  configure: config.set,
  cacheFile: cacheFile,
};
