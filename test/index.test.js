'use strict';

var expect = require('chai').expect;

describe('module:relative-path-map', function() {

  var relativePathMap;
  before(function() {
    relativePathMap = require('../index');
  });

  it('is the main module', function() {
    expect(relativePathMap).to.equal(require('..'));
  });

  it('is a function', function() {
    expect(relativePathMap).to.be.a('function');
  });

  it('is named "relativePathMap"', function() {
    expect(relativePathMap).property('name', 'relativePathMap');
  });

  describe('param[0]:map', function() {

    it('throws Error if called with undefined', function() {
      expect(relativePathMap.bind(null))
        .to.throw(Error, 'map argument must be defined');
    });

    it('throws TypeError if called with non-object', function() {
      expect(relativePathMap.bind(null, 42))
        .to.throw(TypeError, 'map argument must be an object');
    });

    it('throws Error if placeholder property is undefined', function() {
      expect(relativePathMap.bind(null, {
        one: '[two]/one.js',
        two: '[three]/two.js'
      })).to.throw(Error, 'Could not find placeholder property');
    });

    it('throws TypeError if placeholder refers to non-string', function() {
      expect(relativePathMap.bind(null, {
        one: ['a.js', 'b.js'],
        two: '[one]/two.js',
      })).to.throw(TypeError, 'Placeholder property must be a string');
    });

    it('throws Error if map contains circular reference', function() {
      expect(relativePathMap.bind(null, {
        one: '[two]/one.js',
        two: '[one]/two.js'
      })).to.throw(Error, 'Could not resolve circular reference');
    });
  });

  describe('returns', function() {

    var mock; var returned;
    before(function() {
      returned = relativePathMap(mock = {
        answer: 42,
        normalize: '[root]join.js',
        root: 'root/path',
        one: '[root]/one',
        array: [
          '[root]/arr',
          '[one]/b.js',
          '[0]/c.js'
        ],
        object: {
          d: '[root]/obj',
          e: '[one]/e.js',
          f: '[d]/f.js'
        },
        dot: '[object.d]/dot.js'
      });
    });

    it('returns an object', function() {
      expect(returned).to.be.an('object');
    });

    it('returned object is a new object, not the one passed in', function() {
      expect(returned).not.to.equal(mock);
    });

    it('normalizes placeholder paths', function() {
      expect(returned).property('normalize').to.equal('root/path/join.js');
    });

    it('leaves non-string primitives unmodified', function() {
      expect(returned).property('answer').to.equal(42);
    });

    it('leaves strings without placeholders unmodified', function() {
      expect(returned).property('root').to.equal('root/path');
    });

    it('resolves top-level strings with placeholders', function() {
      expect(returned).property('one').to.equal('root/path/one');
    });

    it('resolves arrays of strings with placeholders', function() {
      expect(returned).deep.property('array.0').to.equal('root/path/arr');
      expect(returned).deep.property('array.1').to.equal('root/path/one/b.js');
      expect(returned).deep.property('array.2').to.equal('root/path/arr/c.js');
    });

    it('resolves sub-objects of strings with placeholders', function() {
      expect(returned).deep.property('object.d').to.equal('root/path/obj');
      expect(returned).deep.property('object.e').to.equal('root/path/one/e.js');
      expect(returned).deep.property('object.f').to.equal('root/path/obj/f.js');
    });

    it('resolves placeholders that use dot-notation', function() {
      expect(returned).property('dot').to.equal('root/path/obj/dot.js');
    });
  });
});
