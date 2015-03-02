var expect = require('chai').expect;

var config = require('../lib/config');

describe('config', function() {
  describe('.set()', function() {
    it('mutates the setting values', function(){
      var update = {
        root: 'hello',
        cache: 'world',
        undef: 'new',
      };
      config.set(update);
      expect(config).to.match(update);
    });
  });
  describe('environment', function() {
    it('', function(){
    });
  });
});

