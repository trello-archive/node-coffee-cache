var fs = require('fs');
var path = require('path');
var CachedFile = require('./cached-file');

var cacheDirectory = function(root) {
  fs.readdirSync(root).forEach(function(node){
    var nodePath = path.join(root, node);

    if (fs.statSync(nodePath).isDirectory()) {
      cacheDirectory(nodePath);
    } else if (/\.coffee$/.test(node)) {
      f = new CachedFile(node);
      f.write();
    }
  });
};

module.exports = cacheDirectory;
