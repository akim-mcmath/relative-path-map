'use strict';

var join = require('path').join;
var _ = require('lodash');

function relativePathMap(map) {
  return _.isObject(map) ? visitNode(map, [], map, {}) :
    _.isUndefined(map) ? throwError(Error, 'map argument must be defined') :
    throwError(TypeError, 'map argument must be an object');
}

function visitNode(node, keys, map, cache) {
  return _.isObject(node) ? visitObjectNode(node, keys, map, cache) :
    _.isString(node) ? visitPathNode(node, keys, map, cache) :
    node;
}

function visitObjectNode(node, keys, map, cache) {
  return _.transform(node, function(result, subNode, key) {
    result[key] = visitNode(subNode, keys.concat(key), map, cache);
  });
}

function visitPathNode(path, keys, map, cache) {
  var cached = _.get(cache, keys);
  return _.isString(cached) ? cached :
    _.isUndefined(cached) ? resolveUncached(path, keys, map, cache) :
    throwError(Error, 'Could not resolve circular reference', path);
}

function resolveUncached(path, keys, map, cache) {
  _.set(cache, keys, null); // For circular reference detection
  var resolved = resolvePath(path, keys, map, cache);
  _.set(cache, keys, resolved);
  return resolved;
}

function resolvePath(path, keys, map, cache) {
  var placeholder = getPlaceholder(path);
  return placeholder ? resolvePlaceholder(path, keys, map, cache, placeholder) :
    path;
}

function resolvePlaceholder(path, keys, map, cache, placeholder) {
  var newKeys = getPlaceholderKeys(path, keys, map, placeholder);
  var newPath = getPlaceholderPath(path, newKeys, map);
  var resolvedPlaceholder = visitPathNode(newPath, newKeys, map, cache);
  return expandPlaceholder(path, resolvedPlaceholder);
}

function getPlaceholderKeys(path, keys, map, placeholder) {
  return _.findLast(keys.slice(), function(value, i, arr) {
    return _.has(map, arr[i] = arr.slice(0, i).concat(placeholder));
  }) || throwError(Error, 'Could not find placeholder property', path);
}

function getPlaceholderPath(path, placeholderKeys, map) {
  var placeholderPath = _.get(map, placeholderKeys);
  return _.isString(placeholderPath) ? placeholderPath :
    throwError(TypeError, 'Placeholder property must be a string', path);
}

var placeholderMatcher = /^\[([\w\.]+)\]/;

function getPlaceholder(path) {
  var match = path.match(placeholderMatcher);
  return match ? match[1].split('.') : null;
}

function expandPlaceholder(path, resolvedPlaceholder) {
  return join(resolvedPlaceholder, path.replace(placeholderMatcher, ''));
}

function throwError(ErrorType, message, path) {
  var err = new ErrorType(message + (path ? ': "' + path + '"' : ''));
  Error.captureStackTrace(err, relativePathMap);
  throw err;
}

module.exports = relativePathMap;
