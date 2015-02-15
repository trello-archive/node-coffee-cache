var coffee = require('coffee-script');
var config = require('./config');
var util = require('./util');

function CachedFile(source) {
  this._source = source;
  this._target = this.getTargetPath();
}

CachedFile.prototype.getTargetPath = function() {
  var relative = path.relative(config.root, this._source);
  return util.setExt(path.join(config.cache, relPath), '.js');
};

CachedFile.prototype.isValid = function() {
  // Try and stat the files for their last modified time
  try {
    var cacheTime = fs.statSync(this._target).mtime;
    var sourceTime = fs.statSync(this._source).mtime;
    if (cacheTime > sourceTime) {
      // We can return the cached version
      return true;
    }
  } catch (err) {
    // If the cached file was not created yet, this will fail, and that is okay
  }

  return false;
};

CachedFile.prototype.getContents = function() {
  return fs.readFileSync(this._target, 'utf8');
};

CachedFile.prototype.compile = function() {
  var options = util.merge({
    filename: this._source,
    sourceMap: true,
  }, config.compileOptions);

  return coffee.compile(fs.readFileSync(this._source, 'utf8'), options);
};

CachedFile.prototype.write = function(contents, ext) {
  var target = this._target;
  if (ext) {
    target = util.setExt(target, ext);
  }

  try {
    mkpath.sync(path.dirname(target));
    fs.writeFileSync(target, contents, 'utf8');
  } catch (err) {
    throw this.toError(err);
  }
};

CachedFile.prototype.toError = function(err) {
  return new Error("coffee-cache: could not write to '" + this._target + ": " +
    err.message);
};

module.exports = CachedFile;