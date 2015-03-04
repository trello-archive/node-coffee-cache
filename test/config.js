var expect = require('chai').expect;
var path = require('path');

CONFIG_PATH = path.resolve('./lib/config.js');

before(function(){
  this.existingConfig = require.cache[CONFIG_PATH];
});

beforeEach(function(){
  delete require.cache[CONFIG_PATH];
  this.config = require(CONFIG_PATH);
});

after(function(){
  require.cache[CONFIG_PATH] = this.existingConfig;
});

describe('config', function() {
  describe('defaults', function() {
    it('are defined', function() {
      expect(this.config).to.contain({
        cache: '.coffee',
        root: '.'
      });
    });
  });

  describe('environment', function() {
    before(function(){
      process.env['COFFEE_CACHE_DIR'] = 'foo';
      process.env['COFFEE_ROOT_DIR'] = 'bar';
    });

    after(function(){
      delete process.env['COFFEE_CACHE_DIR'];
      delete process.env['COFFEE_ROOT_DIR'];
    });

    it('overrides cache default', function(){
      expect(this.config).to.have.property('cache', 'foo');
    });

    it('overrides root default', function(){
      expect(this.config).to.have.property('root', 'bar');
    });
  });

  describe('.set()', function() {
    it('mutates the setting values', function(){
      var update = {
        root: 'hello',
        cache: 'world',
        undef: 'new',
      };
      this.config.set(update);
      expect(this.config).to.contain(update);
    });
  });
});

