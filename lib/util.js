var coffee = require('coffee-script');
var path = require('path');

exports.setExt = function(target, newExt) {
  var oldExt = path.extname(target);
  var base = path.basename(target, oldExt) + newExt;
  return path.join(path.dirname(target), base);
};

exports.isCoffeeFile = function(filename) {
  return coffee.FILE_EXTENSIONS.some(function(ext) {
    var index = filename.indexOf(ext);
    return index > 0 && index + ext.length == filename.length;
  });
};
