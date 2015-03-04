var expect = require('chai').expect;

describe('exports', function() {
  describe('.configure()', function() {
    it('is tied to the config');
  });

  describe('.cacheFile()', function() {
    it('returns compiled JavaScript');
    it('does not fail when the cache fails');
    it('does not warn more than once');
  });
});

describe('require extensions', function() {
  it('are registered for each file type');
  it('returns a compiled module');
});
