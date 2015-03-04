var expect = require('chai').expect;
var util = require('../lib/util');

describe('util', function() {
  describe('.setExt()', function() { 
    it('sets the extension', function() {
      var filepath = util.setExt("foo.jpg", ".gif");
      expect(filepath).to.equal("foo.gif");
    });

    it('maintains the directory', function() {
      var filepath = util.setExt("foo/bar.jpg", ".gif");
      expect(filepath).to.equal("foo/bar.gif");
    });
  });

  describe('.isCoffeeFile()', function() { 
    it('returns false for .js files', function() {
      expect(util.isCoffeeFile("foo.js")).to.be.false;
    });
    it('returns true for .coffee files', function() {
      expect(util.isCoffeeFile("foo.coffee")).to.be.true;
    });
    it('returns true for .litcoffee files', function() {
      expect(util.isCoffeeFile("foo.litcoffee")).to.be.true;
    });
    it('returns true for .md.coffee files', function() {
      expect(util.isCoffeeFile("foo.md.coffee")).to.be.true;
    });
  });
});
