var fs = require('fs');
var path = require('path');

var CachedFile = require('./cached-file');
var util = require('./util');

var cacheDirectory = function(root) {
  fs.readdirSync(root).forEach(function(node){
    var nodePath = path.join(root, node);

    if (fs.statSync(nodePath).isDirectory()) {
      cacheDirectory(nodePath);
    } else if (util.isCoffeeFile(node)) {
      var f = new CachedFile(node);
      f.update(f.compile());
    }
  });
};

module.exports = cacheDirectory;
