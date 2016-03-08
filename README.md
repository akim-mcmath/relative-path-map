# relative-path-map

[![Version][version-badge]][npm]
[![License][license-badge]][license]
[![Build][build-badge]][travis]
[![Coverage][coverage-badge]][coveralls]
[![Dependencies][dependencies-badge]][gemnasium]

Resolves a map of paths where some paths are relative to others in the same
object. Useful for describing directory structures and for project
configuration.

## Install

Install via [npm][npm]:

```sh
npm install --save-dev relative-path-map
```

## Examples

#### Simple example

```js
var relativePathMap = require('relative-path-map');

relativePathMap({
  root: 'root/path',
  sub: '[root]/sub' // => 'root/path/sub'
});
```

#### Sub-object with relative paths

```js
relativePathMap({
  root: 'root/path',
  obj: {
    sub: '[root]/sub', // => 'root/path/sub'
    file: '[sub]/file.js' // => 'root/path/sub/file.js'
  }
});
```

#### Array with relative paths

```js
relativePathMap({
  root: 'root/path',
  arr: [
    '[root]/sub', // => 'root/path/sub'
    '[0]/file.js' // => 'root/path/sub/file.js'
  ]
});
```

#### Placeholder with sub-property

```js
relativePathMap({
  obj: {
    sub: 'some/path',
  },
  dot: '[obj.sub]/dot-notation.js' // => // 'some/path/dot-notation.js'
});
```

## API

### `relativePathMap(map)`

### Params

##### map `object`

An object containing strings representing paths. Paths beginning with a
placeholder `[<prop>]` are relative to some other path in the same object, where
`<prop>` is a property name, e.g. `[root]`, or a sub-property name, e.g
`[root.src]`.

### Returns

Type: `object`

Returns an object whose relative paths have been resolved.

## License

Copyright &copy; 2016 Akim McMath. Licensed under the [MIT License][license].

[version-badge]: https://img.shields.io/npm/v/relative-path-map.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/relative-path-map.svg?style=flat-square
[build-badge]: https://img.shields.io/travis/akim-mcmath/relative-path-map/master.svg?style=flat-square
[coverage-badge]: https://img.shields.io/coveralls/akim-mcmath/relative-path-map/master.svg?style=flat-square&service=github
[dependencies-badge]: https://img.shields.io/gemnasium/akim-mcmath/relative-path-map.svg?style=flat-square

[npm]: https://www.npmjs.com/package/relative-path-map
[license]: LICENSE.txt
[travis]: https://travis-ci.org/akim-mcmath/relative-path-map
[coveralls]: https://coveralls.io/github/akim-mcmath/relative-path-map?branch=master
[gemnasium]: https://gemnasium.com/akim-mcmath/relative-path-map
