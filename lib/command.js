var fs = require('fs');
var path = require('path');

var CachedFile = require('./cached-file');
var util = require('./util');

var cacheTarget = function(target) {
  fs.readdirSync(target).forEach(function(node){
    var nodePath = path.join(target, node);

    if (fs.statSync(nodePath).isDirectory()) {
      cacheTarget(nodePath);
    } else if (util.isCoffeeFile(nodePath)) {
      var f = new CachedFile(nodePath);
      f.update(f.compile());
    }
  });
};

process.argv.slice(2).forEach(cacheTarget);
