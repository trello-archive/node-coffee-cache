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
