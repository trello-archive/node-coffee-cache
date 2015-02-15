var fs = require('fs');
var mkpath = require('mkpath');
var path = require('path');
var config = require('./config');
var CachedFile = require('./cached-file');

// Compile a file as you would with require and return the contents
function cacheFile(filename) {
  var cached = new CachedFile(filename);
  if (cached.isValid()) {
    return cached.getContents();
  } else {
    var contents = cached.compile();
    cached.write(contents.js);
    cached.write(contents.v3SourceMap, '.js.map');
  }
}

// Set up an extension map for .coffee files -- we are completely overriding
// CoffeeScript's since it only returns the compiled module.
require.extensions['.coffee'] = function(module, filename) {
  //var content = cacheFile(

  // Successfully retrieved the file from disk or the cache
  return module._compile(content, filename);
};

// Export settings
module.exports = {
  configure: config.set,
  cacheFile: cacheFile,
};
