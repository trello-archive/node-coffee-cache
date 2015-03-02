var coffee = require('coffee-script');
var path = require('path');

exports.merge = function(a, b) {
  Object.keys(b).forEach(function(key){
    a[key] = b[key];
  });
};

exports.setExt = function(target, newExt, oldExt) {
  if (!oldExt) {
    oldExt = path.extname(target);
  }
  return path.dirname(target) + path.basename(target, oldExt) + newExt;
};

exports.once = function(fn) {
  var run = false;
  return function() {
    if (!run) {
      run = true;
      return fn.apply(this, arguments);
    }
  };
};

exports.isCoffeeFile = function(filename) {
  return coffee.FILE_EXTENSIONS.indexOf(path.extname(filename)) >= 0;
};
