var expect = require('chai').expect;

var CachedFile = require('../lib/cached-file');

describe('CachedFile', function() {
  describe('constructor', function() {
    it('sets the source and target', function(){
      var f = new CachedFile('source.coffee');
      expect(f).to.have.property('_source', 'source.coffee');
      expect(f).to.have.property('_target', '../.coffee/source.js');
    });
  });

  describe('.targetPathFor()', function() {
  });
  describe('#isValid()', function() {
  });
  describe('#compile()', function() {
  });
  describe('#read()', function() {
  });
  describe('#write()', function() {
  });
  describe('#update()', function() {
  });
  describe('#toError()', function() {
  });
});
