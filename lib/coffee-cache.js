var fs     = require('fs');
var path   = require('path');
var mkpath = require('mkpath');
// We don't want to include our own version of CoffeeScript since we don't know
// what version the parent relies on
var coffee;
try {
  coffee = require('coffee-script');
} catch (e) {
  // No coffee-script installed in the project; warn them and stop
  process.stderr.write("coffee-cache: No coffee-script package found.\n");
  return;
}

// Directory to store compiled source
var cacheDir = process.env['COFFEE_CACHE_DIR'] || '.coffee';
// Storing coffee's require extension for backup use
var coffeeExtension = require.extensions['.coffee'];

var wrapCompiled = function(content, filename, header) {
  // If we want to modify the header to include our source map, we must
  // overwrite the static Module.wrapper and then restore it. Ugly, but it's a
  // quick fix
  var wrapMethod = module.constructor.wrap;
  module.constructor.wrap = function(script){
    return (header || '') + wrapMethod(script);
  };
  var mod = module._compile(content, filename);
  // Restore and return
  module.constructor.wrap = wrapMethod;
  return mod;
};

var sourceMapHeader = function(path) {
  return "//@ sourceMappingURL=" + path + "\n";
};

// Set up an extension map for .coffee files -- we are completely overriding
// CoffeeScript's since it only returns the compiled module.
require.extensions['.coffee'] = function(module, filename) {
  // First, convert the filename to something more digestible and use our cache
  // folder
  var cachePath = path.join(cacheDir, path.relative('.', filename)).replace(/\.coffee$/, '.js');
  var mapPath = path.resolve(cachePath.replace(/\.js$/, '.map'));
  var content, header;

  // Try and stat the files for their last modified time
  try {
    var sourceTime = fs.statSync(filename).mtime;
    var cacheTime = fs.statSync(cachePath).mtime;
    if (cacheTime > sourceTime) {
      // We can return the cached version
      content = fs.readFileSync(cachePath, 'utf8');
      // Check for a source map as well
      if (fs.existsSync(mapPath))
        header = sourceMapHeader(mapPath);
    }
  } catch (err) {
    // If the cached file was not created yet, this will fail, and that is okay
  }

  // If we don't have the content, we need to compile ourselves
  if (!content) {
    try {
      // Read from disk and then compile
      var compiled = coffee.compile(fs.readFileSync(filename, 'utf8'), {
        filename: filename,
        sourceMap: true
      });
      content = compiled.js;

      if (compiled.v3SourceMap)
        header = sourceMapHeader(mapPath);

      // Try writing to cache
      mkpath.sync(path.dirname(cachePath));
      fs.writeFileSync(cachePath, content, 'utf8');
      if (mapPath)
        fs.writeFileSync(mapPath, compiled.v3SourceMap, 'utf8');
    } catch (err) {
      // Let's fail silently and use coffee's require if we need to
      if (!content)
        return coffeeExtension.apply(this, arguments);
    }
  }

  return wrapCompiled(content, filename, header);
};

// Export settings
module.exports = {
  setCacheDir: function(dir){
    cacheDir = dir;
    return this;
  }
};
