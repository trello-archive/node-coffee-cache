var expect = require('chai').expect;

var CachedFile = require('../lib/cached-file');
var config = require('../lib/config');

describe('CachedFile', function() {
  describe('constructor', function() {
    it('sets the source and target', function() {
      var f = new CachedFile('source.coffee');
      expect(f).to.have.property('_source', 'source.coffee');
      expect(f).to.have.property('_target', '.coffee/source.js');
    });
  });

  describe('.targetPathFor()', function() {
    it('changes the extension to .js', function() {
      var target = CachedFile.targetPathFor('source.coffee');
      expect(target).to.equal('.coffee/source.js');
    });

    it('uses config.cache and config.root', function() {
      config.set({ cache: 'cache', root: 'lib' });

      var target = CachedFile.targetPathFor('lib/source.coffee');
      expect(target).to.equal('cache/source.js');
    });
  });

  describe('#isValid()', function() {
    it('returns true if the cache is newer than the source');
    it('returns false if the cache is older than the source');
    it('returns false if the cache does not exist');
  });

  describe('#compile()', function() {
    it('returns the compiled version of the source');
    it('includes the source map');
    it('respects config.compileOptions');
  });

  describe('#read()', function() {
    it('returns the contents of the target');
  });

  describe('#write()', function() {
    it('writes the contents to the cache');
    it('takes an optional extension');
    it('automatically creates the path');
    it('throws if it cannot write');
  });

  describe('#update()', function() {
    it('writes the compiled output to cache');
  });

  describe('#toError()', function() {
    it('returns an error with a prettified message');
  });
});
