var fs     = require('fs');
var path   = require('path');
var coffee = require('coffee-script');
var mkpath = require('mkpath');

// Directory to store compiled source
var cacheDir = process.env['COFFEE_CACHE_DIR'] || '.coffee';
// Storing coffee's require extension for backup use
var coffeeExtension = require.extensions['.coffee'];

// Set up an extension map for .coffee files -- we are completely overriding
// CoffeeScript's since it only returns the compiled module.
require.extensions['.coffee'] = function(module, filename) {
  // First, convert the filename to something more digestible and use our cache
  // folder
  var cachePath = path.join(cacheDir, path.relative('.', filename)).replace(/\.coffee$/, '.js');
  var content;

  // Try and stat the files for their last modified time
  try {
    var sourceTime = fs.statSync(filename).mtime;
    var cacheTime = fs.statSync(cachePath).mtime;
    if (cacheTime > sourceTime)
      // We can return the cached version
      content = fs.readFileSync(cachePath, 'utf8');
  } catch (err) {
    // If the cached file was not created yet, this will fail, and that is okay
  }

  // If we don't have the content, we need to compile ourselves
  if (!content) {
    try {
      // Read from disk and then compile
      content = coffee.compile(fs.readFileSync(filename, 'utf8'), {
        filename: filename
      });

      // Try writing to cache
      mkpath.sync(path.dirname(cachePath));
      fs.writeFileSync(cachePath, content, 'utf8');
    } catch (err) {
      // Let's fail silently and use coffee's require if we need to
      if (!content)
        return coffeeExtension.apply(this, arguments);
    }
  }

  return module._compile(content, filename);
};

// Export settings
module.exports = {
  setCacheDir: function(dir){
    cacheDir = dir;
    return this;
  }
};
