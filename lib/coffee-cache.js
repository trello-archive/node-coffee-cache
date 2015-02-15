var fs     = require('fs');
var path   = require('path');
var mkpath = require('mkpath');
var coffee = require('coffee-script');
coffee.register();

// Defaults
var config = {
  // Directory to store compiled source
  cache: '.coffee',
  // Root directory of project - use __dirname by default
  root: '.',
};

var configure = function(options) {
  Object.keys(options).forEach(function(key){
    config[key] = options[key];
  });
};

// Overrides from environment
configure({
  cache: process.env.COFFEE_CACHE_DIR,
  root: process.env.COFFEE_ROOT_DIR,
});


// Storing coffee's require extension for backup use
var coffeeExtension = require.extensions['.coffee'];

// Only log once if we can't write the cache directory
var cacheWriteError = (function() {
  var written = false;

  return function(target, err) {
    if (written) {
      return;
    }

    var message = [
      "coffee-cache: could not write to '",
      target,
      "': ",
      err.message
    ].join("");

    process.stderr.write(message);
    written = true;
  };
})();

var toCachePath = function(filename) {
  var relPath = path.relative(config.root, filename);
  return path.join(config.cache, relPath).replace(/\.coffee$/, '.js');
};

// Compile a file as you would with require and return the contents
function cacheFile(filename) {
  // First, convert the filename to something more digestible and use our cache
  // folder
  var cachePath = toCachePath(filename);
  var content;

  // Try and stat the files for their last modified time
  try {
    var cacheTime = fs.statSync(cachePath).mtime;
    var sourceTime = fs.statSync(filename).mtime;
    if (cacheTime > sourceTime) {
      // We can return the cached version
      content = fs.readFileSync(cachePath, 'utf8');
    }
  } catch (err) {
    // If the cached file was not created yet, this will fail, and that is okay
  }

  // If we don't have the content, we need to compile ourselves
  if (!content) {
    // Read from disk and then compile
    var mapPath = path.resolve(cachePath.replace(/\.js$/, '.map'));
    var compiled = coffee.compile(fs.readFileSync(filename, 'utf8'), {
      filename: filename,
      sourceMap: true
    });
    content = compiled.js;

    try {
      // Try writing to cache
      mkpath.sync(path.dirname(cachePath));
      fs.writeFileSync(cachePath, content, 'utf8');
      if (mapPath) {
        fs.writeFileSync(mapPath, compiled.v3SourceMap, 'utf8');
      }
    } catch (err) {
      cacheWriteError(cachePath, err);
    }
  }

  return content;
}

// Set up an extension map for .coffee files -- we are completely overriding
// CoffeeScript's since it only returns the compiled module.
require.extensions['.coffee'] = function(module, filename) {
  var content = cacheFile(filename);
  if (content) {
    // Successfully retrieved the file from disk or the cache
    return module._compile(content, filename);
  } else {
    // Something went wrong, so we can use coffee's require
    return coffeeExtension.apply(this, arguments);
  }
};

// Export settings
module.exports = {
  configure: configure,
  cacheFile: cacheFile,
};
