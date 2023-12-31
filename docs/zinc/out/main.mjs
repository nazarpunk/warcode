"use strict";
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/chevrotain/lib/src/version.js
var VERSION = "11.0.1";

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;

// node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

// node_modules/lodash-es/isSymbol.js
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

// node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default = arrayMap;

// node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// node_modules/lodash-es/_baseToString.js
var INFINITY = 1 / 0;
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray_default(value)) {
    return arrayMap_default(value, baseToString) + "";
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var baseToString_default = baseToString;

// node_modules/lodash-es/_trimmedEndIndex.js
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var trimmedEndIndex_default = trimmedEndIndex;

// node_modules/lodash-es/_baseTrim.js
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var baseTrim_default = baseTrim;

// node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

// node_modules/lodash-es/toNumber.js
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol_default(value)) {
    return NAN;
  }
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_default = toNumber;

// node_modules/lodash-es/toFinite.js
var INFINITY2 = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY2 || value === -INFINITY2) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_default = toFinite;

// node_modules/lodash-es/toInteger.js
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default = toInteger;

// node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default = identity;

// node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

// node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var toSource_default = toSource;

// node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;

// node_modules/lodash-es/_WeakMap.js
var WeakMap = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap;

// node_modules/lodash-es/_baseCreate.js
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate_default = baseCreate;

// node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default = apply;

// node_modules/lodash-es/noop.js
function noop() {
}
var noop_default = noop;

// node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var copyArray_default = copyArray;

// node_modules/lodash-es/_shortOut.js
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var shortOut_default = shortOut;

// node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default = constant;

// node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var defineProperty_default = defineProperty;

// node_modules/lodash-es/_baseSetToString.js
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;

// node_modules/lodash-es/_setToString.js
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;

// node_modules/lodash-es/_arrayEach.js
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var arrayEach_default = arrayEach;

// node_modules/lodash-es/_baseFindIndex.js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default = baseFindIndex;

// node_modules/lodash-es/_baseIsNaN.js
function baseIsNaN(value) {
  return value !== value;
}
var baseIsNaN_default = baseIsNaN;

// node_modules/lodash-es/_strictIndexOf.js
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
var strictIndexOf_default = strictIndexOf;

// node_modules/lodash-es/_baseIndexOf.js
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
}
var baseIndexOf_default = baseIndexOf;

// node_modules/lodash-es/_arrayIncludes.js
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf_default(array, value, 0) > -1;
}
var arrayIncludes_default = arrayIncludes;

// node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;

// node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var baseAssignValue_default = baseAssignValue;

// node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default = eq;

// node_modules/lodash-es/_assignValue.js
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignValue_default = assignValue;

// node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
var copyObject_default = copyObject;

// node_modules/lodash-es/_overRest.js
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var overRest_default = overRest;

// node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
var baseRest_default = baseRest;

// node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type == "string" && index in object) {
    return eq_default(object[index], value);
  }
  return false;
}
var isIterateeCall_default = isIterateeCall;

// node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var createAssigner_default = createAssigner;

// node_modules/lodash-es/_isPrototype.js
var objectProto5 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value === proto;
}
var isPrototype_default = isPrototype;

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default = baseTimes;

// node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// node_modules/lodash-es/isArguments.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
var isArguments = baseIsArguments_default(function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

// node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// node_modules/lodash-es/_arrayLikeKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// node_modules/lodash-es/_baseKeys.js
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;

// node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default = keys;

// node_modules/lodash-es/assign.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
var assign = createAssigner_default(function(object, source) {
  if (isPrototype_default(source) || isArrayLike_default(source)) {
    copyObject_default(source, keys_default(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty7.call(source, key)) {
      assignValue_default(object, key, source[key]);
    }
  }
});
var assign_default = assign;

// node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var nativeKeysIn_default = nativeKeysIn;

// node_modules/lodash-es/_baseKeysIn.js
var objectProto10 = Object.prototype;
var hasOwnProperty8 = objectProto10.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var baseKeysIn_default = baseKeysIn;

// node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
var keysIn_default = keysIn;

// node_modules/lodash-es/_isKey.js
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var isKey_default = isKey;

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto11 = Object.prototype;
var hasOwnProperty9 = objectProto11.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty9.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// node_modules/lodash-es/_hashHas.js
var objectProto12 = Object.prototype;
var hasOwnProperty10 = objectProto12.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty10.call(data, key);
}
var hashHas_default = hashHas;

// node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var hashSet_default = hashSet;

// node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default = listCacheGet;

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default = isKeyable;

// node_modules/lodash-es/_getMapData.js
function getMapData(map2, key) {
  var data = map2.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// node_modules/lodash-es/memoize.js
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
memoize.Cache = MapCache_default;
var memoize_default = memoize;

// node_modules/lodash-es/_memoizeCapped.js
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize_default(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var memoizeCapped_default = memoizeCapped;

// node_modules/lodash-es/_stringToPath.js
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped_default(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
var stringToPath_default = stringToPath;

// node_modules/lodash-es/toString.js
function toString(value) {
  return value == null ? "" : baseToString_default(value);
}
var toString_default = toString;

// node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
}
var castPath_default = castPath;

// node_modules/lodash-es/_toKey.js
var INFINITY3 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol_default(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY3 ? "-0" : result;
}
var toKey_default = toKey;

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default = baseGet;

// node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_default = get;

// node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values2) {
  var index = -1, length = values2.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values2[index];
  }
  return array;
}
var arrayPush_default = arrayPush;

// node_modules/lodash-es/_isFlattenable.js
var spreadableSymbol = Symbol_default ? Symbol_default.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray_default(value) || isArguments_default(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var isFlattenable_default = isFlattenable;

// node_modules/lodash-es/_baseFlatten.js
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable_default);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush_default(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var baseFlatten_default = baseFlatten;

// node_modules/lodash-es/flatten.js
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
var flatten_default = flatten;

// node_modules/lodash-es/_getPrototype.js
var getPrototype = overArg_default(Object.getPrototypeOf, Object);
var getPrototype_default = getPrototype;

// node_modules/lodash-es/_baseSlice.js
function baseSlice(array, start, end) {
  var index = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
var baseSlice_default = baseSlice;

// node_modules/lodash-es/_arrayReduce.js
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1, length = array == null ? 0 : array.length;
  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}
var arrayReduce_default = arrayReduce;

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// node_modules/lodash-es/_baseAssign.js
function baseAssign(object, source) {
  return object && copyObject_default(source, keys_default(source), object);
}
var baseAssign_default = baseAssign;

// node_modules/lodash-es/_baseAssignIn.js
function baseAssignIn(object, source) {
  return object && copyObject_default(source, keysIn_default(source), object);
}
var baseAssignIn_default = baseAssignIn;

// node_modules/lodash-es/_cloneBuffer.js
var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
var cloneBuffer_default = cloneBuffer;

// node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var arrayFilter_default = arrayFilter;

// node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default = stubArray;

// node_modules/lodash-es/_getSymbols.js
var objectProto13 = Object.prototype;
var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// node_modules/lodash-es/_copySymbols.js
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object);
}
var copySymbols_default = copySymbols;

// node_modules/lodash-es/_getSymbolsIn.js
var nativeGetSymbols2 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
  var result = [];
  while (object) {
    arrayPush_default(result, getSymbols_default(object));
    object = getPrototype_default(object);
  }
  return result;
};
var getSymbolsIn_default = getSymbolsIn;

// node_modules/lodash-es/_copySymbolsIn.js
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object);
}
var copySymbolsIn_default = copySymbolsIn;

// node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default = baseGetAllKeys;

// node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default = getAllKeys;

// node_modules/lodash-es/_getAllKeysIn.js
function getAllKeysIn(object) {
  return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
}
var getAllKeysIn_default = getAllKeysIn;

// node_modules/lodash-es/_DataView.js
var DataView = getNative_default(root_default, "DataView");
var DataView_default = DataView;

// node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// node_modules/lodash-es/_Set.js
var Set = getNative_default(root_default, "Set");
var Set_default = Set;

// node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;

// node_modules/lodash-es/_initCloneArray.js
var objectProto14 = Object.prototype;
var hasOwnProperty11 = objectProto14.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var initCloneArray_default = initCloneArray;

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
var cloneArrayBuffer_default = cloneArrayBuffer;

// node_modules/lodash-es/_cloneDataView.js
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var cloneDataView_default = cloneDataView;

// node_modules/lodash-es/_cloneRegExp.js
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var cloneRegExp_default = cloneRegExp;

// node_modules/lodash-es/_cloneSymbol.js
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var cloneSymbol_default = cloneSymbol;

// node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var cloneTypedArray_default = cloneTypedArray;

// node_modules/lodash-es/_initCloneByTag.js
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag2 = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var float32Tag2 = "[object Float32Array]";
var float64Tag2 = "[object Float64Array]";
var int8Tag2 = "[object Int8Array]";
var int16Tag2 = "[object Int16Array]";
var int32Tag2 = "[object Int32Array]";
var uint8Tag2 = "[object Uint8Array]";
var uint8ClampedTag2 = "[object Uint8ClampedArray]";
var uint16Tag2 = "[object Uint16Array]";
var uint32Tag2 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag2:
      return cloneArrayBuffer_default(object);
    case boolTag2:
    case dateTag2:
      return new Ctor(+object);
    case dataViewTag3:
      return cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return cloneTypedArray_default(object, isDeep);
    case mapTag3:
      return new Ctor();
    case numberTag2:
    case stringTag2:
      return new Ctor(object);
    case regexpTag2:
      return cloneRegExp_default(object);
    case setTag3:
      return new Ctor();
    case symbolTag2:
      return cloneSymbol_default(object);
  }
}
var initCloneByTag_default = initCloneByTag;

// node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
var initCloneObject_default = initCloneObject;

// node_modules/lodash-es/_baseIsMap.js
var mapTag4 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike_default(value) && getTag_default(value) == mapTag4;
}
var baseIsMap_default = baseIsMap;

// node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
var isMap_default = isMap;

// node_modules/lodash-es/_baseIsSet.js
var setTag4 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike_default(value) && getTag_default(value) == setTag4;
}
var baseIsSet_default = baseIsSet;

// node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
var isSet_default = isSet;

// node_modules/lodash-es/_baseClone.js
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var boolTag3 = "[object Boolean]";
var dateTag3 = "[object Date]";
var errorTag2 = "[object Error]";
var funcTag3 = "[object Function]";
var genTag2 = "[object GeneratorFunction]";
var mapTag5 = "[object Map]";
var numberTag3 = "[object Number]";
var objectTag3 = "[object Object]";
var regexpTag3 = "[object RegExp]";
var setTag5 = "[object Set]";
var stringTag3 = "[object String]";
var symbolTag3 = "[object Symbol]";
var weakMapTag3 = "[object WeakMap]";
var arrayBufferTag3 = "[object ArrayBuffer]";
var dataViewTag4 = "[object DataView]";
var float32Tag3 = "[object Float32Array]";
var float64Tag3 = "[object Float64Array]";
var int8Tag3 = "[object Int8Array]";
var int16Tag3 = "[object Int16Array]";
var int32Tag3 = "[object Int32Array]";
var uint8Tag3 = "[object Uint8Array]";
var uint8ClampedTag3 = "[object Uint8ClampedArray]";
var uint16Tag3 = "[object Uint16Array]";
var uint32Tag3 = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag3] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag3] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_default(value)) {
    return value;
  }
  var isArr = isArray_default(value);
  if (isArr) {
    result = initCloneArray_default(value);
    if (!isDeep) {
      return copyArray_default(value, result);
    }
  } else {
    var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value)) {
      return cloneBuffer_default(value, isDeep);
    }
    if (tag == objectTag3 || tag == argsTag3 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag_default(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack_default());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet_default(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_default(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach_default(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var baseClone_default = baseClone;

// node_modules/lodash-es/clone.js
var CLONE_SYMBOLS_FLAG2 = 4;
function clone(value) {
  return baseClone_default(value, CLONE_SYMBOLS_FLAG2);
}
var clone_default = clone;

// node_modules/lodash-es/compact.js
function compact(array) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var compact_default = compact;

// node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
var setCacheAdd_default = setCacheAdd;

// node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
var setCacheHas_default = setCacheHas;

// node_modules/lodash-es/_SetCache.js
function SetCache(values2) {
  var index = -1, length = values2 == null ? 0 : values2.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values2[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var arraySome_default = arraySome;

// node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default = cacheHas;

// node_modules/lodash-es/_equalArrays.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var equalArrays_default = equalArrays;

// node_modules/lodash-es/_mapToArray.js
function mapToArray(map2) {
  var index = -1, result = Array(map2.size);
  map2.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var mapToArray_default = mapToArray;

// node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var setToArray_default = setToArray;

// node_modules/lodash-es/_equalByTag.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
var boolTag4 = "[object Boolean]";
var dateTag4 = "[object Date]";
var errorTag3 = "[object Error]";
var mapTag6 = "[object Map]";
var numberTag4 = "[object Number]";
var regexpTag4 = "[object RegExp]";
var setTag6 = "[object Set]";
var stringTag4 = "[object String]";
var symbolTag4 = "[object Symbol]";
var arrayBufferTag4 = "[object ArrayBuffer]";
var dataViewTag5 = "[object DataView]";
var symbolProto3 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf2 = symbolProto3 ? symbolProto3.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag5:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag4:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag4:
    case dateTag4:
    case numberTag4:
      return eq_default(+object, +other);
    case errorTag3:
      return object.name == other.name && object.message == other.message;
    case regexpTag4:
    case stringTag4:
      return object == other + "";
    case mapTag6:
      var convert = mapToArray_default;
    case setTag6:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag4:
      if (symbolValueOf2) {
        return symbolValueOf2.call(object) == symbolValueOf2.call(other);
      }
  }
  return false;
}
var equalByTag_default = equalByTag;

// node_modules/lodash-es/_equalObjects.js
var COMPARE_PARTIAL_FLAG3 = 1;
var objectProto15 = Object.prototype;
var hasOwnProperty12 = objectProto15.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var equalObjects_default = equalObjects;

// node_modules/lodash-es/_baseIsEqualDeep.js
var COMPARE_PARTIAL_FLAG4 = 1;
var argsTag4 = "[object Arguments]";
var arrayTag3 = "[object Array]";
var objectTag4 = "[object Object]";
var objectProto16 = Object.prototype;
var hasOwnProperty13 = objectProto16.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
  objTag = objTag == argsTag4 ? objectTag4 : objTag;
  othTag = othTag == argsTag4 ? objectTag4 : othTag;
  var objIsObj = objTag == objectTag4, othIsObj = othTag == objectTag4, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var baseIsEqualDeep_default = baseIsEqualDeep;

// node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
var baseIsEqual_default = baseIsEqual;

// node_modules/lodash-es/_baseIsMatch.js
var COMPARE_PARTIAL_FLAG5 = 1;
var COMPARE_UNORDERED_FLAG3 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var baseIsMatch_default = baseIsMatch;

// node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
var isStrictComparable_default = isStrictComparable;

// node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  var result = keys_default(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
var getMatchData_default = getMatchData;

// node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var matchesStrictComparable_default = matchesStrictComparable;

// node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  var matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
var baseMatches_default = baseMatches;

// node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var baseHasIn_default = baseHasIn;

// node_modules/lodash-es/_hasPath.js
function hasPath(object, path, hasFunc) {
  path = castPath_default(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var hasPath_default = hasPath;

// node_modules/lodash-es/hasIn.js
function hasIn(object, path) {
  return object != null && hasPath_default(object, path, baseHasIn_default);
}
var hasIn_default = hasIn;

// node_modules/lodash-es/_baseMatchesProperty.js
var COMPARE_PARTIAL_FLAG6 = 1;
var COMPARE_UNORDERED_FLAG4 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey_default(path) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path), srcValue);
  }
  return function(object) {
    var objValue = get_default(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
  };
}
var baseMatchesProperty_default = baseMatchesProperty;

// node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var baseProperty_default = baseProperty;

// node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path) {
  return function(object) {
    return baseGet_default(object, path);
  };
}
var basePropertyDeep_default = basePropertyDeep;

// node_modules/lodash-es/property.js
function property(path) {
  return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
}
var property_default = property;

// node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value == "object") {
    return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
  }
  return property_default(value);
}
var baseIteratee_default = baseIteratee;

// node_modules/lodash-es/_arrayAggregator.js
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}
var arrayAggregator_default = arrayAggregator;

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
var baseForOwn_default = baseForOwn;

// node_modules/lodash-es/_createBaseEach.js
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_default(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var createBaseEach_default = createBaseEach;

// node_modules/lodash-es/_baseEach.js
var baseEach = createBaseEach_default(baseForOwn_default);
var baseEach_default = baseEach;

// node_modules/lodash-es/_baseAggregator.js
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach_default(collection, function(value, key, collection2) {
    setter(accumulator, value, iteratee(value), collection2);
  });
  return accumulator;
}
var baseAggregator_default = baseAggregator;

// node_modules/lodash-es/_createAggregator.js
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_default(collection) ? arrayAggregator_default : baseAggregator_default, accumulator = initializer ? initializer() : {};
    return func(collection, setter, baseIteratee_default(iteratee, 2), accumulator);
  };
}
var createAggregator_default = createAggregator;

// node_modules/lodash-es/defaults.js
var objectProto17 = Object.prototype;
var hasOwnProperty14 = objectProto17.hasOwnProperty;
var defaults = baseRest_default(function(object, sources) {
  object = Object(object);
  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : void 0;
  if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
    length = 1;
  }
  while (++index < length) {
    var source = sources[index];
    var props = keysIn_default(source);
    var propsIndex = -1;
    var propsLength = props.length;
    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];
      if (value === void 0 || eq_default(value, objectProto17[key]) && !hasOwnProperty14.call(object, key)) {
        object[key] = source[key];
      }
    }
  }
  return object;
});
var defaults_default = defaults;

// node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
var isArrayLikeObject_default = isArrayLikeObject;

// node_modules/lodash-es/_arrayIncludesWith.js
function arrayIncludesWith(array, value, comparator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}
var arrayIncludesWith_default = arrayIncludesWith;

// node_modules/lodash-es/_baseDifference.js
var LARGE_ARRAY_SIZE2 = 200;
function baseDifference(array, values2, iteratee, comparator) {
  var index = -1, includes2 = arrayIncludes_default, isCommon = true, length = array.length, result = [], valuesLength = values2.length;
  if (!length) {
    return result;
  }
  if (iteratee) {
    values2 = arrayMap_default(values2, baseUnary_default(iteratee));
  }
  if (comparator) {
    includes2 = arrayIncludesWith_default;
    isCommon = false;
  } else if (values2.length >= LARGE_ARRAY_SIZE2) {
    includes2 = cacheHas_default;
    isCommon = false;
    values2 = new SetCache_default(values2);
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee == null ? value : iteratee(value);
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values2[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes2(values2, computed, comparator)) {
        result.push(value);
      }
    }
  return result;
}
var baseDifference_default = baseDifference;

// node_modules/lodash-es/difference.js
var difference = baseRest_default(function(array, values2) {
  return isArrayLikeObject_default(array) ? baseDifference_default(array, baseFlatten_default(values2, 1, isArrayLikeObject_default, true)) : [];
});
var difference_default = difference;

// node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default = last;

// node_modules/lodash-es/drop.js
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = guard || n === void 0 ? 1 : toInteger_default(n);
  return baseSlice_default(array, n < 0 ? 0 : n, length);
}
var drop_default = drop;

// node_modules/lodash-es/dropRight.js
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = guard || n === void 0 ? 1 : toInteger_default(n);
  n = length - n;
  return baseSlice_default(array, 0, n < 0 ? 0 : n);
}
var dropRight_default = dropRight;

// node_modules/lodash-es/_castFunction.js
function castFunction(value) {
  return typeof value == "function" ? value : identity_default;
}
var castFunction_default = castFunction;

// node_modules/lodash-es/forEach.js
function forEach(collection, iteratee) {
  var func = isArray_default(collection) ? arrayEach_default : baseEach_default;
  return func(collection, castFunction_default(iteratee));
}
var forEach_default = forEach;

// node_modules/lodash-es/_arrayEvery.js
function arrayEvery(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}
var arrayEvery_default = arrayEvery;

// node_modules/lodash-es/_baseEvery.js
function baseEvery(collection, predicate) {
  var result = true;
  baseEach_default(collection, function(value, index, collection2) {
    result = !!predicate(value, index, collection2);
    return result;
  });
  return result;
}
var baseEvery_default = baseEvery;

// node_modules/lodash-es/every.js
function every(collection, predicate, guard) {
  var func = isArray_default(collection) ? arrayEvery_default : baseEvery_default;
  if (guard && isIterateeCall_default(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee_default(predicate, 3));
}
var every_default = every;

// node_modules/lodash-es/_baseFilter.js
function baseFilter(collection, predicate) {
  var result = [];
  baseEach_default(collection, function(value, index, collection2) {
    if (predicate(value, index, collection2)) {
      result.push(value);
    }
  });
  return result;
}
var baseFilter_default = baseFilter;

// node_modules/lodash-es/filter.js
function filter(collection, predicate) {
  var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
  return func(collection, baseIteratee_default(predicate, 3));
}
var filter_default = filter;

// node_modules/lodash-es/_createFind.js
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_default(collection)) {
      var iteratee = baseIteratee_default(predicate, 3);
      collection = keys_default(collection);
      predicate = function(key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
  };
}
var createFind_default = createFind;

// node_modules/lodash-es/findIndex.js
var nativeMax2 = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index < 0) {
    index = nativeMax2(length + index, 0);
  }
  return baseFindIndex_default(array, baseIteratee_default(predicate, 3), index);
}
var findIndex_default = findIndex;

// node_modules/lodash-es/find.js
var find = createFind_default(findIndex_default);
var find_default = find;

// node_modules/lodash-es/head.js
function head(array) {
  return array && array.length ? array[0] : void 0;
}
var head_default = head;

// node_modules/lodash-es/_baseMap.js
function baseMap(collection, iteratee) {
  var index = -1, result = isArrayLike_default(collection) ? Array(collection.length) : [];
  baseEach_default(collection, function(value, key, collection2) {
    result[++index] = iteratee(value, key, collection2);
  });
  return result;
}
var baseMap_default = baseMap;

// node_modules/lodash-es/map.js
function map(collection, iteratee) {
  var func = isArray_default(collection) ? arrayMap_default : baseMap_default;
  return func(collection, baseIteratee_default(iteratee, 3));
}
var map_default = map;

// node_modules/lodash-es/flatMap.js
function flatMap(collection, iteratee) {
  return baseFlatten_default(map_default(collection, iteratee), 1);
}
var flatMap_default = flatMap;

// node_modules/lodash-es/groupBy.js
var objectProto18 = Object.prototype;
var hasOwnProperty15 = objectProto18.hasOwnProperty;
var groupBy = createAggregator_default(function(result, value, key) {
  if (hasOwnProperty15.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue_default(result, key, [value]);
  }
});
var groupBy_default = groupBy;

// node_modules/lodash-es/_baseHas.js
var objectProto19 = Object.prototype;
var hasOwnProperty16 = objectProto19.hasOwnProperty;
function baseHas(object, key) {
  return object != null && hasOwnProperty16.call(object, key);
}
var baseHas_default = baseHas;

// node_modules/lodash-es/has.js
function has(object, path) {
  return object != null && hasPath_default(object, path, baseHas_default);
}
var has_default = has;

// node_modules/lodash-es/isString.js
var stringTag5 = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray_default(value) && isObjectLike_default(value) && baseGetTag_default(value) == stringTag5;
}
var isString_default = isString;

// node_modules/lodash-es/_baseValues.js
function baseValues(object, props) {
  return arrayMap_default(props, function(key) {
    return object[key];
  });
}
var baseValues_default = baseValues;

// node_modules/lodash-es/values.js
function values(object) {
  return object == null ? [] : baseValues_default(object, keys_default(object));
}
var values_default = values;

// node_modules/lodash-es/includes.js
var nativeMax3 = Math.max;
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike_default(collection) ? collection : values_default(collection);
  fromIndex = fromIndex && !guard ? toInteger_default(fromIndex) : 0;
  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax3(length + fromIndex, 0);
  }
  return isString_default(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf_default(collection, value, fromIndex) > -1;
}
var includes_default = includes;

// node_modules/lodash-es/indexOf.js
var nativeMax4 = Math.max;
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index < 0) {
    index = nativeMax4(length + index, 0);
  }
  return baseIndexOf_default(array, value, index);
}
var indexOf_default = indexOf;

// node_modules/lodash-es/isEmpty.js
var mapTag7 = "[object Map]";
var setTag7 = "[object Set]";
var objectProto20 = Object.prototype;
var hasOwnProperty17 = objectProto20.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
    return !value.length;
  }
  var tag = getTag_default(value);
  if (tag == mapTag7 || tag == setTag7) {
    return !value.size;
  }
  if (isPrototype_default(value)) {
    return !baseKeys_default(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty17.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_default = isEmpty;

// node_modules/lodash-es/_baseIsRegExp.js
var regexpTag5 = "[object RegExp]";
function baseIsRegExp(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == regexpTag5;
}
var baseIsRegExp_default = baseIsRegExp;

// node_modules/lodash-es/isRegExp.js
var nodeIsRegExp = nodeUtil_default && nodeUtil_default.isRegExp;
var isRegExp = nodeIsRegExp ? baseUnary_default(nodeIsRegExp) : baseIsRegExp_default;
var isRegExp_default = isRegExp;

// node_modules/lodash-es/isUndefined.js
function isUndefined(value) {
  return value === void 0;
}
var isUndefined_default = isUndefined;

// node_modules/lodash-es/negate.js
var FUNC_ERROR_TEXT2 = "Expected a function";
function negate(predicate) {
  if (typeof predicate != "function") {
    throw new TypeError(FUNC_ERROR_TEXT2);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0:
        return !predicate.call(this);
      case 1:
        return !predicate.call(this, args[0]);
      case 2:
        return !predicate.call(this, args[0], args[1]);
      case 3:
        return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}
var negate_default = negate;

// node_modules/lodash-es/_baseSet.js
function baseSet(object, path, value, customizer) {
  if (!isObject_default(object)) {
    return object;
  }
  path = castPath_default(path, object);
  var index = -1, length = path.length, lastIndex = length - 1, nested = object;
  while (nested != null && ++index < length) {
    var key = toKey_default(path[index]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_default(objValue) ? objValue : isIndex_default(path[index + 1]) ? [] : {};
      }
    }
    assignValue_default(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var baseSet_default = baseSet;

// node_modules/lodash-es/_basePickBy.js
function basePickBy(object, paths, predicate) {
  var index = -1, length = paths.length, result = {};
  while (++index < length) {
    var path = paths[index], value = baseGet_default(object, path);
    if (predicate(value, path)) {
      baseSet_default(result, castPath_default(path, object), value);
    }
  }
  return result;
}
var basePickBy_default = basePickBy;

// node_modules/lodash-es/pickBy.js
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap_default(getAllKeysIn_default(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee_default(predicate);
  return basePickBy_default(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}
var pickBy_default = pickBy;

// node_modules/lodash-es/_baseReduce.js
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection2) {
    accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
  });
  return accumulator;
}
var baseReduce_default = baseReduce;

// node_modules/lodash-es/reduce.js
function reduce(collection, iteratee, accumulator) {
  var func = isArray_default(collection) ? arrayReduce_default : baseReduce_default, initAccum = arguments.length < 3;
  return func(collection, baseIteratee_default(iteratee, 4), accumulator, initAccum, baseEach_default);
}
var reduce_default = reduce;

// node_modules/lodash-es/reject.js
function reject(collection, predicate) {
  var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
  return func(collection, negate_default(baseIteratee_default(predicate, 3)));
}
var reject_default = reject;

// node_modules/lodash-es/_baseSome.js
function baseSome(collection, predicate) {
  var result;
  baseEach_default(collection, function(value, index, collection2) {
    result = predicate(value, index, collection2);
    return !result;
  });
  return !!result;
}
var baseSome_default = baseSome;

// node_modules/lodash-es/some.js
function some(collection, predicate, guard) {
  var func = isArray_default(collection) ? arraySome_default : baseSome_default;
  if (guard && isIterateeCall_default(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee_default(predicate, 3));
}
var some_default = some;

// node_modules/lodash-es/_createSet.js
var INFINITY4 = 1 / 0;
var createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY4) ? noop_default : function(values2) {
  return new Set_default(values2);
};
var createSet_default = createSet;

// node_modules/lodash-es/_baseUniq.js
var LARGE_ARRAY_SIZE3 = 200;
function baseUniq(array, iteratee, comparator) {
  var index = -1, includes2 = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
  if (comparator) {
    isCommon = false;
    includes2 = arrayIncludesWith_default;
  } else if (length >= LARGE_ARRAY_SIZE3) {
    var set = iteratee ? null : createSet_default(array);
    if (set) {
      return setToArray_default(set);
    }
    isCommon = false;
    includes2 = cacheHas_default;
    seen = new SetCache_default();
  } else {
    seen = iteratee ? [] : result;
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      } else if (!includes2(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var baseUniq_default = baseUniq;

// node_modules/lodash-es/uniq.js
function uniq(array) {
  return array && array.length ? baseUniq_default(array) : [];
}
var uniq_default = uniq;

// node_modules/@chevrotain/utils/lib/src/print.js
function PRINT_ERROR(msg) {
  if (console && console.error) {
    console.error(`Error: ${msg}`);
  }
}
function PRINT_WARNING(msg) {
  if (console && console.warn) {
    console.warn(`Warning: ${msg}`);
  }
}

// node_modules/@chevrotain/utils/lib/src/timer.js
function timer(func) {
  const start = (/* @__PURE__ */ new Date()).getTime();
  const val = func();
  const end = (/* @__PURE__ */ new Date()).getTime();
  const total = end - start;
  return { time: total, value: val };
}

// node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
function toFastProperties(toBecomeFast) {
  function FakeConstructor() {
  }
  FakeConstructor.prototype = toBecomeFast;
  const fakeInstance = new FakeConstructor();
  function fakeAccess() {
    return typeof fakeInstance.bar;
  }
  fakeAccess();
  fakeAccess();
  if (1)
    return toBecomeFast;
  (0, eval)(toBecomeFast);
}

// node_modules/@chevrotain/gast/lib/src/model.js
function tokenLabel(tokType) {
  if (hasTokenLabel(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
function hasTokenLabel(obj) {
  return isString_default(obj.LABEL) && obj.LABEL !== "";
}
var AbstractProduction = class {
  get definition() {
    return this._definition;
  }
  set definition(value) {
    this._definition = value;
  }
  constructor(_definition) {
    this._definition = _definition;
  }
  accept(visitor) {
    visitor.visit(this);
    forEach_default(this.definition, (prod) => {
      prod.accept(visitor);
    });
  }
};
var NonTerminal = class extends AbstractProduction {
  constructor(options) {
    super([]);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
  set definition(definition) {
  }
  get definition() {
    if (this.referencedRule !== void 0) {
      return this.referencedRule.definition;
    }
    return [];
  }
  accept(visitor) {
    visitor.visit(this);
  }
};
var Rule = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.orgText = "";
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var Alternative = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.ignoreAmbiguities = false;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var Option = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var RepetitionMandatory = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var RepetitionMandatoryWithSeparator = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var Repetition = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var RepetitionWithSeparator = class extends AbstractProduction {
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var Alternation = class extends AbstractProduction {
  get definition() {
    return this._definition;
  }
  set definition(value) {
    this._definition = value;
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    this.ignoreAmbiguities = false;
    this.hasPredicates = false;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
};
var Terminal = class {
  constructor(options) {
    this.idx = 1;
    assign_default(this, pickBy_default(options, (v) => v !== void 0));
  }
  accept(visitor) {
    visitor.visit(this);
  }
};
function serializeGrammar(topRules) {
  return map_default(topRules, serializeProduction);
}
function serializeProduction(node) {
  function convertDefinition(definition) {
    return map_default(definition, serializeProduction);
  }
  if (node instanceof NonTerminal) {
    const serializedNonTerminal = {
      type: "NonTerminal",
      name: node.nonTerminalName,
      idx: node.idx
    };
    if (isString_default(node.label)) {
      serializedNonTerminal.label = node.label;
    }
    return serializedNonTerminal;
  } else if (node instanceof Alternative) {
    return {
      type: "Alternative",
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Option) {
    return {
      type: "Option",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatory) {
    return {
      type: "RepetitionMandatory",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatoryWithSeparator) {
    return {
      type: "RepetitionMandatoryWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionWithSeparator) {
    return {
      type: "RepetitionWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Repetition) {
    return {
      type: "Repetition",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Alternation) {
    return {
      type: "Alternation",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Terminal) {
    const serializedTerminal = {
      type: "Terminal",
      name: node.terminalType.name,
      label: tokenLabel(node.terminalType),
      idx: node.idx
    };
    if (isString_default(node.label)) {
      serializedTerminal.terminalLabel = node.label;
    }
    const pattern = node.terminalType.PATTERN;
    if (node.terminalType.PATTERN) {
      serializedTerminal.pattern = isRegExp_default(pattern) ? pattern.source : pattern;
    }
    return serializedTerminal;
  } else if (node instanceof Rule) {
    return {
      type: "Rule",
      name: node.name,
      orgText: node.orgText,
      definition: convertDefinition(node.definition)
    };
  } else {
    throw Error("non exhaustive match");
  }
}

// node_modules/@chevrotain/gast/lib/src/visitor.js
var GAstVisitor = class {
  visit(node) {
    const nodeAny = node;
    switch (nodeAny.constructor) {
      case NonTerminal:
        return this.visitNonTerminal(nodeAny);
      case Alternative:
        return this.visitAlternative(nodeAny);
      case Option:
        return this.visitOption(nodeAny);
      case RepetitionMandatory:
        return this.visitRepetitionMandatory(nodeAny);
      case RepetitionMandatoryWithSeparator:
        return this.visitRepetitionMandatoryWithSeparator(nodeAny);
      case RepetitionWithSeparator:
        return this.visitRepetitionWithSeparator(nodeAny);
      case Repetition:
        return this.visitRepetition(nodeAny);
      case Alternation:
        return this.visitAlternation(nodeAny);
      case Terminal:
        return this.visitTerminal(nodeAny);
      case Rule:
        return this.visitRule(nodeAny);
      default:
        throw Error("non exhaustive match");
    }
  }
  /* c8 ignore next */
  visitNonTerminal(node) {
  }
  /* c8 ignore next */
  visitAlternative(node) {
  }
  /* c8 ignore next */
  visitOption(node) {
  }
  /* c8 ignore next */
  visitRepetition(node) {
  }
  /* c8 ignore next */
  visitRepetitionMandatory(node) {
  }
  /* c8 ignore next 3 */
  visitRepetitionMandatoryWithSeparator(node) {
  }
  /* c8 ignore next */
  visitRepetitionWithSeparator(node) {
  }
  /* c8 ignore next */
  visitAlternation(node) {
  }
  /* c8 ignore next */
  visitTerminal(node) {
  }
  /* c8 ignore next */
  visitRule(node) {
  }
};

// node_modules/@chevrotain/gast/lib/src/helpers.js
function isSequenceProd(prod) {
  return prod instanceof Alternative || prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
}
function isOptionalProd(prod, alreadyVisited = []) {
  const isDirectlyOptional = prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionWithSeparator;
  if (isDirectlyOptional) {
    return true;
  }
  if (prod instanceof Alternation) {
    return some_default(prod.definition, (subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else if (prod instanceof NonTerminal && includes_default(alreadyVisited, prod)) {
    return false;
  } else if (prod instanceof AbstractProduction) {
    if (prod instanceof NonTerminal) {
      alreadyVisited.push(prod);
    }
    return every_default(prod.definition, (subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else {
    return false;
  }
}
function isBranchingProd(prod) {
  return prod instanceof Alternation;
}
function getProductionDslName(prod) {
  if (prod instanceof NonTerminal) {
    return "SUBRULE";
  } else if (prod instanceof Option) {
    return "OPTION";
  } else if (prod instanceof Alternation) {
    return "OR";
  } else if (prod instanceof RepetitionMandatory) {
    return "AT_LEAST_ONE";
  } else if (prod instanceof RepetitionMandatoryWithSeparator) {
    return "AT_LEAST_ONE_SEP";
  } else if (prod instanceof RepetitionWithSeparator) {
    return "MANY_SEP";
  } else if (prod instanceof Repetition) {
    return "MANY";
  } else if (prod instanceof Terminal) {
    return "CONSUME";
  } else {
    throw Error("non exhaustive match");
  }
}

// node_modules/chevrotain/lib/src/parse/grammar/rest.js
var RestWalker = class {
  walk(prod, prevRest = []) {
    forEach_default(prod.definition, (subProd, index) => {
      const currRest = drop_default(prod.definition, index + 1);
      if (subProd instanceof NonTerminal) {
        this.walkProdRef(subProd, currRest, prevRest);
      } else if (subProd instanceof Terminal) {
        this.walkTerminal(subProd, currRest, prevRest);
      } else if (subProd instanceof Alternative) {
        this.walkFlat(subProd, currRest, prevRest);
      } else if (subProd instanceof Option) {
        this.walkOption(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionMandatory) {
        this.walkAtLeastOne(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionMandatoryWithSeparator) {
        this.walkAtLeastOneSep(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionWithSeparator) {
        this.walkManySep(subProd, currRest, prevRest);
      } else if (subProd instanceof Repetition) {
        this.walkMany(subProd, currRest, prevRest);
      } else if (subProd instanceof Alternation) {
        this.walkOr(subProd, currRest, prevRest);
      } else {
        throw Error("non exhaustive match");
      }
    });
  }
  walkTerminal(terminal, currRest, prevRest) {
  }
  walkProdRef(refProd, currRest, prevRest) {
  }
  walkFlat(flatProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    this.walk(flatProd, fullOrRest);
  }
  walkOption(optionProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    this.walk(optionProd, fullOrRest);
  }
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    const fullAtLeastOneRest = [
      new Option({ definition: atLeastOneProd.definition })
    ].concat(currRest, prevRest);
    this.walk(atLeastOneProd, fullAtLeastOneRest);
  }
  walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
    const fullAtLeastOneSepRest = restForRepetitionWithSeparator(atLeastOneSepProd, currRest, prevRest);
    this.walk(atLeastOneSepProd, fullAtLeastOneSepRest);
  }
  walkMany(manyProd, currRest, prevRest) {
    const fullManyRest = [
      new Option({ definition: manyProd.definition })
    ].concat(currRest, prevRest);
    this.walk(manyProd, fullManyRest);
  }
  walkManySep(manySepProd, currRest, prevRest) {
    const fullManySepRest = restForRepetitionWithSeparator(manySepProd, currRest, prevRest);
    this.walk(manySepProd, fullManySepRest);
  }
  walkOr(orProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    forEach_default(orProd.definition, (alt) => {
      const prodWrapper = new Alternative({ definition: [alt] });
      this.walk(prodWrapper, fullOrRest);
    });
  }
};
function restForRepetitionWithSeparator(repSepProd, currRest, prevRest) {
  const repSepRest = [
    new Option({
      definition: [
        new Terminal({ terminalType: repSepProd.separator })
      ].concat(repSepProd.definition)
    })
  ];
  const fullRepSepRest = repSepRest.concat(currRest, prevRest);
  return fullRepSepRest;
}

// node_modules/chevrotain/lib/src/parse/grammar/first.js
function first(prod) {
  if (prod instanceof NonTerminal) {
    return first(prod.referencedRule);
  } else if (prod instanceof Terminal) {
    return firstForTerminal(prod);
  } else if (isSequenceProd(prod)) {
    return firstForSequence(prod);
  } else if (isBranchingProd(prod)) {
    return firstForBranching(prod);
  } else {
    throw Error("non exhaustive match");
  }
}
function firstForSequence(prod) {
  let firstSet = [];
  const seq = prod.definition;
  let nextSubProdIdx = 0;
  let hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  let currSubProd;
  let isLastInnerProdOptional = true;
  while (hasInnerProdsRemaining && isLastInnerProdOptional) {
    currSubProd = seq[nextSubProdIdx];
    isLastInnerProdOptional = isOptionalProd(currSubProd);
    firstSet = firstSet.concat(first(currSubProd));
    nextSubProdIdx = nextSubProdIdx + 1;
    hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  }
  return uniq_default(firstSet);
}
function firstForBranching(prod) {
  const allAlternativesFirsts = map_default(prod.definition, (innerProd) => {
    return first(innerProd);
  });
  return uniq_default(flatten_default(allAlternativesFirsts));
}
function firstForTerminal(terminal) {
  return [terminal.terminalType];
}

// node_modules/chevrotain/lib/src/parse/constants.js
var IN = "_~IN~_";

// node_modules/chevrotain/lib/src/parse/grammar/follow.js
var ResyncFollowsWalker = class extends RestWalker {
  constructor(topProd) {
    super();
    this.topProd = topProd;
    this.follows = {};
  }
  startWalking() {
    this.walk(this.topProd);
    return this.follows;
  }
  walkTerminal(terminal, currRest, prevRest) {
  }
  walkProdRef(refProd, currRest, prevRest) {
    const followName = buildBetweenProdsFollowPrefix(refProd.referencedRule, refProd.idx) + this.topProd.name;
    const fullRest = currRest.concat(prevRest);
    const restProd = new Alternative({ definition: fullRest });
    const t_in_topProd_follows = first(restProd);
    this.follows[followName] = t_in_topProd_follows;
  }
};
function computeAllProdsFollows(topProductions) {
  const reSyncFollows = {};
  forEach_default(topProductions, (topProd) => {
    const currRefsFollow = new ResyncFollowsWalker(topProd).startWalking();
    assign_default(reSyncFollows, currRefsFollow);
  });
  return reSyncFollows;
}
function buildBetweenProdsFollowPrefix(inner, occurenceInParent) {
  return inner.name + occurenceInParent + IN;
}

// node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
function cc(char) {
  return char.charCodeAt(0);
}
function insertToSet(item, set) {
  if (Array.isArray(item)) {
    item.forEach(function(subItem) {
      set.push(subItem);
    });
  } else {
    set.push(item);
  }
}
function addFlag(flagObj, flagKey) {
  if (flagObj[flagKey] === true) {
    throw "duplicate flag " + flagKey;
  }
  const x = flagObj[flagKey];
  flagObj[flagKey] = true;
}
function ASSERT_EXISTS(obj) {
  if (obj === void 0) {
    throw Error("Internal Error - Should never get here!");
  }
  return true;
}
function ASSERT_NEVER_REACH_HERE() {
  throw Error("Internal Error - Should never get here!");
}
function isCharacter(obj) {
  return obj["type"] === "Character";
}

// node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
var digitsCharCodes = [];
for (let i = cc("0"); i <= cc("9"); i++) {
  digitsCharCodes.push(i);
}
var wordCharCodes = [cc("_")].concat(digitsCharCodes);
for (let i = cc("a"); i <= cc("z"); i++) {
  wordCharCodes.push(i);
}
for (let i = cc("A"); i <= cc("Z"); i++) {
  wordCharCodes.push(i);
}
var whitespaceCodes = [
  cc(" "),
  cc("\f"),
  cc("\n"),
  cc("\r"),
  cc("	"),
  cc("\v"),
  cc("	"),
  cc("\xA0"),
  cc("\u1680"),
  cc("\u2000"),
  cc("\u2001"),
  cc("\u2002"),
  cc("\u2003"),
  cc("\u2004"),
  cc("\u2005"),
  cc("\u2006"),
  cc("\u2007"),
  cc("\u2008"),
  cc("\u2009"),
  cc("\u200A"),
  cc("\u2028"),
  cc("\u2029"),
  cc("\u202F"),
  cc("\u205F"),
  cc("\u3000"),
  cc("\uFEFF")
];

// node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
var hexDigitPattern = /[0-9a-fA-F]/;
var decimalPattern = /[0-9]/;
var decimalPatternNoZero = /[1-9]/;
var RegExpParser = class {
  constructor() {
    this.idx = 0;
    this.input = "";
    this.groupIdx = 0;
  }
  saveState() {
    return {
      idx: this.idx,
      input: this.input,
      groupIdx: this.groupIdx
    };
  }
  restoreState(newState) {
    this.idx = newState.idx;
    this.input = newState.input;
    this.groupIdx = newState.groupIdx;
  }
  pattern(input) {
    this.idx = 0;
    this.input = input;
    this.groupIdx = 0;
    this.consumeChar("/");
    const value = this.disjunction();
    this.consumeChar("/");
    const flags = {
      type: "Flags",
      loc: { begin: this.idx, end: input.length },
      global: false,
      ignoreCase: false,
      multiLine: false,
      unicode: false,
      sticky: false
    };
    while (this.isRegExpFlag()) {
      switch (this.popChar()) {
        case "g":
          addFlag(flags, "global");
          break;
        case "i":
          addFlag(flags, "ignoreCase");
          break;
        case "m":
          addFlag(flags, "multiLine");
          break;
        case "u":
          addFlag(flags, "unicode");
          break;
        case "y":
          addFlag(flags, "sticky");
          break;
      }
    }
    if (this.idx !== this.input.length) {
      throw Error("Redundant input: " + this.input.substring(this.idx));
    }
    return {
      type: "Pattern",
      flags,
      value,
      loc: this.loc(0)
    };
  }
  disjunction() {
    const alts = [];
    const begin = this.idx;
    alts.push(this.alternative());
    while (this.peekChar() === "|") {
      this.consumeChar("|");
      alts.push(this.alternative());
    }
    return { type: "Disjunction", value: alts, loc: this.loc(begin) };
  }
  alternative() {
    const terms = [];
    const begin = this.idx;
    while (this.isTerm()) {
      terms.push(this.term());
    }
    return { type: "Alternative", value: terms, loc: this.loc(begin) };
  }
  term() {
    if (this.isAssertion()) {
      return this.assertion();
    } else {
      return this.atom();
    }
  }
  assertion() {
    const begin = this.idx;
    switch (this.popChar()) {
      case "^":
        return {
          type: "StartAnchor",
          loc: this.loc(begin)
        };
      case "$":
        return { type: "EndAnchor", loc: this.loc(begin) };
      case "\\":
        switch (this.popChar()) {
          case "b":
            return {
              type: "WordBoundary",
              loc: this.loc(begin)
            };
          case "B":
            return {
              type: "NonWordBoundary",
              loc: this.loc(begin)
            };
        }
        throw Error("Invalid Assertion Escape");
      case "(":
        this.consumeChar("?");
        let type;
        switch (this.popChar()) {
          case "=":
            type = "Lookahead";
            break;
          case "!":
            type = "NegativeLookahead";
            break;
        }
        ASSERT_EXISTS(type);
        const disjunction = this.disjunction();
        this.consumeChar(")");
        return {
          type,
          value: disjunction,
          loc: this.loc(begin)
        };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  quantifier(isBacktracking = false) {
    let range = void 0;
    const begin = this.idx;
    switch (this.popChar()) {
      case "*":
        range = {
          atLeast: 0,
          atMost: Infinity
        };
        break;
      case "+":
        range = {
          atLeast: 1,
          atMost: Infinity
        };
        break;
      case "?":
        range = {
          atLeast: 0,
          atMost: 1
        };
        break;
      case "{":
        const atLeast = this.integerIncludingZero();
        switch (this.popChar()) {
          case "}":
            range = {
              atLeast,
              atMost: atLeast
            };
            break;
          case ",":
            let atMost;
            if (this.isDigit()) {
              atMost = this.integerIncludingZero();
              range = {
                atLeast,
                atMost
              };
            } else {
              range = {
                atLeast,
                atMost: Infinity
              };
            }
            this.consumeChar("}");
            break;
        }
        if (isBacktracking === true && range === void 0) {
          return void 0;
        }
        ASSERT_EXISTS(range);
        break;
    }
    if (isBacktracking === true && range === void 0) {
      return void 0;
    }
    if (ASSERT_EXISTS(range)) {
      if (this.peekChar(0) === "?") {
        this.consumeChar("?");
        range.greedy = false;
      } else {
        range.greedy = true;
      }
      range.type = "Quantifier";
      range.loc = this.loc(begin);
      return range;
    }
  }
  atom() {
    let atom;
    const begin = this.idx;
    switch (this.peekChar()) {
      case ".":
        atom = this.dotAll();
        break;
      case "\\":
        atom = this.atomEscape();
        break;
      case "[":
        atom = this.characterClass();
        break;
      case "(":
        atom = this.group();
        break;
    }
    if (atom === void 0 && this.isPatternCharacter()) {
      atom = this.patternCharacter();
    }
    if (ASSERT_EXISTS(atom)) {
      atom.loc = this.loc(begin);
      if (this.isQuantifier()) {
        atom.quantifier = this.quantifier();
      }
      return atom;
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  dotAll() {
    this.consumeChar(".");
    return {
      type: "Set",
      complement: true,
      value: [cc("\n"), cc("\r"), cc("\u2028"), cc("\u2029")]
    };
  }
  atomEscape() {
    this.consumeChar("\\");
    switch (this.peekChar()) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return this.decimalEscapeAtom();
      case "d":
      case "D":
      case "s":
      case "S":
      case "w":
      case "W":
        return this.characterClassEscape();
      case "f":
      case "n":
      case "r":
      case "t":
      case "v":
        return this.controlEscapeAtom();
      case "c":
        return this.controlLetterEscapeAtom();
      case "0":
        return this.nulCharacterAtom();
      case "x":
        return this.hexEscapeSequenceAtom();
      case "u":
        return this.regExpUnicodeEscapeSequenceAtom();
      default:
        return this.identityEscapeAtom();
    }
  }
  decimalEscapeAtom() {
    const value = this.positiveInteger();
    return { type: "GroupBackReference", value };
  }
  characterClassEscape() {
    let set;
    let complement = false;
    switch (this.popChar()) {
      case "d":
        set = digitsCharCodes;
        break;
      case "D":
        set = digitsCharCodes;
        complement = true;
        break;
      case "s":
        set = whitespaceCodes;
        break;
      case "S":
        set = whitespaceCodes;
        complement = true;
        break;
      case "w":
        set = wordCharCodes;
        break;
      case "W":
        set = wordCharCodes;
        complement = true;
        break;
    }
    if (ASSERT_EXISTS(set)) {
      return { type: "Set", value: set, complement };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  controlEscapeAtom() {
    let escapeCode;
    switch (this.popChar()) {
      case "f":
        escapeCode = cc("\f");
        break;
      case "n":
        escapeCode = cc("\n");
        break;
      case "r":
        escapeCode = cc("\r");
        break;
      case "t":
        escapeCode = cc("	");
        break;
      case "v":
        escapeCode = cc("\v");
        break;
    }
    if (ASSERT_EXISTS(escapeCode)) {
      return { type: "Character", value: escapeCode };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  controlLetterEscapeAtom() {
    this.consumeChar("c");
    const letter = this.popChar();
    if (/[a-zA-Z]/.test(letter) === false) {
      throw Error("Invalid ");
    }
    const letterCode = letter.toUpperCase().charCodeAt(0) - 64;
    return { type: "Character", value: letterCode };
  }
  nulCharacterAtom() {
    this.consumeChar("0");
    return { type: "Character", value: cc("\0") };
  }
  hexEscapeSequenceAtom() {
    this.consumeChar("x");
    return this.parseHexDigits(2);
  }
  regExpUnicodeEscapeSequenceAtom() {
    this.consumeChar("u");
    return this.parseHexDigits(4);
  }
  identityEscapeAtom() {
    const escapedChar = this.popChar();
    return { type: "Character", value: cc(escapedChar) };
  }
  classPatternCharacterAtom() {
    switch (this.peekChar()) {
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
      case "\\":
      case "]":
        throw Error("TBD");
      default:
        const nextChar = this.popChar();
        return { type: "Character", value: cc(nextChar) };
    }
  }
  characterClass() {
    const set = [];
    let complement = false;
    this.consumeChar("[");
    if (this.peekChar(0) === "^") {
      this.consumeChar("^");
      complement = true;
    }
    while (this.isClassAtom()) {
      const from = this.classAtom();
      const isFromSingleChar = from.type === "Character";
      if (isCharacter(from) && this.isRangeDash()) {
        this.consumeChar("-");
        const to = this.classAtom();
        const isToSingleChar = to.type === "Character";
        if (isCharacter(to)) {
          if (to.value < from.value) {
            throw Error("Range out of order in character class");
          }
          set.push({ from: from.value, to: to.value });
        } else {
          insertToSet(from.value, set);
          set.push(cc("-"));
          insertToSet(to.value, set);
        }
      } else {
        insertToSet(from.value, set);
      }
    }
    this.consumeChar("]");
    return { type: "Set", complement, value: set };
  }
  classAtom() {
    switch (this.peekChar()) {
      case "]":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        throw Error("TBD");
      case "\\":
        return this.classEscape();
      default:
        return this.classPatternCharacterAtom();
    }
  }
  classEscape() {
    this.consumeChar("\\");
    switch (this.peekChar()) {
      case "b":
        this.consumeChar("b");
        return { type: "Character", value: cc("\b") };
      case "d":
      case "D":
      case "s":
      case "S":
      case "w":
      case "W":
        return this.characterClassEscape();
      case "f":
      case "n":
      case "r":
      case "t":
      case "v":
        return this.controlEscapeAtom();
      case "c":
        return this.controlLetterEscapeAtom();
      case "0":
        return this.nulCharacterAtom();
      case "x":
        return this.hexEscapeSequenceAtom();
      case "u":
        return this.regExpUnicodeEscapeSequenceAtom();
      default:
        return this.identityEscapeAtom();
    }
  }
  group() {
    let capturing = true;
    this.consumeChar("(");
    switch (this.peekChar(0)) {
      case "?":
        this.consumeChar("?");
        this.consumeChar(":");
        capturing = false;
        break;
      default:
        this.groupIdx++;
        break;
    }
    const value = this.disjunction();
    this.consumeChar(")");
    const groupAst = {
      type: "Group",
      capturing,
      value
    };
    if (capturing) {
      groupAst["idx"] = this.groupIdx;
    }
    return groupAst;
  }
  positiveInteger() {
    let number = this.popChar();
    if (decimalPatternNoZero.test(number) === false) {
      throw Error("Expecting a positive integer");
    }
    while (decimalPattern.test(this.peekChar(0))) {
      number += this.popChar();
    }
    return parseInt(number, 10);
  }
  integerIncludingZero() {
    let number = this.popChar();
    if (decimalPattern.test(number) === false) {
      throw Error("Expecting an integer");
    }
    while (decimalPattern.test(this.peekChar(0))) {
      number += this.popChar();
    }
    return parseInt(number, 10);
  }
  patternCharacter() {
    const nextChar = this.popChar();
    switch (nextChar) {
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
      case "^":
      case "$":
      case "\\":
      case ".":
      case "*":
      case "+":
      case "?":
      case "(":
      case ")":
      case "[":
      case "|":
        throw Error("TBD");
      default:
        return { type: "Character", value: cc(nextChar) };
    }
  }
  isRegExpFlag() {
    switch (this.peekChar(0)) {
      case "g":
      case "i":
      case "m":
      case "u":
      case "y":
        return true;
      default:
        return false;
    }
  }
  isRangeDash() {
    return this.peekChar() === "-" && this.isClassAtom(1);
  }
  isDigit() {
    return decimalPattern.test(this.peekChar(0));
  }
  isClassAtom(howMuch = 0) {
    switch (this.peekChar(howMuch)) {
      case "]":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        return false;
      default:
        return true;
    }
  }
  isTerm() {
    return this.isAtom() || this.isAssertion();
  }
  isAtom() {
    if (this.isPatternCharacter()) {
      return true;
    }
    switch (this.peekChar(0)) {
      case ".":
      case "\\":
      case "[":
      case "(":
        return true;
      default:
        return false;
    }
  }
  isAssertion() {
    switch (this.peekChar(0)) {
      case "^":
      case "$":
        return true;
      case "\\":
        switch (this.peekChar(1)) {
          case "b":
          case "B":
            return true;
          default:
            return false;
        }
      case "(":
        return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!");
      default:
        return false;
    }
  }
  isQuantifier() {
    const prevState = this.saveState();
    try {
      return this.quantifier(true) !== void 0;
    } catch (e) {
      return false;
    } finally {
      this.restoreState(prevState);
    }
  }
  isPatternCharacter() {
    switch (this.peekChar()) {
      case "^":
      case "$":
      case "\\":
      case ".":
      case "*":
      case "+":
      case "?":
      case "(":
      case ")":
      case "[":
      case "|":
      case "/":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        return false;
      default:
        return true;
    }
  }
  parseHexDigits(howMany) {
    let hexString = "";
    for (let i = 0; i < howMany; i++) {
      const hexChar = this.popChar();
      if (hexDigitPattern.test(hexChar) === false) {
        throw Error("Expecting a HexDecimal digits");
      }
      hexString += hexChar;
    }
    const charCode = parseInt(hexString, 16);
    return { type: "Character", value: charCode };
  }
  peekChar(howMuch = 0) {
    return this.input[this.idx + howMuch];
  }
  popChar() {
    const nextChar = this.peekChar(0);
    this.consumeChar(void 0);
    return nextChar;
  }
  consumeChar(char) {
    if (char !== void 0 && this.input[this.idx] !== char) {
      throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
    }
    if (this.idx >= this.input.length) {
      throw Error("Unexpected end of input");
    }
    this.idx++;
  }
  loc(begin) {
    return { begin, end: this.idx };
  }
};

// node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
var BaseRegExpVisitor = class {
  visitChildren(node) {
    for (const key in node) {
      const child = node[key];
      if (node.hasOwnProperty(key)) {
        if (child.type !== void 0) {
          this.visit(child);
        } else if (Array.isArray(child)) {
          child.forEach((subChild) => {
            this.visit(subChild);
          }, this);
        }
      }
    }
  }
  visit(node) {
    switch (node.type) {
      case "Pattern":
        this.visitPattern(node);
        break;
      case "Flags":
        this.visitFlags(node);
        break;
      case "Disjunction":
        this.visitDisjunction(node);
        break;
      case "Alternative":
        this.visitAlternative(node);
        break;
      case "StartAnchor":
        this.visitStartAnchor(node);
        break;
      case "EndAnchor":
        this.visitEndAnchor(node);
        break;
      case "WordBoundary":
        this.visitWordBoundary(node);
        break;
      case "NonWordBoundary":
        this.visitNonWordBoundary(node);
        break;
      case "Lookahead":
        this.visitLookahead(node);
        break;
      case "NegativeLookahead":
        this.visitNegativeLookahead(node);
        break;
      case "Character":
        this.visitCharacter(node);
        break;
      case "Set":
        this.visitSet(node);
        break;
      case "Group":
        this.visitGroup(node);
        break;
      case "GroupBackReference":
        this.visitGroupBackReference(node);
        break;
      case "Quantifier":
        this.visitQuantifier(node);
        break;
    }
    this.visitChildren(node);
  }
  visitPattern(node) {
  }
  visitFlags(node) {
  }
  visitDisjunction(node) {
  }
  visitAlternative(node) {
  }
  // Assertion
  visitStartAnchor(node) {
  }
  visitEndAnchor(node) {
  }
  visitWordBoundary(node) {
  }
  visitNonWordBoundary(node) {
  }
  visitLookahead(node) {
  }
  visitNegativeLookahead(node) {
  }
  // atoms
  visitCharacter(node) {
  }
  visitSet(node) {
  }
  visitGroup(node) {
  }
  visitGroupBackReference(node) {
  }
  visitQuantifier(node) {
  }
};

// node_modules/chevrotain/lib/src/scan/reg_exp_parser.js
var regExpAstCache = {};
var regExpParser = new RegExpParser();
function getRegExpAst(regExp) {
  const regExpStr = regExp.toString();
  if (regExpAstCache.hasOwnProperty(regExpStr)) {
    return regExpAstCache[regExpStr];
  } else {
    const regExpAst = regExpParser.pattern(regExpStr);
    regExpAstCache[regExpStr] = regExpAst;
    return regExpAst;
  }
}
function clearRegExpParserCache() {
  regExpAstCache = {};
}

// node_modules/chevrotain/lib/src/scan/reg_exp.js
var complementErrorMessage = "Complement Sets are not supported for first char optimization";
var failedOptimizationPrefixMsg = 'Unable to use "first char" lexer optimizations:\n';
function getOptimizedStartCodesIndices(regExp, ensureOptimizations = false) {
  try {
    const ast = getRegExpAst(regExp);
    const firstChars = firstCharOptimizedIndices(ast.value, {}, ast.flags.ignoreCase);
    return firstChars;
  } catch (e) {
    if (e.message === complementErrorMessage) {
      if (ensureOptimizations) {
        PRINT_WARNING(`${failedOptimizationPrefixMsg}	Unable to optimize: < ${regExp.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
      }
    } else {
      let msgSuffix = "";
      if (ensureOptimizations) {
        msgSuffix = "\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.";
      }
      PRINT_ERROR(`${failedOptimizationPrefixMsg}
	Failed parsing: < ${regExp.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues` + msgSuffix);
    }
  }
  return [];
}
function firstCharOptimizedIndices(ast, result, ignoreCase) {
  switch (ast.type) {
    case "Disjunction":
      for (let i = 0; i < ast.value.length; i++) {
        firstCharOptimizedIndices(ast.value[i], result, ignoreCase);
      }
      break;
    case "Alternative":
      const terms = ast.value;
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        switch (term.type) {
          case "EndAnchor":
          case "GroupBackReference":
          case "Lookahead":
          case "NegativeLookahead":
          case "StartAnchor":
          case "WordBoundary":
          case "NonWordBoundary":
            continue;
        }
        const atom = term;
        switch (atom.type) {
          case "Character":
            addOptimizedIdxToResult(atom.value, result, ignoreCase);
            break;
          case "Set":
            if (atom.complement === true) {
              throw Error(complementErrorMessage);
            }
            forEach_default(atom.value, (code) => {
              if (typeof code === "number") {
                addOptimizedIdxToResult(code, result, ignoreCase);
              } else {
                const range = code;
                if (ignoreCase === true) {
                  for (let rangeCode = range.from; rangeCode <= range.to; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                } else {
                  for (let rangeCode = range.from; rangeCode <= range.to && rangeCode < minOptimizationVal; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                  if (range.to >= minOptimizationVal) {
                    const minUnOptVal = range.from >= minOptimizationVal ? range.from : minOptimizationVal;
                    const maxUnOptVal = range.to;
                    const minOptIdx = charCodeToOptimizedIndex(minUnOptVal);
                    const maxOptIdx = charCodeToOptimizedIndex(maxUnOptVal);
                    for (let currOptIdx = minOptIdx; currOptIdx <= maxOptIdx; currOptIdx++) {
                      result[currOptIdx] = currOptIdx;
                    }
                  }
                }
              }
            });
            break;
          case "Group":
            firstCharOptimizedIndices(atom.value, result, ignoreCase);
            break;
          default:
            throw Error("Non Exhaustive Match");
        }
        const isOptionalQuantifier = atom.quantifier !== void 0 && atom.quantifier.atLeast === 0;
        if (
          // A group may be optional due to empty contents /(?:)/
          // or if everything inside it is optional /((a)?)/
          atom.type === "Group" && isWholeOptional(atom) === false || // If this term is not a group it may only be optional if it has an optional quantifier
          atom.type !== "Group" && isOptionalQuantifier === false
        ) {
          break;
        }
      }
      break;
    default:
      throw Error("non exhaustive match!");
  }
  return values_default(result);
}
function addOptimizedIdxToResult(code, result, ignoreCase) {
  const optimizedCharIdx = charCodeToOptimizedIndex(code);
  result[optimizedCharIdx] = optimizedCharIdx;
  if (ignoreCase === true) {
    handleIgnoreCase(code, result);
  }
}
function handleIgnoreCase(code, result) {
  const char = String.fromCharCode(code);
  const upperChar = char.toUpperCase();
  if (upperChar !== char) {
    const optimizedCharIdx = charCodeToOptimizedIndex(upperChar.charCodeAt(0));
    result[optimizedCharIdx] = optimizedCharIdx;
  } else {
    const lowerChar = char.toLowerCase();
    if (lowerChar !== char) {
      const optimizedCharIdx = charCodeToOptimizedIndex(lowerChar.charCodeAt(0));
      result[optimizedCharIdx] = optimizedCharIdx;
    }
  }
}
function findCode(setNode, targetCharCodes) {
  return find_default(setNode.value, (codeOrRange) => {
    if (typeof codeOrRange === "number") {
      return includes_default(targetCharCodes, codeOrRange);
    } else {
      const range = codeOrRange;
      return find_default(targetCharCodes, (targetCode) => range.from <= targetCode && targetCode <= range.to) !== void 0;
    }
  });
}
function isWholeOptional(ast) {
  const quantifier = ast.quantifier;
  if (quantifier && quantifier.atLeast === 0) {
    return true;
  }
  if (!ast.value) {
    return false;
  }
  return isArray_default(ast.value) ? every_default(ast.value, isWholeOptional) : isWholeOptional(ast.value);
}
var CharCodeFinder = class extends BaseRegExpVisitor {
  constructor(targetCharCodes) {
    super();
    this.targetCharCodes = targetCharCodes;
    this.found = false;
  }
  visitChildren(node) {
    if (this.found === true) {
      return;
    }
    switch (node.type) {
      case "Lookahead":
        this.visitLookahead(node);
        return;
      case "NegativeLookahead":
        this.visitNegativeLookahead(node);
        return;
    }
    super.visitChildren(node);
  }
  visitCharacter(node) {
    if (includes_default(this.targetCharCodes, node.value)) {
      this.found = true;
    }
  }
  visitSet(node) {
    if (node.complement) {
      if (findCode(node, this.targetCharCodes) === void 0) {
        this.found = true;
      }
    } else {
      if (findCode(node, this.targetCharCodes) !== void 0) {
        this.found = true;
      }
    }
  }
};
function canMatchCharCode(charCodes, pattern) {
  if (pattern instanceof RegExp) {
    const ast = getRegExpAst(pattern);
    const charCodeFinder = new CharCodeFinder(charCodes);
    charCodeFinder.visit(ast);
    return charCodeFinder.found;
  } else {
    return find_default(pattern, (char) => {
      return includes_default(charCodes, char.charCodeAt(0));
    }) !== void 0;
  }
}

// node_modules/chevrotain/lib/src/scan/lexer.js
var PATTERN = "PATTERN";
var DEFAULT_MODE = "defaultMode";
var MODES = "modes";
var SUPPORT_STICKY = typeof new RegExp("(?:)").sticky === "boolean";
function analyzeTokenTypes(tokenTypes, options) {
  options = defaults_default(options, {
    useSticky: SUPPORT_STICKY,
    debug: false,
    safeMode: false,
    positionTracking: "full",
    lineTerminatorCharacters: ["\r", "\n"],
    tracer: (msg, action) => action()
  });
  const tracer = options.tracer;
  tracer("initCharCodeToOptimizedIndexMap", () => {
    initCharCodeToOptimizedIndexMap();
  });
  let onlyRelevantTypes;
  tracer("Reject Lexer.NA", () => {
    onlyRelevantTypes = reject_default(tokenTypes, (currType) => {
      return currType[PATTERN] === Lexer.NA;
    });
  });
  let hasCustom = false;
  let allTransformedPatterns;
  tracer("Transform Patterns", () => {
    hasCustom = false;
    allTransformedPatterns = map_default(onlyRelevantTypes, (currType) => {
      const currPattern = currType[PATTERN];
      if (isRegExp_default(currPattern)) {
        const regExpSource = currPattern.source;
        if (regExpSource.length === 1 && // only these regExp meta characters which can appear in a length one regExp
        regExpSource !== "^" && regExpSource !== "$" && regExpSource !== "." && !currPattern.ignoreCase) {
          return regExpSource;
        } else if (regExpSource.length === 2 && regExpSource[0] === "\\" && // not a meta character
        !includes_default([
          "d",
          "D",
          "s",
          "S",
          "t",
          "r",
          "n",
          "t",
          "0",
          "c",
          "b",
          "B",
          "f",
          "v",
          "w",
          "W"
        ], regExpSource[1])) {
          return regExpSource[1];
        } else {
          return options.useSticky ? addStickyFlag(currPattern) : addStartOfInput(currPattern);
        }
      } else if (isFunction_default(currPattern)) {
        hasCustom = true;
        return { exec: currPattern };
      } else if (typeof currPattern === "object") {
        hasCustom = true;
        return currPattern;
      } else if (typeof currPattern === "string") {
        if (currPattern.length === 1) {
          return currPattern;
        } else {
          const escapedRegExpString = currPattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
          const wrappedRegExp = new RegExp(escapedRegExpString);
          return options.useSticky ? addStickyFlag(wrappedRegExp) : addStartOfInput(wrappedRegExp);
        }
      } else {
        throw Error("non exhaustive match");
      }
    });
  });
  let patternIdxToType;
  let patternIdxToGroup;
  let patternIdxToLongerAltIdxArr;
  let patternIdxToPushMode;
  let patternIdxToPopMode;
  tracer("misc mapping", () => {
    patternIdxToType = map_default(onlyRelevantTypes, (currType) => currType.tokenTypeIdx);
    patternIdxToGroup = map_default(onlyRelevantTypes, (clazz) => {
      const groupName = clazz.GROUP;
      if (groupName === Lexer.SKIPPED) {
        return void 0;
      } else if (isString_default(groupName)) {
        return groupName;
      } else if (isUndefined_default(groupName)) {
        return false;
      } else {
        throw Error("non exhaustive match");
      }
    });
    patternIdxToLongerAltIdxArr = map_default(onlyRelevantTypes, (clazz) => {
      const longerAltType = clazz.LONGER_ALT;
      if (longerAltType) {
        const longerAltIdxArr = isArray_default(longerAltType) ? map_default(longerAltType, (type) => indexOf_default(onlyRelevantTypes, type)) : [indexOf_default(onlyRelevantTypes, longerAltType)];
        return longerAltIdxArr;
      }
    });
    patternIdxToPushMode = map_default(onlyRelevantTypes, (clazz) => clazz.PUSH_MODE);
    patternIdxToPopMode = map_default(onlyRelevantTypes, (clazz) => has_default(clazz, "POP_MODE"));
  });
  let patternIdxToCanLineTerminator;
  tracer("Line Terminator Handling", () => {
    const lineTerminatorCharCodes = getCharCodes(options.lineTerminatorCharacters);
    patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => false);
    if (options.positionTracking !== "onlyOffset") {
      patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => {
        if (has_default(tokType, "LINE_BREAKS")) {
          return !!tokType.LINE_BREAKS;
        } else {
          return checkLineBreaksIssues(tokType, lineTerminatorCharCodes) === false && canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
        }
      });
    }
  });
  let patternIdxToIsCustom;
  let patternIdxToShort;
  let emptyGroups;
  let patternIdxToConfig;
  tracer("Misc Mapping #2", () => {
    patternIdxToIsCustom = map_default(onlyRelevantTypes, isCustomPattern);
    patternIdxToShort = map_default(allTransformedPatterns, isShortPattern);
    emptyGroups = reduce_default(onlyRelevantTypes, (acc, clazz) => {
      const groupName = clazz.GROUP;
      if (isString_default(groupName) && !(groupName === Lexer.SKIPPED)) {
        acc[groupName] = [];
      }
      return acc;
    }, {});
    patternIdxToConfig = map_default(allTransformedPatterns, (x, idx) => {
      return {
        pattern: allTransformedPatterns[idx],
        longerAlt: patternIdxToLongerAltIdxArr[idx],
        canLineTerminator: patternIdxToCanLineTerminator[idx],
        isCustom: patternIdxToIsCustom[idx],
        short: patternIdxToShort[idx],
        group: patternIdxToGroup[idx],
        push: patternIdxToPushMode[idx],
        pop: patternIdxToPopMode[idx],
        tokenTypeIdx: patternIdxToType[idx],
        tokenType: onlyRelevantTypes[idx]
      };
    });
  });
  let canBeOptimized = true;
  let charCodeToPatternIdxToConfig = [];
  if (!options.safeMode) {
    tracer("First Char Optimization", () => {
      charCodeToPatternIdxToConfig = reduce_default(onlyRelevantTypes, (result, currTokType, idx) => {
        if (typeof currTokType.PATTERN === "string") {
          const charCode = currTokType.PATTERN.charCodeAt(0);
          const optimizedIdx = charCodeToOptimizedIndex(charCode);
          addToMapOfArrays(result, optimizedIdx, patternIdxToConfig[idx]);
        } else if (isArray_default(currTokType.START_CHARS_HINT)) {
          let lastOptimizedIdx;
          forEach_default(currTokType.START_CHARS_HINT, (charOrInt) => {
            const charCode = typeof charOrInt === "string" ? charOrInt.charCodeAt(0) : charOrInt;
            const currOptimizedIdx = charCodeToOptimizedIndex(charCode);
            if (lastOptimizedIdx !== currOptimizedIdx) {
              lastOptimizedIdx = currOptimizedIdx;
              addToMapOfArrays(result, currOptimizedIdx, patternIdxToConfig[idx]);
            }
          });
        } else if (isRegExp_default(currTokType.PATTERN)) {
          if (currTokType.PATTERN.unicode) {
            canBeOptimized = false;
            if (options.ensureOptimizations) {
              PRINT_ERROR(`${failedOptimizationPrefixMsg}	Unable to analyze < ${currTokType.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
            }
          } else {
            const optimizedCodes = getOptimizedStartCodesIndices(currTokType.PATTERN, options.ensureOptimizations);
            if (isEmpty_default(optimizedCodes)) {
              canBeOptimized = false;
            }
            forEach_default(optimizedCodes, (code) => {
              addToMapOfArrays(result, code, patternIdxToConfig[idx]);
            });
          }
        } else {
          if (options.ensureOptimizations) {
            PRINT_ERROR(`${failedOptimizationPrefixMsg}	TokenType: <${currTokType.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`);
          }
          canBeOptimized = false;
        }
        return result;
      }, []);
    });
  }
  return {
    emptyGroups,
    patternIdxToConfig,
    charCodeToPatternIdxToConfig,
    hasCustom,
    canBeOptimized
  };
}
function validatePatterns(tokenTypes, validModesNames) {
  let errors = [];
  const missingResult = findMissingPatterns(tokenTypes);
  errors = errors.concat(missingResult.errors);
  const invalidResult = findInvalidPatterns(missingResult.valid);
  const validTokenTypes = invalidResult.valid;
  errors = errors.concat(invalidResult.errors);
  errors = errors.concat(validateRegExpPattern(validTokenTypes));
  errors = errors.concat(findInvalidGroupType(validTokenTypes));
  errors = errors.concat(findModesThatDoNotExist(validTokenTypes, validModesNames));
  errors = errors.concat(findUnreachablePatterns(validTokenTypes));
  return errors;
}
function validateRegExpPattern(tokenTypes) {
  let errors = [];
  const withRegExpPatterns = filter_default(tokenTypes, (currTokType) => isRegExp_default(currTokType[PATTERN]));
  errors = errors.concat(findEndOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findStartOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findUnsupportedFlags(withRegExpPatterns));
  errors = errors.concat(findDuplicatePatterns(withRegExpPatterns));
  errors = errors.concat(findEmptyMatchRegExps(withRegExpPatterns));
  return errors;
}
function findMissingPatterns(tokenTypes) {
  const tokenTypesWithMissingPattern = filter_default(tokenTypes, (currType) => {
    return !has_default(currType, PATTERN);
  });
  const errors = map_default(tokenTypesWithMissingPattern, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- missing static 'PATTERN' property",
      type: LexerDefinitionErrorType.MISSING_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = difference_default(tokenTypes, tokenTypesWithMissingPattern);
  return { errors, valid };
}
function findInvalidPatterns(tokenTypes) {
  const tokenTypesWithInvalidPattern = filter_default(tokenTypes, (currType) => {
    const pattern = currType[PATTERN];
    return !isRegExp_default(pattern) && !isFunction_default(pattern) && !has_default(pattern, "exec") && !isString_default(pattern);
  });
  const errors = map_default(tokenTypesWithInvalidPattern, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
      type: LexerDefinitionErrorType.INVALID_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = difference_default(tokenTypes, tokenTypesWithInvalidPattern);
  return { errors, valid };
}
var end_of_input = /[^\\][$]/;
function findEndOfInputAnchor(tokenTypes) {
  class EndAnchorFinder extends BaseRegExpVisitor {
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitEndAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const endAnchorVisitor = new EndAnchorFinder();
      endAnchorVisitor.visit(regexpAst);
      return endAnchorVisitor.found;
    } catch (e) {
      return end_of_input.test(pattern.source);
    }
  });
  const errors = map_default(invalidRegex, (currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findEmptyMatchRegExps(tokenTypes) {
  const matchesEmptyString = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    return pattern.test("");
  });
  const errors = map_default(matchesEmptyString, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' must not match an empty string",
      type: LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,
      tokenTypes: [currType]
    };
  });
  return errors;
}
var start_of_input = /[^\\[][\^]|^\^/;
function findStartOfInputAnchor(tokenTypes) {
  class StartAnchorFinder extends BaseRegExpVisitor {
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitStartAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const startAnchorVisitor = new StartAnchorFinder();
      startAnchorVisitor.visit(regexpAst);
      return startAnchorVisitor.found;
    } catch (e) {
      return start_of_input.test(pattern.source);
    }
  });
  const errors = map_default(invalidRegex, (currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.SOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findUnsupportedFlags(tokenTypes) {
  const invalidFlags = filter_default(tokenTypes, (currType) => {
    const pattern = currType[PATTERN];
    return pattern instanceof RegExp && (pattern.multiline || pattern.global);
  });
  const errors = map_default(invalidFlags, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
      type: LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findDuplicatePatterns(tokenTypes) {
  const found = [];
  let identicalPatterns = map_default(tokenTypes, (outerType) => {
    return reduce_default(tokenTypes, (result, innerType) => {
      if (outerType.PATTERN.source === innerType.PATTERN.source && !includes_default(found, innerType) && innerType.PATTERN !== Lexer.NA) {
        found.push(innerType);
        result.push(innerType);
        return result;
      }
      return result;
    }, []);
  });
  identicalPatterns = compact_default(identicalPatterns);
  const duplicatePatterns = filter_default(identicalPatterns, (currIdenticalSet) => {
    return currIdenticalSet.length > 1;
  });
  const errors = map_default(duplicatePatterns, (setOfIdentical) => {
    const tokenTypeNames = map_default(setOfIdentical, (currType) => {
      return currType.name;
    });
    const dupPatternSrc = head_default(setOfIdentical).PATTERN;
    return {
      message: `The same RegExp pattern ->${dupPatternSrc}<-has been used in all of the following Token Types: ${tokenTypeNames.join(", ")} <-`,
      type: LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
      tokenTypes: setOfIdentical
    };
  });
  return errors;
}
function findInvalidGroupType(tokenTypes) {
  const invalidTypes = filter_default(tokenTypes, (clazz) => {
    if (!has_default(clazz, "GROUP")) {
      return false;
    }
    const group = clazz.GROUP;
    return group !== Lexer.SKIPPED && group !== Lexer.NA && !isString_default(group);
  });
  const errors = map_default(invalidTypes, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
      type: LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findModesThatDoNotExist(tokenTypes, validModes) {
  const invalidModes = filter_default(tokenTypes, (clazz) => {
    return clazz.PUSH_MODE !== void 0 && !includes_default(validModes, clazz.PUSH_MODE);
  });
  const errors = map_default(invalidModes, (tokType) => {
    const msg = `Token Type: ->${tokType.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${tokType.PUSH_MODE}<-which does not exist`;
    return {
      message: msg,
      type: LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,
      tokenTypes: [tokType]
    };
  });
  return errors;
}
function findUnreachablePatterns(tokenTypes) {
  const errors = [];
  const canBeTested = reduce_default(tokenTypes, (result, tokType, idx) => {
    const pattern = tokType.PATTERN;
    if (pattern === Lexer.NA) {
      return result;
    }
    if (isString_default(pattern)) {
      result.push({ str: pattern, idx, tokenType: tokType });
    } else if (isRegExp_default(pattern) && noMetaChar(pattern)) {
      result.push({ str: pattern.source, idx, tokenType: tokType });
    }
    return result;
  }, []);
  forEach_default(tokenTypes, (tokType, testIdx) => {
    forEach_default(canBeTested, ({ str, idx, tokenType }) => {
      if (testIdx < idx && testTokenType(str, tokType.PATTERN)) {
        const msg = `Token: ->${tokenType.name}<- can never be matched.
Because it appears AFTER the Token Type ->${tokType.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
        errors.push({
          message: msg,
          type: LexerDefinitionErrorType.UNREACHABLE_PATTERN,
          tokenTypes: [tokType, tokenType]
        });
      }
    });
  });
  return errors;
}
function testTokenType(str, pattern) {
  if (isRegExp_default(pattern)) {
    const regExpArray = pattern.exec(str);
    return regExpArray !== null && regExpArray.index === 0;
  } else if (isFunction_default(pattern)) {
    return pattern(str, 0, [], {});
  } else if (has_default(pattern, "exec")) {
    return pattern.exec(str, 0, [], {});
  } else if (typeof pattern === "string") {
    return pattern === str;
  } else {
    throw Error("non exhaustive match");
  }
}
function noMetaChar(regExp) {
  const metaChars = [
    ".",
    "\\",
    "[",
    "]",
    "|",
    "^",
    "$",
    "(",
    ")",
    "?",
    "*",
    "+",
    "{"
  ];
  return find_default(metaChars, (char) => regExp.source.indexOf(char) !== -1) === void 0;
}
function addStartOfInput(pattern) {
  const flags = pattern.ignoreCase ? "i" : "";
  return new RegExp(`^(?:${pattern.source})`, flags);
}
function addStickyFlag(pattern) {
  const flags = pattern.ignoreCase ? "iy" : "y";
  return new RegExp(`${pattern.source}`, flags);
}
function performRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const errors = [];
  if (!has_default(lexerDefinition, DEFAULT_MODE)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + DEFAULT_MODE + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
    });
  }
  if (!has_default(lexerDefinition, MODES)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + MODES + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
    });
  }
  if (has_default(lexerDefinition, MODES) && has_default(lexerDefinition, DEFAULT_MODE) && !has_default(lexerDefinition.modes, lexerDefinition.defaultMode)) {
    errors.push({
      message: `A MultiMode Lexer cannot be initialized with a ${DEFAULT_MODE}: <${lexerDefinition.defaultMode}>which does not exist
`,
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
    });
  }
  if (has_default(lexerDefinition, MODES)) {
    forEach_default(lexerDefinition.modes, (currModeValue, currModeName) => {
      forEach_default(currModeValue, (currTokType, currIdx) => {
        if (isUndefined_default(currTokType)) {
          errors.push({
            message: `A Lexer cannot be initialized using an undefined Token Type. Mode:<${currModeName}> at index: <${currIdx}>
`,
            type: LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
          });
        } else if (has_default(currTokType, "LONGER_ALT")) {
          const longerAlt = isArray_default(currTokType.LONGER_ALT) ? currTokType.LONGER_ALT : [currTokType.LONGER_ALT];
          forEach_default(longerAlt, (currLongerAlt) => {
            if (!isUndefined_default(currLongerAlt) && !includes_default(currModeValue, currLongerAlt)) {
              errors.push({
                message: `A MultiMode Lexer cannot be initialized with a longer_alt <${currLongerAlt.name}> on token <${currTokType.name}> outside of mode <${currModeName}>
`,
                type: LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE
              });
            }
          });
        }
      });
    });
  }
  return errors;
}
function performWarningRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const warnings = [];
  let hasAnyLineBreak = false;
  const allTokenTypes = compact_default(flatten_default(values_default(lexerDefinition.modes)));
  const concreteTokenTypes = reject_default(allTokenTypes, (currType) => currType[PATTERN] === Lexer.NA);
  const terminatorCharCodes = getCharCodes(lineTerminatorCharacters);
  if (trackLines) {
    forEach_default(concreteTokenTypes, (tokType) => {
      const currIssue = checkLineBreaksIssues(tokType, terminatorCharCodes);
      if (currIssue !== false) {
        const message = buildLineBreakIssueMessage(tokType, currIssue);
        const warningDescriptor = {
          message,
          type: currIssue.issue,
          tokenType: tokType
        };
        warnings.push(warningDescriptor);
      } else {
        if (has_default(tokType, "LINE_BREAKS")) {
          if (tokType.LINE_BREAKS === true) {
            hasAnyLineBreak = true;
          }
        } else {
          if (canMatchCharCode(terminatorCharCodes, tokType.PATTERN)) {
            hasAnyLineBreak = true;
          }
        }
      }
    });
  }
  if (trackLines && !hasAnyLineBreak) {
    warnings.push({
      message: "Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",
      type: LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS
    });
  }
  return warnings;
}
function cloneEmptyGroups(emptyGroups) {
  const clonedResult = {};
  const groupKeys = keys_default(emptyGroups);
  forEach_default(groupKeys, (currKey) => {
    const currGroupValue = emptyGroups[currKey];
    if (isArray_default(currGroupValue)) {
      clonedResult[currKey] = [];
    } else {
      throw Error("non exhaustive match");
    }
  });
  return clonedResult;
}
function isCustomPattern(tokenType) {
  const pattern = tokenType.PATTERN;
  if (isRegExp_default(pattern)) {
    return false;
  } else if (isFunction_default(pattern)) {
    return true;
  } else if (has_default(pattern, "exec")) {
    return true;
  } else if (isString_default(pattern)) {
    return false;
  } else {
    throw Error("non exhaustive match");
  }
}
function isShortPattern(pattern) {
  if (isString_default(pattern) && pattern.length === 1) {
    return pattern.charCodeAt(0);
  } else {
    return false;
  }
}
var LineTerminatorOptimizedTester = {
  // implements /\n|\r\n?/g.test
  test: function(text) {
    const len = text.length;
    for (let i = this.lastIndex; i < len; i++) {
      const c = text.charCodeAt(i);
      if (c === 10) {
        this.lastIndex = i + 1;
        return true;
      } else if (c === 13) {
        if (text.charCodeAt(i + 1) === 10) {
          this.lastIndex = i + 2;
        } else {
          this.lastIndex = i + 1;
        }
        return true;
      }
    }
    return false;
  },
  lastIndex: 0
};
function checkLineBreaksIssues(tokType, lineTerminatorCharCodes) {
  if (has_default(tokType, "LINE_BREAKS")) {
    return false;
  } else {
    if (isRegExp_default(tokType.PATTERN)) {
      try {
        canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
      } catch (e) {
        return {
          issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR,
          errMsg: e.message
        };
      }
      return false;
    } else if (isString_default(tokType.PATTERN)) {
      return false;
    } else if (isCustomPattern(tokType)) {
      return { issue: LexerDefinitionErrorType.CUSTOM_LINE_BREAK };
    } else {
      throw Error("non exhaustive match");
    }
  }
}
function buildLineBreakIssueMessage(tokType, details) {
  if (details.issue === LexerDefinitionErrorType.IDENTIFY_TERMINATOR) {
    return `Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${tokType.name}> Token Type
	 Root cause: ${details.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;
  } else if (details.issue === LexerDefinitionErrorType.CUSTOM_LINE_BREAK) {
    return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${tokType.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;
  } else {
    throw Error("non exhaustive match");
  }
}
function getCharCodes(charsOrCodes) {
  const charCodes = map_default(charsOrCodes, (numOrString) => {
    if (isString_default(numOrString)) {
      return numOrString.charCodeAt(0);
    } else {
      return numOrString;
    }
  });
  return charCodes;
}
function addToMapOfArrays(map2, key, value) {
  if (map2[key] === void 0) {
    map2[key] = [value];
  } else {
    map2[key].push(value);
  }
}
var minOptimizationVal = 256;
var charCodeToOptimizedIdxMap = [];
function charCodeToOptimizedIndex(charCode) {
  return charCode < minOptimizationVal ? charCode : charCodeToOptimizedIdxMap[charCode];
}
function initCharCodeToOptimizedIndexMap() {
  if (isEmpty_default(charCodeToOptimizedIdxMap)) {
    charCodeToOptimizedIdxMap = new Array(65536);
    for (let i = 0; i < 65536; i++) {
      charCodeToOptimizedIdxMap[i] = i > 255 ? 255 + ~~(i / 255) : i;
    }
  }
}

// node_modules/chevrotain/lib/src/scan/tokens.js
function tokenStructuredMatcher(tokInstance, tokConstructor) {
  const instanceType = tokInstance.tokenTypeIdx;
  if (instanceType === tokConstructor.tokenTypeIdx) {
    return true;
  } else {
    return tokConstructor.isParent === true && tokConstructor.categoryMatchesMap[instanceType] === true;
  }
}
function tokenStructuredMatcherNoCategories(token, tokType) {
  return token.tokenTypeIdx === tokType.tokenTypeIdx;
}
var tokenShortNameIdx = 1;
var tokenIdxToClass = {};
function augmentTokenTypes(tokenTypes) {
  const tokenTypesAndParents = expandCategories(tokenTypes);
  assignTokenDefaultProps(tokenTypesAndParents);
  assignCategoriesMapProp(tokenTypesAndParents);
  assignCategoriesTokensProp(tokenTypesAndParents);
  forEach_default(tokenTypesAndParents, (tokType) => {
    tokType.isParent = tokType.categoryMatches.length > 0;
  });
}
function expandCategories(tokenTypes) {
  let result = clone_default(tokenTypes);
  let categories = tokenTypes;
  let searching = true;
  while (searching) {
    categories = compact_default(flatten_default(map_default(categories, (currTokType) => currTokType.CATEGORIES)));
    const newCategories = difference_default(categories, result);
    result = result.concat(newCategories);
    if (isEmpty_default(newCategories)) {
      searching = false;
    } else {
      categories = newCategories;
    }
  }
  return result;
}
function assignTokenDefaultProps(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    if (!hasShortKeyProperty(currTokType)) {
      tokenIdxToClass[tokenShortNameIdx] = currTokType;
      currTokType.tokenTypeIdx = tokenShortNameIdx++;
    }
    if (hasCategoriesProperty(currTokType) && !isArray_default(currTokType.CATEGORIES)) {
      currTokType.CATEGORIES = [currTokType.CATEGORIES];
    }
    if (!hasCategoriesProperty(currTokType)) {
      currTokType.CATEGORIES = [];
    }
    if (!hasExtendingTokensTypesProperty(currTokType)) {
      currTokType.categoryMatches = [];
    }
    if (!hasExtendingTokensTypesMapProperty(currTokType)) {
      currTokType.categoryMatchesMap = {};
    }
  });
}
function assignCategoriesTokensProp(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    currTokType.categoryMatches = [];
    forEach_default(currTokType.categoryMatchesMap, (val, key) => {
      currTokType.categoryMatches.push(tokenIdxToClass[key].tokenTypeIdx);
    });
  });
}
function assignCategoriesMapProp(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    singleAssignCategoriesToksMap([], currTokType);
  });
}
function singleAssignCategoriesToksMap(path, nextNode) {
  forEach_default(path, (pathNode) => {
    nextNode.categoryMatchesMap[pathNode.tokenTypeIdx] = true;
  });
  forEach_default(nextNode.CATEGORIES, (nextCategory) => {
    const newPath = path.concat(nextNode);
    if (!includes_default(newPath, nextCategory)) {
      singleAssignCategoriesToksMap(newPath, nextCategory);
    }
  });
}
function hasShortKeyProperty(tokType) {
  return has_default(tokType, "tokenTypeIdx");
}
function hasCategoriesProperty(tokType) {
  return has_default(tokType, "CATEGORIES");
}
function hasExtendingTokensTypesProperty(tokType) {
  return has_default(tokType, "categoryMatches");
}
function hasExtendingTokensTypesMapProperty(tokType) {
  return has_default(tokType, "categoryMatchesMap");
}
function isTokenType(tokType) {
  return has_default(tokType, "tokenTypeIdx");
}

// node_modules/chevrotain/lib/src/scan/lexer_errors_public.js
var defaultLexerErrorProvider = {
  buildUnableToPopLexerModeMessage(token) {
    return `Unable to pop Lexer Mode after encountering Token ->${token.image}<- The Mode Stack is empty`;
  },
  buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column) {
    return `unexpected character: ->${fullText.charAt(startOffset)}<- at offset: ${startOffset}, skipped ${length} characters.`;
  }
};

// node_modules/chevrotain/lib/src/scan/lexer_public.js
var LexerDefinitionErrorType;
(function(LexerDefinitionErrorType2) {
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MISSING_PATTERN"] = 0] = "MISSING_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_PATTERN"] = 1] = "INVALID_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["EOI_ANCHOR_FOUND"] = 2] = "EOI_ANCHOR_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNSUPPORTED_FLAGS_FOUND"] = 3] = "UNSUPPORTED_FLAGS_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["DUPLICATE_PATTERNS_FOUND"] = 4] = "DUPLICATE_PATTERNS_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_GROUP_TYPE_FOUND"] = 5] = "INVALID_GROUP_TYPE_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["PUSH_MODE_DOES_NOT_EXIST"] = 6] = "PUSH_MODE_DOES_NOT_EXIST";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"] = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"] = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"] = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"] = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["SOI_ANCHOR_FOUND"] = 11] = "SOI_ANCHOR_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["EMPTY_MATCH_PATTERN"] = 12] = "EMPTY_MATCH_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["NO_LINE_BREAKS_FLAGS"] = 13] = "NO_LINE_BREAKS_FLAGS";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNREACHABLE_PATTERN"] = 14] = "UNREACHABLE_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["IDENTIFY_TERMINATOR"] = 15] = "IDENTIFY_TERMINATOR";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["CUSTOM_LINE_BREAK"] = 16] = "CUSTOM_LINE_BREAK";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"] = 17] = "MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE";
})(LexerDefinitionErrorType || (LexerDefinitionErrorType = {}));
var DEFAULT_LEXER_CONFIG = {
  deferDefinitionErrorsHandling: false,
  positionTracking: "full",
  lineTerminatorsPattern: /\n|\r\n?/g,
  lineTerminatorCharacters: ["\n", "\r"],
  ensureOptimizations: false,
  safeMode: false,
  errorMessageProvider: defaultLexerErrorProvider,
  traceInitPerf: false,
  skipValidations: false,
  recoveryEnabled: true
};
Object.freeze(DEFAULT_LEXER_CONFIG);
var Lexer = class {
  constructor(lexerDefinition, config = DEFAULT_LEXER_CONFIG) {
    this.lexerDefinition = lexerDefinition;
    this.lexerDefinitionErrors = [];
    this.lexerDefinitionWarning = [];
    this.patternIdxToConfig = {};
    this.charCodeToPatternIdxToConfig = {};
    this.modes = [];
    this.emptyGroups = {};
    this.trackStartLines = true;
    this.trackEndLines = true;
    this.hasCustom = false;
    this.canModeBeOptimized = {};
    this.TRACE_INIT = (phaseDesc, phaseImpl) => {
      if (this.traceInitPerf === true) {
        this.traceInitIndent++;
        const indent = new Array(this.traceInitIndent + 1).join("	");
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          console.log(`${indent}--> <${phaseDesc}>`);
        }
        const { time, value } = timer(phaseImpl);
        const traceMethod = time > 10 ? console.warn : console.log;
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
        }
        this.traceInitIndent--;
        return value;
      } else {
        return phaseImpl();
      }
    };
    if (typeof config === "boolean") {
      throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported");
    }
    this.config = assign_default({}, DEFAULT_LEXER_CONFIG, config);
    const traceInitVal = this.config.traceInitPerf;
    if (traceInitVal === true) {
      this.traceInitMaxIdent = Infinity;
      this.traceInitPerf = true;
    } else if (typeof traceInitVal === "number") {
      this.traceInitMaxIdent = traceInitVal;
      this.traceInitPerf = true;
    }
    this.traceInitIndent = -1;
    this.TRACE_INIT("Lexer Constructor", () => {
      let actualDefinition;
      let hasOnlySingleMode = true;
      this.TRACE_INIT("Lexer Config handling", () => {
        if (this.config.lineTerminatorsPattern === DEFAULT_LEXER_CONFIG.lineTerminatorsPattern) {
          this.config.lineTerminatorsPattern = LineTerminatorOptimizedTester;
        } else {
          if (this.config.lineTerminatorCharacters === DEFAULT_LEXER_CONFIG.lineTerminatorCharacters) {
            throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS");
          }
        }
        if (config.safeMode && config.ensureOptimizations) {
          throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');
        }
        this.trackStartLines = /full|onlyStart/i.test(this.config.positionTracking);
        this.trackEndLines = /full/i.test(this.config.positionTracking);
        if (isArray_default(lexerDefinition)) {
          actualDefinition = {
            modes: { defaultMode: clone_default(lexerDefinition) },
            defaultMode: DEFAULT_MODE
          };
        } else {
          hasOnlySingleMode = false;
          actualDefinition = clone_default(lexerDefinition);
        }
      });
      if (this.config.skipValidations === false) {
        this.TRACE_INIT("performRuntimeChecks", () => {
          this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(performRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
        });
        this.TRACE_INIT("performWarningRuntimeChecks", () => {
          this.lexerDefinitionWarning = this.lexerDefinitionWarning.concat(performWarningRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
        });
      }
      actualDefinition.modes = actualDefinition.modes ? actualDefinition.modes : {};
      forEach_default(actualDefinition.modes, (currModeValue, currModeName) => {
        actualDefinition.modes[currModeName] = reject_default(currModeValue, (currTokType) => isUndefined_default(currTokType));
      });
      const allModeNames = keys_default(actualDefinition.modes);
      forEach_default(actualDefinition.modes, (currModDef, currModName) => {
        this.TRACE_INIT(`Mode: <${currModName}> processing`, () => {
          this.modes.push(currModName);
          if (this.config.skipValidations === false) {
            this.TRACE_INIT(`validatePatterns`, () => {
              this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(validatePatterns(currModDef, allModeNames));
            });
          }
          if (isEmpty_default(this.lexerDefinitionErrors)) {
            augmentTokenTypes(currModDef);
            let currAnalyzeResult;
            this.TRACE_INIT(`analyzeTokenTypes`, () => {
              currAnalyzeResult = analyzeTokenTypes(currModDef, {
                lineTerminatorCharacters: this.config.lineTerminatorCharacters,
                positionTracking: config.positionTracking,
                ensureOptimizations: config.ensureOptimizations,
                safeMode: config.safeMode,
                tracer: this.TRACE_INIT
              });
            });
            this.patternIdxToConfig[currModName] = currAnalyzeResult.patternIdxToConfig;
            this.charCodeToPatternIdxToConfig[currModName] = currAnalyzeResult.charCodeToPatternIdxToConfig;
            this.emptyGroups = assign_default({}, this.emptyGroups, currAnalyzeResult.emptyGroups);
            this.hasCustom = currAnalyzeResult.hasCustom || this.hasCustom;
            this.canModeBeOptimized[currModName] = currAnalyzeResult.canBeOptimized;
          }
        });
      });
      this.defaultMode = actualDefinition.defaultMode;
      if (!isEmpty_default(this.lexerDefinitionErrors) && !this.config.deferDefinitionErrorsHandling) {
        const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
          return error.message;
        });
        const allErrMessagesString = allErrMessages.join("-----------------------\n");
        throw new Error("Errors detected in definition of Lexer:\n" + allErrMessagesString);
      }
      forEach_default(this.lexerDefinitionWarning, (warningDescriptor) => {
        PRINT_WARNING(warningDescriptor.message);
      });
      this.TRACE_INIT("Choosing sub-methods implementations", () => {
        if (SUPPORT_STICKY) {
          this.chopInput = identity_default;
          this.match = this.matchWithTest;
        } else {
          this.updateLastIndex = noop_default;
          this.match = this.matchWithExec;
        }
        if (hasOnlySingleMode) {
          this.handleModes = noop_default;
        }
        if (this.trackStartLines === false) {
          this.computeNewColumn = identity_default;
        }
        if (this.trackEndLines === false) {
          this.updateTokenEndLineColumnLocation = noop_default;
        }
        if (/full/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createFullToken;
        } else if (/onlyStart/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createStartOnlyToken;
        } else if (/onlyOffset/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createOffsetOnlyToken;
        } else {
          throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);
        }
        if (this.hasCustom) {
          this.addToken = this.addTokenUsingPush;
          this.handlePayload = this.handlePayloadWithCustom;
        } else {
          this.addToken = this.addTokenUsingMemberAccess;
          this.handlePayload = this.handlePayloadNoCustom;
        }
      });
      this.TRACE_INIT("Failed Optimization Warnings", () => {
        const unOptimizedModes = reduce_default(this.canModeBeOptimized, (cannotBeOptimized, canBeOptimized, modeName) => {
          if (canBeOptimized === false) {
            cannotBeOptimized.push(modeName);
          }
          return cannotBeOptimized;
        }, []);
        if (config.ensureOptimizations && !isEmpty_default(unOptimizedModes)) {
          throw Error(`Lexer Modes: < ${unOptimizedModes.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
        }
      });
      this.TRACE_INIT("clearRegExpParserCache", () => {
        clearRegExpParserCache();
      });
      this.TRACE_INIT("toFastProperties", () => {
        toFastProperties(this);
      });
    });
  }
  tokenize(text, initialMode = this.defaultMode) {
    if (!isEmpty_default(this.lexerDefinitionErrors)) {
      const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
        return error.message;
      });
      const allErrMessagesString = allErrMessages.join("-----------------------\n");
      throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + allErrMessagesString);
    }
    return this.tokenizeInternal(text, initialMode);
  }
  // There is quite a bit of duplication between this and "tokenizeInternalLazy"
  // This is intentional due to performance considerations.
  // this method also used quite a bit of `!` none null assertions because it is too optimized
  // for `tsc` to always understand it is "safe"
  tokenizeInternal(text, initialMode) {
    let i, j, k, matchAltImage, longerAlt, matchedImage, payload, altPayload, imageLength, group, tokType, newToken, errLength, droppedChar, msg, match;
    const orgText = text;
    const orgLength = orgText.length;
    let offset = 0;
    let matchedTokensIndex = 0;
    const guessedNumberOfTokens = this.hasCustom ? 0 : Math.floor(text.length / 10);
    const matchedTokens = new Array(guessedNumberOfTokens);
    const errors = [];
    let line = this.trackStartLines ? 1 : void 0;
    let column = this.trackStartLines ? 1 : void 0;
    const groups = cloneEmptyGroups(this.emptyGroups);
    const trackLines = this.trackStartLines;
    const lineTerminatorPattern = this.config.lineTerminatorsPattern;
    let currModePatternsLength = 0;
    let patternIdxToConfig = [];
    let currCharCodeToPatternIdxToConfig = [];
    const modeStack = [];
    const emptyArray = [];
    Object.freeze(emptyArray);
    let getPossiblePatterns;
    function getPossiblePatternsSlow() {
      return patternIdxToConfig;
    }
    function getPossiblePatternsOptimized(charCode) {
      const optimizedCharIdx = charCodeToOptimizedIndex(charCode);
      const possiblePatterns = currCharCodeToPatternIdxToConfig[optimizedCharIdx];
      if (possiblePatterns === void 0) {
        return emptyArray;
      } else {
        return possiblePatterns;
      }
    }
    const pop_mode = (popToken) => {
      if (modeStack.length === 1 && // if we have both a POP_MODE and a PUSH_MODE this is in-fact a "transition"
      // So no error should occur.
      popToken.tokenType.PUSH_MODE === void 0) {
        const msg2 = this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(popToken);
        errors.push({
          offset: popToken.startOffset,
          line: popToken.startLine,
          column: popToken.startColumn,
          length: popToken.image.length,
          message: msg2
        });
      } else {
        modeStack.pop();
        const newMode = last_default(modeStack);
        patternIdxToConfig = this.patternIdxToConfig[newMode];
        currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
        currModePatternsLength = patternIdxToConfig.length;
        const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
        if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
          getPossiblePatterns = getPossiblePatternsOptimized;
        } else {
          getPossiblePatterns = getPossiblePatternsSlow;
        }
      }
    };
    function push_mode(newMode) {
      modeStack.push(newMode);
      currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
      patternIdxToConfig = this.patternIdxToConfig[newMode];
      currModePatternsLength = patternIdxToConfig.length;
      currModePatternsLength = patternIdxToConfig.length;
      const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
      if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
        getPossiblePatterns = getPossiblePatternsOptimized;
      } else {
        getPossiblePatterns = getPossiblePatternsSlow;
      }
    }
    push_mode.call(this, initialMode);
    let currConfig;
    const recoveryEnabled = this.config.recoveryEnabled;
    while (offset < orgLength) {
      matchedImage = null;
      const nextCharCode = orgText.charCodeAt(offset);
      const chosenPatternIdxToConfig = getPossiblePatterns(nextCharCode);
      const chosenPatternsLength = chosenPatternIdxToConfig.length;
      for (i = 0; i < chosenPatternsLength; i++) {
        currConfig = chosenPatternIdxToConfig[i];
        const currPattern = currConfig.pattern;
        payload = null;
        const singleCharCode = currConfig.short;
        if (singleCharCode !== false) {
          if (nextCharCode === singleCharCode) {
            matchedImage = currPattern;
          }
        } else if (currConfig.isCustom === true) {
          match = currPattern.exec(orgText, offset, matchedTokens, groups);
          if (match !== null) {
            matchedImage = match[0];
            if (match.payload !== void 0) {
              payload = match.payload;
            }
          } else {
            matchedImage = null;
          }
        } else {
          this.updateLastIndex(currPattern, offset);
          matchedImage = this.match(currPattern, text, offset);
        }
        if (matchedImage !== null) {
          longerAlt = currConfig.longerAlt;
          if (longerAlt !== void 0) {
            const longerAltLength = longerAlt.length;
            for (k = 0; k < longerAltLength; k++) {
              const longerAltConfig = patternIdxToConfig[longerAlt[k]];
              const longerAltPattern = longerAltConfig.pattern;
              altPayload = null;
              if (longerAltConfig.isCustom === true) {
                match = longerAltPattern.exec(orgText, offset, matchedTokens, groups);
                if (match !== null) {
                  matchAltImage = match[0];
                  if (match.payload !== void 0) {
                    altPayload = match.payload;
                  }
                } else {
                  matchAltImage = null;
                }
              } else {
                this.updateLastIndex(longerAltPattern, offset);
                matchAltImage = this.match(longerAltPattern, text, offset);
              }
              if (matchAltImage && matchAltImage.length > matchedImage.length) {
                matchedImage = matchAltImage;
                payload = altPayload;
                currConfig = longerAltConfig;
                break;
              }
            }
          }
          break;
        }
      }
      if (matchedImage !== null) {
        imageLength = matchedImage.length;
        group = currConfig.group;
        if (group !== void 0) {
          tokType = currConfig.tokenTypeIdx;
          newToken = this.createTokenInstance(matchedImage, offset, tokType, currConfig.tokenType, line, column, imageLength);
          this.handlePayload(newToken, payload);
          if (group === false) {
            matchedTokensIndex = this.addToken(matchedTokens, matchedTokensIndex, newToken);
          } else {
            groups[group].push(newToken);
          }
        }
        text = this.chopInput(text, imageLength);
        offset = offset + imageLength;
        column = this.computeNewColumn(column, imageLength);
        if (trackLines === true && currConfig.canLineTerminator === true) {
          let numOfLTsInMatch = 0;
          let foundTerminator;
          let lastLTEndOffset;
          lineTerminatorPattern.lastIndex = 0;
          do {
            foundTerminator = lineTerminatorPattern.test(matchedImage);
            if (foundTerminator === true) {
              lastLTEndOffset = lineTerminatorPattern.lastIndex - 1;
              numOfLTsInMatch++;
            }
          } while (foundTerminator === true);
          if (numOfLTsInMatch !== 0) {
            line = line + numOfLTsInMatch;
            column = imageLength - lastLTEndOffset;
            this.updateTokenEndLineColumnLocation(newToken, group, lastLTEndOffset, numOfLTsInMatch, line, column, imageLength);
          }
        }
        this.handleModes(currConfig, pop_mode, push_mode, newToken);
      } else {
        const errorStartOffset = offset;
        const errorLine = line;
        const errorColumn = column;
        let foundResyncPoint = recoveryEnabled === false;
        while (foundResyncPoint === false && offset < orgLength) {
          text = this.chopInput(text, 1);
          offset++;
          for (j = 0; j < currModePatternsLength; j++) {
            const currConfig2 = patternIdxToConfig[j];
            const currPattern = currConfig2.pattern;
            const singleCharCode = currConfig2.short;
            if (singleCharCode !== false) {
              if (orgText.charCodeAt(offset) === singleCharCode) {
                foundResyncPoint = true;
              }
            } else if (currConfig2.isCustom === true) {
              foundResyncPoint = currPattern.exec(orgText, offset, matchedTokens, groups) !== null;
            } else {
              this.updateLastIndex(currPattern, offset);
              foundResyncPoint = currPattern.exec(text) !== null;
            }
            if (foundResyncPoint === true) {
              break;
            }
          }
        }
        errLength = offset - errorStartOffset;
        msg = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(orgText, errorStartOffset, errLength, errorLine, errorColumn);
        errors.push({
          offset: errorStartOffset,
          line: errorLine,
          column: errorColumn,
          length: errLength,
          message: msg
        });
        if (recoveryEnabled === false) {
          break;
        }
      }
    }
    if (!this.hasCustom) {
      matchedTokens.length = matchedTokensIndex;
    }
    return {
      tokens: matchedTokens,
      groups,
      errors
    };
  }
  handleModes(config, pop_mode, push_mode, newToken) {
    if (config.pop === true) {
      const pushMode = config.push;
      pop_mode(newToken);
      if (pushMode !== void 0) {
        push_mode.call(this, pushMode);
      }
    } else if (config.push !== void 0) {
      push_mode.call(this, config.push);
    }
  }
  chopInput(text, length) {
    return text.substring(length);
  }
  updateLastIndex(regExp, newLastIndex) {
    regExp.lastIndex = newLastIndex;
  }
  // TODO: decrease this under 600 characters? inspect stripping comments option in TSC compiler
  updateTokenEndLineColumnLocation(newToken, group, lastLTIdx, numOfLTsInMatch, line, column, imageLength) {
    let lastCharIsLT, fixForEndingInLT;
    if (group !== void 0) {
      lastCharIsLT = lastLTIdx === imageLength - 1;
      fixForEndingInLT = lastCharIsLT ? -1 : 0;
      if (!(numOfLTsInMatch === 1 && lastCharIsLT === true)) {
        newToken.endLine = line + fixForEndingInLT;
        newToken.endColumn = column - 1 + -fixForEndingInLT;
      }
    }
  }
  computeNewColumn(oldColumn, imageLength) {
    return oldColumn + imageLength;
  }
  createOffsetOnlyToken(image, startOffset, tokenTypeIdx, tokenType) {
    return {
      image,
      startOffset,
      tokenTypeIdx,
      tokenType
    };
  }
  createStartOnlyToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn) {
    return {
      image,
      startOffset,
      startLine,
      startColumn,
      tokenTypeIdx,
      tokenType
    };
  }
  createFullToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn, imageLength) {
    return {
      image,
      startOffset,
      endOffset: startOffset + imageLength - 1,
      startLine,
      endLine: startLine,
      startColumn,
      endColumn: startColumn + imageLength - 1,
      tokenTypeIdx,
      tokenType
    };
  }
  addTokenUsingPush(tokenVector, index, tokenToAdd) {
    tokenVector.push(tokenToAdd);
    return index;
  }
  addTokenUsingMemberAccess(tokenVector, index, tokenToAdd) {
    tokenVector[index] = tokenToAdd;
    index++;
    return index;
  }
  handlePayloadNoCustom(token, payload) {
  }
  handlePayloadWithCustom(token, payload) {
    if (payload !== null) {
      token.payload = payload;
    }
  }
  matchWithTest(pattern, text, offset) {
    const found = pattern.test(text);
    if (found === true) {
      return text.substring(offset, pattern.lastIndex);
    }
    return null;
  }
  matchWithExec(pattern, text) {
    const regExpArray = pattern.exec(text);
    return regExpArray !== null ? regExpArray[0] : null;
  }
};
Lexer.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";
Lexer.NA = /NOT_APPLICABLE/;

// node_modules/chevrotain/lib/src/scan/tokens_public.js
function tokenLabel2(tokType) {
  if (hasTokenLabel2(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
function hasTokenLabel2(obj) {
  return isString_default(obj.LABEL) && obj.LABEL !== "";
}
var PARENT = "parent";
var CATEGORIES = "categories";
var LABEL = "label";
var GROUP = "group";
var PUSH_MODE = "push_mode";
var POP_MODE = "pop_mode";
var LONGER_ALT = "longer_alt";
var LINE_BREAKS = "line_breaks";
var START_CHARS_HINT = "start_chars_hint";
function createToken(config) {
  return createTokenInternal(config);
}
function createTokenInternal(config) {
  const pattern = config.pattern;
  const tokenType = {};
  tokenType.name = config.name;
  if (!isUndefined_default(pattern)) {
    tokenType.PATTERN = pattern;
  }
  if (has_default(config, PARENT)) {
    throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.";
  }
  if (has_default(config, CATEGORIES)) {
    tokenType.CATEGORIES = config[CATEGORIES];
  }
  augmentTokenTypes([tokenType]);
  if (has_default(config, LABEL)) {
    tokenType.LABEL = config[LABEL];
  }
  if (has_default(config, GROUP)) {
    tokenType.GROUP = config[GROUP];
  }
  if (has_default(config, POP_MODE)) {
    tokenType.POP_MODE = config[POP_MODE];
  }
  if (has_default(config, PUSH_MODE)) {
    tokenType.PUSH_MODE = config[PUSH_MODE];
  }
  if (has_default(config, LONGER_ALT)) {
    tokenType.LONGER_ALT = config[LONGER_ALT];
  }
  if (has_default(config, LINE_BREAKS)) {
    tokenType.LINE_BREAKS = config[LINE_BREAKS];
  }
  if (has_default(config, START_CHARS_HINT)) {
    tokenType.START_CHARS_HINT = config[START_CHARS_HINT];
  }
  return tokenType;
}
var EOF = createToken({ name: "EOF", pattern: Lexer.NA });
augmentTokenTypes([EOF]);
function createTokenInstance(tokType, image, startOffset, endOffset, startLine, endLine, startColumn, endColumn) {
  return {
    image,
    startOffset,
    endOffset,
    startLine,
    endLine,
    startColumn,
    endColumn,
    tokenTypeIdx: tokType.tokenTypeIdx,
    tokenType: tokType
  };
}
function tokenMatcher(token, tokType) {
  return tokenStructuredMatcher(token, tokType);
}

// node_modules/chevrotain/lib/src/parse/errors_public.js
var defaultParserErrorProvider = {
  buildMismatchTokenMessage({ expected, actual, previous, ruleName }) {
    const hasLabel = hasTokenLabel2(expected);
    const expectedMsg = hasLabel ? `--> ${tokenLabel2(expected)} <--` : `token of type --> ${expected.name} <--`;
    const msg = `Expecting ${expectedMsg} but found --> '${actual.image}' <--`;
    return msg;
  },
  buildNotAllInputParsedMessage({ firstRedundant, ruleName }) {
    return "Redundant input, expecting EOF but found: " + firstRedundant.image;
  },
  buildNoViableAltMessage({ expectedPathsPerAlt, actual, previous, customUserDescription, ruleName }) {
    const errPrefix = "Expecting: ";
    const actualText = head_default(actual).image;
    const errSuffix = "\nbut found: '" + actualText + "'";
    if (customUserDescription) {
      return errPrefix + customUserDescription + errSuffix;
    } else {
      const allLookAheadPaths = reduce_default(expectedPathsPerAlt, (result, currAltPaths) => result.concat(currAltPaths), []);
      const nextValidTokenSequences = map_default(allLookAheadPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(", ")}]`);
      const nextValidSequenceItems = map_default(nextValidTokenSequences, (itemMsg, idx) => `  ${idx + 1}. ${itemMsg}`);
      const calculatedDescription = `one of these possible Token sequences:
${nextValidSequenceItems.join("\n")}`;
      return errPrefix + calculatedDescription + errSuffix;
    }
  },
  buildEarlyExitMessage({ expectedIterationPaths, actual, customUserDescription, ruleName }) {
    const errPrefix = "Expecting: ";
    const actualText = head_default(actual).image;
    const errSuffix = "\nbut found: '" + actualText + "'";
    if (customUserDescription) {
      return errPrefix + customUserDescription + errSuffix;
    } else {
      const nextValidTokenSequences = map_default(expectedIterationPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(",")}]`);
      const calculatedDescription = `expecting at least one iteration which starts with one of these possible Token sequences::
  <${nextValidTokenSequences.join(" ,")}>`;
      return errPrefix + calculatedDescription + errSuffix;
    }
  }
};
Object.freeze(defaultParserErrorProvider);
var defaultGrammarResolverErrorProvider = {
  buildRuleNotFoundError(topLevelRule, undefinedRule) {
    const msg = "Invalid grammar, reference to a rule which is not defined: ->" + undefinedRule.nonTerminalName + "<-\ninside top level rule: ->" + topLevelRule.name + "<-";
    return msg;
  }
};
var defaultGrammarValidatorErrorProvider = {
  buildDuplicateFoundError(topLevelRule, duplicateProds) {
    function getExtraProductionArgument2(prod) {
      if (prod instanceof Terminal) {
        return prod.terminalType.name;
      } else if (prod instanceof NonTerminal) {
        return prod.nonTerminalName;
      } else {
        return "";
      }
    }
    const topLevelName = topLevelRule.name;
    const duplicateProd = head_default(duplicateProds);
    const index = duplicateProd.idx;
    const dslName = getProductionDslName(duplicateProd);
    const extraArgument = getExtraProductionArgument2(duplicateProd);
    const hasExplicitIndex = index > 0;
    let msg = `->${dslName}${hasExplicitIndex ? index : ""}<- ${extraArgument ? `with argument: ->${extraArgument}<-` : ""}
                  appears more than once (${duplicateProds.length} times) in the top level rule: ->${topLevelName}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
    msg = msg.replace(/[ \t]+/g, " ");
    msg = msg.replace(/\s\s+/g, "\n");
    return msg;
  },
  buildNamespaceConflictError(rule) {
    const errMsg = `Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${rule.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;
    return errMsg;
  },
  buildAlternationPrefixAmbiguityError(options) {
    const pathMsg = map_default(options.prefixPath, (currTok) => tokenLabel2(currTok)).join(", ");
    const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
    const errMsg = `Ambiguous alternatives: <${options.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;
    return errMsg;
  },
  buildAlternationAmbiguityError(options) {
    const pathMsg = map_default(options.prefixPath, (currtok) => tokenLabel2(currtok)).join(", ");
    const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
    let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(" ,")}> in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
`;
    currMessage = currMessage + `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;
    return currMessage;
  },
  buildEmptyRepetitionError(options) {
    let dslName = getProductionDslName(options.repetition);
    if (options.repetition.idx !== 0) {
      dslName += options.repetition.idx;
    }
    const errMsg = `The repetition <${dslName}> within Rule <${options.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;
    return errMsg;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildTokenNameError(options) {
    return "deprecated";
  },
  buildEmptyAlternationError(options) {
    const errMsg = `Ambiguous empty alternative: <${options.emptyChoiceIdx + 1}> in <OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;
    return errMsg;
  },
  buildTooManyAlternativesError(options) {
    const errMsg = `An Alternation cannot have more than 256 alternatives:
<OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
 has ${options.alternation.definition.length + 1} alternatives.`;
    return errMsg;
  },
  buildLeftRecursionError(options) {
    const ruleName = options.topLevelRule.name;
    const pathNames = map_default(options.leftRecursionPath, (currRule) => currRule.name);
    const leftRecursivePath = `${ruleName} --> ${pathNames.concat([ruleName]).join(" --> ")}`;
    const errMsg = `Left Recursion found in grammar.
rule: <${ruleName}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${leftRecursivePath}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;
    return errMsg;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildInvalidRuleNameError(options) {
    return "deprecated";
  },
  buildDuplicateRuleNameError(options) {
    let ruleName;
    if (options.topLevelRule instanceof Rule) {
      ruleName = options.topLevelRule.name;
    } else {
      ruleName = options.topLevelRule;
    }
    const errMsg = `Duplicate definition, rule: ->${ruleName}<- is already defined in the grammar: ->${options.grammarName}<-`;
    return errMsg;
  }
};

// node_modules/chevrotain/lib/src/parse/grammar/resolver.js
function resolveGrammar(topLevels, errMsgProvider) {
  const refResolver = new GastRefResolverVisitor(topLevels, errMsgProvider);
  refResolver.resolveRefs();
  return refResolver.errors;
}
var GastRefResolverVisitor = class extends GAstVisitor {
  constructor(nameToTopRule, errMsgProvider) {
    super();
    this.nameToTopRule = nameToTopRule;
    this.errMsgProvider = errMsgProvider;
    this.errors = [];
  }
  resolveRefs() {
    forEach_default(values_default(this.nameToTopRule), (prod) => {
      this.currTopLevel = prod;
      prod.accept(this);
    });
  }
  visitNonTerminal(node) {
    const ref = this.nameToTopRule[node.nonTerminalName];
    if (!ref) {
      const msg = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, node);
      this.errors.push({
        message: msg,
        type: ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,
        ruleName: this.currTopLevel.name,
        unresolvedRefName: node.nonTerminalName
      });
    } else {
      node.referencedRule = ref;
    }
  }
};

// node_modules/chevrotain/lib/src/parse/grammar/interpreter.js
var AbstractNextPossibleTokensWalker = class extends RestWalker {
  constructor(topProd, path) {
    super();
    this.topProd = topProd;
    this.path = path;
    this.possibleTokTypes = [];
    this.nextProductionName = "";
    this.nextProductionOccurrence = 0;
    this.found = false;
    this.isAtEndOfPath = false;
  }
  startWalking() {
    this.found = false;
    if (this.path.ruleStack[0] !== this.topProd.name) {
      throw Error("The path does not start with the walker's top Rule!");
    }
    this.ruleStack = clone_default(this.path.ruleStack).reverse();
    this.occurrenceStack = clone_default(this.path.occurrenceStack).reverse();
    this.ruleStack.pop();
    this.occurrenceStack.pop();
    this.updateExpectedNext();
    this.walk(this.topProd);
    return this.possibleTokTypes;
  }
  walk(prod, prevRest = []) {
    if (!this.found) {
      super.walk(prod, prevRest);
    }
  }
  walkProdRef(refProd, currRest, prevRest) {
    if (refProd.referencedRule.name === this.nextProductionName && refProd.idx === this.nextProductionOccurrence) {
      const fullRest = currRest.concat(prevRest);
      this.updateExpectedNext();
      this.walk(refProd.referencedRule, fullRest);
    }
  }
  updateExpectedNext() {
    if (isEmpty_default(this.ruleStack)) {
      this.nextProductionName = "";
      this.nextProductionOccurrence = 0;
      this.isAtEndOfPath = true;
    } else {
      this.nextProductionName = this.ruleStack.pop();
      this.nextProductionOccurrence = this.occurrenceStack.pop();
    }
  }
};
var NextAfterTokenWalker = class extends AbstractNextPossibleTokensWalker {
  constructor(topProd, path) {
    super(topProd, path);
    this.path = path;
    this.nextTerminalName = "";
    this.nextTerminalOccurrence = 0;
    this.nextTerminalName = this.path.lastTok.name;
    this.nextTerminalOccurrence = this.path.lastTokOccurrence;
  }
  walkTerminal(terminal, currRest, prevRest) {
    if (this.isAtEndOfPath && terminal.terminalType.name === this.nextTerminalName && terminal.idx === this.nextTerminalOccurrence && !this.found) {
      const fullRest = currRest.concat(prevRest);
      const restProd = new Alternative({ definition: fullRest });
      this.possibleTokTypes = first(restProd);
      this.found = true;
    }
  }
};
var AbstractNextTerminalAfterProductionWalker = class extends RestWalker {
  constructor(topRule, occurrence) {
    super();
    this.topRule = topRule;
    this.occurrence = occurrence;
    this.result = {
      token: void 0,
      occurrence: void 0,
      isEndOfRule: void 0
    };
  }
  startWalking() {
    this.walk(this.topRule);
    return this.result;
  }
};
var NextTerminalAfterManyWalker = class extends AbstractNextTerminalAfterProductionWalker {
  walkMany(manyProd, currRest, prevRest) {
    if (manyProd.idx === this.occurrence) {
      const firstAfterMany = head_default(currRest.concat(prevRest));
      this.result.isEndOfRule = firstAfterMany === void 0;
      if (firstAfterMany instanceof Terminal) {
        this.result.token = firstAfterMany.terminalType;
        this.result.occurrence = firstAfterMany.idx;
      }
    } else {
      super.walkMany(manyProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterManySepWalker = class extends AbstractNextTerminalAfterProductionWalker {
  walkManySep(manySepProd, currRest, prevRest) {
    if (manySepProd.idx === this.occurrence) {
      const firstAfterManySep = head_default(currRest.concat(prevRest));
      this.result.isEndOfRule = firstAfterManySep === void 0;
      if (firstAfterManySep instanceof Terminal) {
        this.result.token = firstAfterManySep.terminalType;
        this.result.occurrence = firstAfterManySep.idx;
      }
    } else {
      super.walkManySep(manySepProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterAtLeastOneWalker = class extends AbstractNextTerminalAfterProductionWalker {
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    if (atLeastOneProd.idx === this.occurrence) {
      const firstAfterAtLeastOne = head_default(currRest.concat(prevRest));
      this.result.isEndOfRule = firstAfterAtLeastOne === void 0;
      if (firstAfterAtLeastOne instanceof Terminal) {
        this.result.token = firstAfterAtLeastOne.terminalType;
        this.result.occurrence = firstAfterAtLeastOne.idx;
      }
    } else {
      super.walkAtLeastOne(atLeastOneProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterAtLeastOneSepWalker = class extends AbstractNextTerminalAfterProductionWalker {
  walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest) {
    if (atleastOneSepProd.idx === this.occurrence) {
      const firstAfterfirstAfterAtLeastOneSep = head_default(currRest.concat(prevRest));
      this.result.isEndOfRule = firstAfterfirstAfterAtLeastOneSep === void 0;
      if (firstAfterfirstAfterAtLeastOneSep instanceof Terminal) {
        this.result.token = firstAfterfirstAfterAtLeastOneSep.terminalType;
        this.result.occurrence = firstAfterfirstAfterAtLeastOneSep.idx;
      }
    } else {
      super.walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest);
    }
  }
};
function possiblePathsFrom(targetDef, maxLength, currPath = []) {
  currPath = clone_default(currPath);
  let result = [];
  let i = 0;
  function remainingPathWith(nextDef) {
    return nextDef.concat(drop_default(targetDef, i + 1));
  }
  function getAlternativesForProd(definition) {
    const alternatives = possiblePathsFrom(remainingPathWith(definition), maxLength, currPath);
    return result.concat(alternatives);
  }
  while (currPath.length < maxLength && i < targetDef.length) {
    const prod = targetDef[i];
    if (prod instanceof Alternative) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof NonTerminal) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof Option) {
      result = getAlternativesForProd(prod.definition);
    } else if (prod instanceof RepetitionMandatory) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const newDef = [
        new Alternative({ definition: prod.definition }),
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ];
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionWithSeparator) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Repetition) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Alternation) {
      forEach_default(prod.definition, (currAlt) => {
        if (isEmpty_default(currAlt.definition) === false) {
          result = getAlternativesForProd(currAlt.definition);
        }
      });
      return result;
    } else if (prod instanceof Terminal) {
      currPath.push(prod.terminalType);
    } else {
      throw Error("non exhaustive match");
    }
    i++;
  }
  result.push({
    partialPath: currPath,
    suffixDef: drop_default(targetDef, i)
  });
  return result;
}
function nextPossibleTokensAfter(initialDef, tokenVector, tokMatcher, maxLookAhead) {
  const EXIT_NON_TERMINAL = "EXIT_NONE_TERMINAL";
  const EXIT_NON_TERMINAL_ARR = [EXIT_NON_TERMINAL];
  const EXIT_ALTERNATIVE = "EXIT_ALTERNATIVE";
  let foundCompletePath = false;
  const tokenVectorLength = tokenVector.length;
  const minimalAlternativesIndex = tokenVectorLength - maxLookAhead - 1;
  const result = [];
  const possiblePaths = [];
  possiblePaths.push({
    idx: -1,
    def: initialDef,
    ruleStack: [],
    occurrenceStack: []
  });
  while (!isEmpty_default(possiblePaths)) {
    const currPath = possiblePaths.pop();
    if (currPath === EXIT_ALTERNATIVE) {
      if (foundCompletePath && last_default(possiblePaths).idx <= minimalAlternativesIndex) {
        possiblePaths.pop();
      }
      continue;
    }
    const currDef = currPath.def;
    const currIdx = currPath.idx;
    const currRuleStack = currPath.ruleStack;
    const currOccurrenceStack = currPath.occurrenceStack;
    if (isEmpty_default(currDef)) {
      continue;
    }
    const prod = currDef[0];
    if (prod === EXIT_NON_TERMINAL) {
      const nextPath = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: dropRight_default(currRuleStack),
        occurrenceStack: dropRight_default(currOccurrenceStack)
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Terminal) {
      if (currIdx < tokenVectorLength - 1) {
        const nextIdx = currIdx + 1;
        const actualToken = tokenVector[nextIdx];
        if (tokMatcher(actualToken, prod.terminalType)) {
          const nextPath = {
            idx: nextIdx,
            def: drop_default(currDef),
            ruleStack: currRuleStack,
            occurrenceStack: currOccurrenceStack
          };
          possiblePaths.push(nextPath);
        }
      } else if (currIdx === tokenVectorLength - 1) {
        result.push({
          nextTokenType: prod.terminalType,
          nextTokenOccurrence: prod.idx,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        });
        foundCompletePath = true;
      } else {
        throw Error("non exhaustive match");
      }
    } else if (prod instanceof NonTerminal) {
      const newRuleStack = clone_default(currRuleStack);
      newRuleStack.push(prod.nonTerminalName);
      const newOccurrenceStack = clone_default(currOccurrenceStack);
      newOccurrenceStack.push(prod.idx);
      const nextPath = {
        idx: currIdx,
        def: prod.definition.concat(EXIT_NON_TERMINAL_ARR, drop_default(currDef)),
        ruleStack: newRuleStack,
        occurrenceStack: newOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Option) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nextPathWith = {
        idx: currIdx,
        def: prod.definition.concat(drop_default(currDef)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof RepetitionMandatory) {
      const secondIteration = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const secondIteration = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionWithSeparator) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const nthRepetition = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Repetition) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nthRepetition = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Alternation) {
      for (let i = prod.definition.length - 1; i >= 0; i--) {
        const currAlt = prod.definition[i];
        const currAltPath = {
          idx: currIdx,
          def: currAlt.definition.concat(drop_default(currDef)),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(currAltPath);
        possiblePaths.push(EXIT_ALTERNATIVE);
      }
    } else if (prod instanceof Alternative) {
      possiblePaths.push({
        idx: currIdx,
        def: prod.definition.concat(drop_default(currDef)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      });
    } else if (prod instanceof Rule) {
      possiblePaths.push(expandTopLevelRule(prod, currIdx, currRuleStack, currOccurrenceStack));
    } else {
      throw Error("non exhaustive match");
    }
  }
  return result;
}
function expandTopLevelRule(topRule, currIdx, currRuleStack, currOccurrenceStack) {
  const newRuleStack = clone_default(currRuleStack);
  newRuleStack.push(topRule.name);
  const newCurrOccurrenceStack = clone_default(currOccurrenceStack);
  newCurrOccurrenceStack.push(1);
  return {
    idx: currIdx,
    def: topRule.definition,
    ruleStack: newRuleStack,
    occurrenceStack: newCurrOccurrenceStack
  };
}

// node_modules/chevrotain/lib/src/parse/grammar/lookahead.js
var PROD_TYPE;
(function(PROD_TYPE2) {
  PROD_TYPE2[PROD_TYPE2["OPTION"] = 0] = "OPTION";
  PROD_TYPE2[PROD_TYPE2["REPETITION"] = 1] = "REPETITION";
  PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY"] = 2] = "REPETITION_MANDATORY";
  PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY_WITH_SEPARATOR"] = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR";
  PROD_TYPE2[PROD_TYPE2["REPETITION_WITH_SEPARATOR"] = 4] = "REPETITION_WITH_SEPARATOR";
  PROD_TYPE2[PROD_TYPE2["ALTERNATION"] = 5] = "ALTERNATION";
})(PROD_TYPE || (PROD_TYPE = {}));
function getProdType(prod) {
  if (prod instanceof Option || prod === "Option") {
    return PROD_TYPE.OPTION;
  } else if (prod instanceof Repetition || prod === "Repetition") {
    return PROD_TYPE.REPETITION;
  } else if (prod instanceof RepetitionMandatory || prod === "RepetitionMandatory") {
    return PROD_TYPE.REPETITION_MANDATORY;
  } else if (prod instanceof RepetitionMandatoryWithSeparator || prod === "RepetitionMandatoryWithSeparator") {
    return PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR;
  } else if (prod instanceof RepetitionWithSeparator || prod === "RepetitionWithSeparator") {
    return PROD_TYPE.REPETITION_WITH_SEPARATOR;
  } else if (prod instanceof Alternation || prod === "Alternation") {
    return PROD_TYPE.ALTERNATION;
  } else {
    throw Error("non exhaustive match");
  }
}
function buildLookaheadFuncForOr(occurrence, ruleGrammar, maxLookahead, hasPredicates, dynamicTokensEnabled, laFuncBuilder) {
  const lookAheadPaths = getLookaheadPathsForOr(occurrence, ruleGrammar, maxLookahead);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return laFuncBuilder(lookAheadPaths, hasPredicates, tokenMatcher2, dynamicTokensEnabled);
}
function buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, k, dynamicTokensEnabled, prodType, lookaheadBuilder) {
  const lookAheadPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return lookaheadBuilder(lookAheadPaths[0], tokenMatcher2, dynamicTokensEnabled);
}
function buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher2, dynamicTokensEnabled) {
  const numOfAlts = alts.length;
  const areAllOneTokenLookahead = every_default(alts, (currAlt) => {
    return every_default(currAlt, (currPath) => {
      return currPath.length === 1;
    });
  });
  if (hasPredicates) {
    return function(orAlts) {
      const predicates = map_default(orAlts, (currAlt) => currAlt.GATE);
      for (let t2 = 0; t2 < numOfAlts; t2++) {
        const currAlt = alts[t2];
        const currNumOfPaths = currAlt.length;
        const currPredicate = predicates[t2];
        if (currPredicate !== void 0 && currPredicate.call(this) === false) {
          continue;
        }
        nextPath:
          for (let j = 0; j < currNumOfPaths; j++) {
            const currPath = currAlt[j];
            const currPathLength = currPath.length;
            for (let i = 0; i < currPathLength; i++) {
              const nextToken = this.LA(i + 1);
              if (tokenMatcher2(nextToken, currPath[i]) === false) {
                continue nextPath;
              }
            }
            return t2;
          }
      }
      return void 0;
    };
  } else if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokenAlts = map_default(alts, (currAlt) => {
      return flatten_default(currAlt);
    });
    const choiceToAlt = reduce_default(singleTokenAlts, (result, currAlt, idx) => {
      forEach_default(currAlt, (currTokType) => {
        if (!has_default(result, currTokType.tokenTypeIdx)) {
          result[currTokType.tokenTypeIdx] = idx;
        }
        forEach_default(currTokType.categoryMatches, (currExtendingType) => {
          if (!has_default(result, currExtendingType)) {
            result[currExtendingType] = idx;
          }
        });
      });
      return result;
    }, {});
    return function() {
      const nextToken = this.LA(1);
      return choiceToAlt[nextToken.tokenTypeIdx];
    };
  } else {
    return function() {
      for (let t2 = 0; t2 < numOfAlts; t2++) {
        const currAlt = alts[t2];
        const currNumOfPaths = currAlt.length;
        nextPath:
          for (let j = 0; j < currNumOfPaths; j++) {
            const currPath = currAlt[j];
            const currPathLength = currPath.length;
            for (let i = 0; i < currPathLength; i++) {
              const nextToken = this.LA(i + 1);
              if (tokenMatcher2(nextToken, currPath[i]) === false) {
                continue nextPath;
              }
            }
            return t2;
          }
      }
      return void 0;
    };
  }
}
function buildSingleAlternativeLookaheadFunction(alt, tokenMatcher2, dynamicTokensEnabled) {
  const areAllOneTokenLookahead = every_default(alt, (currPath) => {
    return currPath.length === 1;
  });
  const numOfPaths = alt.length;
  if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokensTypes = flatten_default(alt);
    if (singleTokensTypes.length === 1 && isEmpty_default(singleTokensTypes[0].categoryMatches)) {
      const expectedTokenType = singleTokensTypes[0];
      const expectedTokenUniqueKey = expectedTokenType.tokenTypeIdx;
      return function() {
        return this.LA(1).tokenTypeIdx === expectedTokenUniqueKey;
      };
    } else {
      const choiceToAlt = reduce_default(singleTokensTypes, (result, currTokType, idx) => {
        result[currTokType.tokenTypeIdx] = true;
        forEach_default(currTokType.categoryMatches, (currExtendingType) => {
          result[currExtendingType] = true;
        });
        return result;
      }, []);
      return function() {
        const nextToken = this.LA(1);
        return choiceToAlt[nextToken.tokenTypeIdx] === true;
      };
    }
  } else {
    return function() {
      nextPath:
        for (let j = 0; j < numOfPaths; j++) {
          const currPath = alt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return true;
        }
      return false;
    };
  }
}
var RestDefinitionFinderWalker = class extends RestWalker {
  constructor(topProd, targetOccurrence, targetProdType) {
    super();
    this.topProd = topProd;
    this.targetOccurrence = targetOccurrence;
    this.targetProdType = targetProdType;
  }
  startWalking() {
    this.walk(this.topProd);
    return this.restDef;
  }
  checkIsTarget(node, expectedProdType, currRest, prevRest) {
    if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdType) {
      this.restDef = currRest.concat(prevRest);
      return true;
    }
    return false;
  }
  walkOption(optionProd, currRest, prevRest) {
    if (!this.checkIsTarget(optionProd, PROD_TYPE.OPTION, currRest, prevRest)) {
      super.walkOption(optionProd, currRest, prevRest);
    }
  }
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    if (!this.checkIsTarget(atLeastOneProd, PROD_TYPE.REPETITION_MANDATORY, currRest, prevRest)) {
      super.walkOption(atLeastOneProd, currRest, prevRest);
    }
  }
  walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
    if (!this.checkIsTarget(atLeastOneSepProd, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currRest, prevRest)) {
      super.walkOption(atLeastOneSepProd, currRest, prevRest);
    }
  }
  walkMany(manyProd, currRest, prevRest) {
    if (!this.checkIsTarget(manyProd, PROD_TYPE.REPETITION, currRest, prevRest)) {
      super.walkOption(manyProd, currRest, prevRest);
    }
  }
  walkManySep(manySepProd, currRest, prevRest) {
    if (!this.checkIsTarget(manySepProd, PROD_TYPE.REPETITION_WITH_SEPARATOR, currRest, prevRest)) {
      super.walkOption(manySepProd, currRest, prevRest);
    }
  }
};
var InsideDefinitionFinderVisitor = class extends GAstVisitor {
  constructor(targetOccurrence, targetProdType, targetRef) {
    super();
    this.targetOccurrence = targetOccurrence;
    this.targetProdType = targetProdType;
    this.targetRef = targetRef;
    this.result = [];
  }
  checkIsTarget(node, expectedProdName) {
    if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdName && (this.targetRef === void 0 || node === this.targetRef)) {
      this.result = node.definition;
    }
  }
  visitOption(node) {
    this.checkIsTarget(node, PROD_TYPE.OPTION);
  }
  visitRepetition(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION);
  }
  visitRepetitionMandatory(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY);
  }
  visitRepetitionMandatoryWithSeparator(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
  }
  visitRepetitionWithSeparator(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_WITH_SEPARATOR);
  }
  visitAlternation(node) {
    this.checkIsTarget(node, PROD_TYPE.ALTERNATION);
  }
};
function initializeArrayOfArrays(size) {
  const result = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = [];
  }
  return result;
}
function pathToHashKeys(path) {
  let keys2 = [""];
  for (let i = 0; i < path.length; i++) {
    const tokType = path[i];
    const longerKeys = [];
    for (let j = 0; j < keys2.length; j++) {
      const currShorterKey = keys2[j];
      longerKeys.push(currShorterKey + "_" + tokType.tokenTypeIdx);
      for (let t2 = 0; t2 < tokType.categoryMatches.length; t2++) {
        const categoriesKeySuffix = "_" + tokType.categoryMatches[t2];
        longerKeys.push(currShorterKey + categoriesKeySuffix);
      }
    }
    keys2 = longerKeys;
  }
  return keys2;
}
function isUniquePrefixHash(altKnownPathsKeys, searchPathKeys, idx) {
  for (let currAltIdx = 0; currAltIdx < altKnownPathsKeys.length; currAltIdx++) {
    if (currAltIdx === idx) {
      continue;
    }
    const otherAltKnownPathsKeys = altKnownPathsKeys[currAltIdx];
    for (let searchIdx = 0; searchIdx < searchPathKeys.length; searchIdx++) {
      const searchKey = searchPathKeys[searchIdx];
      if (otherAltKnownPathsKeys[searchKey] === true) {
        return false;
      }
    }
  }
  return true;
}
function lookAheadSequenceFromAlternatives(altsDefs, k) {
  const partialAlts = map_default(altsDefs, (currAlt) => possiblePathsFrom([currAlt], 1));
  const finalResult = initializeArrayOfArrays(partialAlts.length);
  const altsHashes = map_default(partialAlts, (currAltPaths) => {
    const dict = {};
    forEach_default(currAltPaths, (item) => {
      const keys2 = pathToHashKeys(item.partialPath);
      forEach_default(keys2, (currKey) => {
        dict[currKey] = true;
      });
    });
    return dict;
  });
  let newData = partialAlts;
  for (let pathLength = 1; pathLength <= k; pathLength++) {
    const currDataset = newData;
    newData = initializeArrayOfArrays(currDataset.length);
    for (let altIdx = 0; altIdx < currDataset.length; altIdx++) {
      const currAltPathsAndSuffixes = currDataset[altIdx];
      for (let currPathIdx = 0; currPathIdx < currAltPathsAndSuffixes.length; currPathIdx++) {
        const currPathPrefix = currAltPathsAndSuffixes[currPathIdx].partialPath;
        const suffixDef = currAltPathsAndSuffixes[currPathIdx].suffixDef;
        const prefixKeys = pathToHashKeys(currPathPrefix);
        const isUnique = isUniquePrefixHash(altsHashes, prefixKeys, altIdx);
        if (isUnique || isEmpty_default(suffixDef) || currPathPrefix.length === k) {
          const currAltResult = finalResult[altIdx];
          if (containsPath(currAltResult, currPathPrefix) === false) {
            currAltResult.push(currPathPrefix);
            for (let j = 0; j < prefixKeys.length; j++) {
              const currKey = prefixKeys[j];
              altsHashes[altIdx][currKey] = true;
            }
          }
        } else {
          const newPartialPathsAndSuffixes = possiblePathsFrom(suffixDef, pathLength + 1, currPathPrefix);
          newData[altIdx] = newData[altIdx].concat(newPartialPathsAndSuffixes);
          forEach_default(newPartialPathsAndSuffixes, (item) => {
            const prefixKeys2 = pathToHashKeys(item.partialPath);
            forEach_default(prefixKeys2, (key) => {
              altsHashes[altIdx][key] = true;
            });
          });
        }
      }
    }
  }
  return finalResult;
}
function getLookaheadPathsForOr(occurrence, ruleGrammar, k, orProd) {
  const visitor = new InsideDefinitionFinderVisitor(occurrence, PROD_TYPE.ALTERNATION, orProd);
  ruleGrammar.accept(visitor);
  return lookAheadSequenceFromAlternatives(visitor.result, k);
}
function getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k) {
  const insideDefVisitor = new InsideDefinitionFinderVisitor(occurrence, prodType);
  ruleGrammar.accept(insideDefVisitor);
  const insideDef = insideDefVisitor.result;
  const afterDefWalker = new RestDefinitionFinderWalker(ruleGrammar, occurrence, prodType);
  const afterDef = afterDefWalker.startWalking();
  const insideFlat = new Alternative({ definition: insideDef });
  const afterFlat = new Alternative({ definition: afterDef });
  return lookAheadSequenceFromAlternatives([insideFlat, afterFlat], k);
}
function containsPath(alternative, searchPath) {
  compareOtherPath:
    for (let i = 0; i < alternative.length; i++) {
      const otherPath = alternative[i];
      if (otherPath.length !== searchPath.length) {
        continue;
      }
      for (let j = 0; j < otherPath.length; j++) {
        const searchTok = searchPath[j];
        const otherTok = otherPath[j];
        const matchingTokens = searchTok === otherTok || otherTok.categoryMatchesMap[searchTok.tokenTypeIdx] !== void 0;
        if (matchingTokens === false) {
          continue compareOtherPath;
        }
      }
      return true;
    }
  return false;
}
function isStrictPrefixOfPath(prefix, other) {
  return prefix.length < other.length && every_default(prefix, (tokType, idx) => {
    const otherTokType = other[idx];
    return tokType === otherTokType || otherTokType.categoryMatchesMap[tokType.tokenTypeIdx];
  });
}
function areTokenCategoriesNotUsed(lookAheadPaths) {
  return every_default(lookAheadPaths, (singleAltPaths) => every_default(singleAltPaths, (singlePath) => every_default(singlePath, (token) => isEmpty_default(token.categoryMatches))));
}

// node_modules/chevrotain/lib/src/parse/grammar/checks.js
function validateLookahead(options) {
  const lookaheadValidationErrorMessages = options.lookaheadStrategy.validate({
    rules: options.rules,
    tokenTypes: options.tokenTypes,
    grammarName: options.grammarName
  });
  return map_default(lookaheadValidationErrorMessages, (errorMessage) => Object.assign({ type: ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION }, errorMessage));
}
function validateGrammar(topLevels, tokenTypes, errMsgProvider, grammarName) {
  const duplicateErrors = flatMap_default(topLevels, (currTopLevel) => validateDuplicateProductions(currTopLevel, errMsgProvider));
  const termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
  const tooManyAltsErrors = flatMap_default(topLevels, (curRule) => validateTooManyAlts(curRule, errMsgProvider));
  const duplicateRulesError = flatMap_default(topLevels, (curRule) => validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider));
  return duplicateErrors.concat(termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
}
function validateDuplicateProductions(topLevelRule, errMsgProvider) {
  const collectorVisitor2 = new OccurrenceValidationCollector();
  topLevelRule.accept(collectorVisitor2);
  const allRuleProductions = collectorVisitor2.allProductions;
  const productionGroups = groupBy_default(allRuleProductions, identifyProductionForDuplicates);
  const duplicates = pickBy_default(productionGroups, (currGroup) => {
    return currGroup.length > 1;
  });
  const errors = map_default(values_default(duplicates), (currDuplicates) => {
    const firstProd = head_default(currDuplicates);
    const msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
    const dslName = getProductionDslName(firstProd);
    const defError = {
      message: msg,
      type: ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
      ruleName: topLevelRule.name,
      dslName,
      occurrence: firstProd.idx
    };
    const param = getExtraProductionArgument(firstProd);
    if (param) {
      defError.parameter = param;
    }
    return defError;
  });
  return errors;
}
function identifyProductionForDuplicates(prod) {
  return `${getProductionDslName(prod)}_#_${prod.idx}_#_${getExtraProductionArgument(prod)}`;
}
function getExtraProductionArgument(prod) {
  if (prod instanceof Terminal) {
    return prod.terminalType.name;
  } else if (prod instanceof NonTerminal) {
    return prod.nonTerminalName;
  } else {
    return "";
  }
}
var OccurrenceValidationCollector = class extends GAstVisitor {
  constructor() {
    super(...arguments);
    this.allProductions = [];
  }
  visitNonTerminal(subrule) {
    this.allProductions.push(subrule);
  }
  visitOption(option) {
    this.allProductions.push(option);
  }
  visitRepetitionWithSeparator(manySep) {
    this.allProductions.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.allProductions.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.allProductions.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.allProductions.push(many);
  }
  visitAlternation(or) {
    this.allProductions.push(or);
  }
  visitTerminal(terminal) {
    this.allProductions.push(terminal);
  }
};
function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
  const errors = [];
  const occurrences = reduce_default(allRules, (result, curRule) => {
    if (curRule.name === rule.name) {
      return result + 1;
    }
    return result;
  }, 0);
  if (occurrences > 1) {
    const errMsg = errMsgProvider.buildDuplicateRuleNameError({
      topLevelRule: rule,
      grammarName: className
    });
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
      ruleName: rule.name
    });
  }
  return errors;
}
function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
  const errors = [];
  let errMsg;
  if (!includes_default(definedRulesNames, ruleName)) {
    errMsg = `Invalid rule override, rule: ->${ruleName}<- cannot be overridden in the grammar: ->${className}<-as it is not defined in any of the super grammars `;
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
      ruleName
    });
  }
  return errors;
}
function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path = []) {
  const errors = [];
  const nextNonTerminals = getFirstNoneTerminal(currRule.definition);
  if (isEmpty_default(nextNonTerminals)) {
    return [];
  } else {
    const ruleName = topRule.name;
    const foundLeftRecursion = includes_default(nextNonTerminals, topRule);
    if (foundLeftRecursion) {
      errors.push({
        message: errMsgProvider.buildLeftRecursionError({
          topLevelRule: topRule,
          leftRecursionPath: path
        }),
        type: ParserDefinitionErrorType.LEFT_RECURSION,
        ruleName
      });
    }
    const validNextSteps = difference_default(nextNonTerminals, path.concat([topRule]));
    const errorsFromNextSteps = flatMap_default(validNextSteps, (currRefRule) => {
      const newPath = clone_default(path);
      newPath.push(currRefRule);
      return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
    });
    return errors.concat(errorsFromNextSteps);
  }
}
function getFirstNoneTerminal(definition) {
  let result = [];
  if (isEmpty_default(definition)) {
    return result;
  }
  const firstProd = head_default(definition);
  if (firstProd instanceof NonTerminal) {
    result.push(firstProd.referencedRule);
  } else if (firstProd instanceof Alternative || firstProd instanceof Option || firstProd instanceof RepetitionMandatory || firstProd instanceof RepetitionMandatoryWithSeparator || firstProd instanceof RepetitionWithSeparator || firstProd instanceof Repetition) {
    result = result.concat(getFirstNoneTerminal(firstProd.definition));
  } else if (firstProd instanceof Alternation) {
    result = flatten_default(map_default(firstProd.definition, (currSubDef) => getFirstNoneTerminal(currSubDef.definition)));
  } else if (firstProd instanceof Terminal) {
  } else {
    throw Error("non exhaustive match");
  }
  const isFirstOptional = isOptionalProd(firstProd);
  const hasMore = definition.length > 1;
  if (isFirstOptional && hasMore) {
    const rest = drop_default(definition);
    return result.concat(getFirstNoneTerminal(rest));
  } else {
    return result;
  }
}
var OrCollector = class extends GAstVisitor {
  constructor() {
    super(...arguments);
    this.alternations = [];
  }
  visitAlternation(node) {
    this.alternations.push(node);
  }
};
function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = flatMap_default(ors, (currOr) => {
    const exceptLast = dropRight_default(currOr.definition);
    return flatMap_default(exceptLast, (currAlternative, currAltIdx) => {
      const possibleFirstInAlt = nextPossibleTokensAfter([currAlternative], [], tokenStructuredMatcher, 1);
      if (isEmpty_default(possibleFirstInAlt)) {
        return [
          {
            message: errMsgProvider.buildEmptyAlternationError({
              topLevelRule,
              alternation: currOr,
              emptyChoiceIdx: currAltIdx
            }),
            type: ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
            ruleName: topLevelRule.name,
            occurrence: currOr.idx,
            alternative: currAltIdx + 1
          }
        ];
      } else {
        return [];
      }
    });
  });
  return errors;
}
function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  let ors = orCollector.alternations;
  ors = reject_default(ors, (currOr) => currOr.ignoreAmbiguities === true);
  const errors = flatMap_default(ors, (currOr) => {
    const currOccurrence = currOr.idx;
    const actualMaxLookahead = currOr.maxLookahead || globalMaxLookahead;
    const alternatives = getLookaheadPathsForOr(currOccurrence, topLevelRule, actualMaxLookahead, currOr);
    const altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    const altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
  });
  return errors;
}
var RepetitionCollector = class extends GAstVisitor {
  constructor() {
    super(...arguments);
    this.allProductions = [];
  }
  visitRepetitionWithSeparator(manySep) {
    this.allProductions.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.allProductions.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.allProductions.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.allProductions.push(many);
  }
};
function validateTooManyAlts(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = flatMap_default(ors, (currOr) => {
    if (currOr.definition.length > 255) {
      return [
        {
          message: errMsgProvider.buildTooManyAlternativesError({
            topLevelRule,
            alternation: currOr
          }),
          type: ParserDefinitionErrorType.TOO_MANY_ALTS,
          ruleName: topLevelRule.name,
          occurrence: currOr.idx
        }
      ];
    } else {
      return [];
    }
  });
  return errors;
}
function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
  const errors = [];
  forEach_default(topLevelRules, (currTopRule) => {
    const collectorVisitor2 = new RepetitionCollector();
    currTopRule.accept(collectorVisitor2);
    const allRuleProductions = collectorVisitor2.allProductions;
    forEach_default(allRuleProductions, (currProd) => {
      const prodType = getProdType(currProd);
      const actualMaxLookahead = currProd.maxLookahead || maxLookahead;
      const currOccurrence = currProd.idx;
      const paths = getLookaheadPathsForOptionalProd(currOccurrence, currTopRule, prodType, actualMaxLookahead);
      const pathsInsideProduction = paths[0];
      if (isEmpty_default(flatten_default(pathsInsideProduction))) {
        const errMsg = errMsgProvider.buildEmptyRepetitionError({
          topLevelRule: currTopRule,
          repetition: currProd
        });
        errors.push({
          message: errMsg,
          type: ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
          ruleName: currTopRule.name
        });
      }
    });
  });
  return errors;
}
function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const foundAmbiguousPaths = [];
  const identicalAmbiguities = reduce_default(alternatives, (result, currAlt, currAltIdx) => {
    if (alternation.definition[currAltIdx].ignoreAmbiguities === true) {
      return result;
    }
    forEach_default(currAlt, (currPath) => {
      const altsCurrPathAppearsIn = [currAltIdx];
      forEach_default(alternatives, (currOtherAlt, currOtherAltIdx) => {
        if (currAltIdx !== currOtherAltIdx && containsPath(currOtherAlt, currPath) && // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) {
          altsCurrPathAppearsIn.push(currOtherAltIdx);
        }
      });
      if (altsCurrPathAppearsIn.length > 1 && !containsPath(foundAmbiguousPaths, currPath)) {
        foundAmbiguousPaths.push(currPath);
        result.push({
          alts: altsCurrPathAppearsIn,
          path: currPath
        });
      }
    });
    return result;
  }, []);
  const currErrors = map_default(identicalAmbiguities, (currAmbDescriptor) => {
    const ambgIndices = map_default(currAmbDescriptor.alts, (currAltIdx) => currAltIdx + 1);
    const currMessage = errMsgProvider.buildAlternationAmbiguityError({
      topLevelRule: rule,
      alternation,
      ambiguityIndices: ambgIndices,
      prefixPath: currAmbDescriptor.path
    });
    return {
      message: currMessage,
      type: ParserDefinitionErrorType.AMBIGUOUS_ALTS,
      ruleName: rule.name,
      occurrence: alternation.idx,
      alternatives: currAmbDescriptor.alts
    };
  });
  return currErrors;
}
function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const pathsAndIndices = reduce_default(alternatives, (result, currAlt, idx) => {
    const currPathsAndIdx = map_default(currAlt, (currPath) => {
      return { idx, path: currPath };
    });
    return result.concat(currPathsAndIdx);
  }, []);
  const errors = compact_default(flatMap_default(pathsAndIndices, (currPathAndIdx) => {
    const alternativeGast = alternation.definition[currPathAndIdx.idx];
    if (alternativeGast.ignoreAmbiguities === true) {
      return [];
    }
    const targetIdx = currPathAndIdx.idx;
    const targetPath = currPathAndIdx.path;
    const prefixAmbiguitiesPathsAndIndices = filter_default(pathsAndIndices, (searchPathAndIdx) => {
      return (
        // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !== true && searchPathAndIdx.idx < targetIdx && // checking for strict prefix because identical lookaheads
        // will be be detected using a different validation.
        isStrictPrefixOfPath(searchPathAndIdx.path, targetPath)
      );
    });
    const currPathPrefixErrors = map_default(prefixAmbiguitiesPathsAndIndices, (currAmbPathAndIdx) => {
      const ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
      const occurrence = alternation.idx === 0 ? "" : alternation.idx;
      const message = errMsgProvider.buildAlternationPrefixAmbiguityError({
        topLevelRule: rule,
        alternation,
        ambiguityIndices: ambgIndices,
        prefixPath: currAmbPathAndIdx.path
      });
      return {
        message,
        type: ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
        ruleName: rule.name,
        occurrence,
        alternatives: ambgIndices
      };
    });
    return currPathPrefixErrors;
  }));
  return errors;
}
function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
  const errors = [];
  const tokenNames = map_default(tokenTypes, (currToken) => currToken.name);
  forEach_default(topLevels, (currRule) => {
    const currRuleName = currRule.name;
    if (includes_default(tokenNames, currRuleName)) {
      const errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
      errors.push({
        message: errMsg,
        type: ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
        ruleName: currRuleName
      });
    }
  });
  return errors;
}

// node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js
function resolveGrammar2(options) {
  const actualOptions = defaults_default(options, {
    errMsgProvider: defaultGrammarResolverErrorProvider
  });
  const topRulesTable = {};
  forEach_default(options.rules, (rule) => {
    topRulesTable[rule.name] = rule;
  });
  return resolveGrammar(topRulesTable, actualOptions.errMsgProvider);
}
function validateGrammar2(options) {
  options = defaults_default(options, {
    errMsgProvider: defaultGrammarValidatorErrorProvider
  });
  return validateGrammar(options.rules, options.tokenTypes, options.errMsgProvider, options.grammarName);
}

// node_modules/chevrotain/lib/src/parse/exceptions_public.js
var MISMATCHED_TOKEN_EXCEPTION = "MismatchedTokenException";
var NO_VIABLE_ALT_EXCEPTION = "NoViableAltException";
var EARLY_EXIT_EXCEPTION = "EarlyExitException";
var NOT_ALL_INPUT_PARSED_EXCEPTION = "NotAllInputParsedException";
var RECOGNITION_EXCEPTION_NAMES = [
  MISMATCHED_TOKEN_EXCEPTION,
  NO_VIABLE_ALT_EXCEPTION,
  EARLY_EXIT_EXCEPTION,
  NOT_ALL_INPUT_PARSED_EXCEPTION
];
Object.freeze(RECOGNITION_EXCEPTION_NAMES);
function isRecognitionException(error) {
  return includes_default(RECOGNITION_EXCEPTION_NAMES, error.name);
}
var RecognitionException = class extends Error {
  constructor(message, token) {
    super(message);
    this.token = token;
    this.resyncedTokens = [];
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var MismatchedTokenException = class extends RecognitionException {
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = MISMATCHED_TOKEN_EXCEPTION;
  }
};
var NoViableAltException = class extends RecognitionException {
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = NO_VIABLE_ALT_EXCEPTION;
  }
};
var NotAllInputParsedException = class extends RecognitionException {
  constructor(message, token) {
    super(message, token);
    this.name = NOT_ALL_INPUT_PARSED_EXCEPTION;
  }
};
var EarlyExitException = class extends RecognitionException {
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = EARLY_EXIT_EXCEPTION;
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js
var EOF_FOLLOW_KEY = {};
var IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
var InRuleRecoveryException = class extends Error {
  constructor(message) {
    super(message);
    this.name = IN_RULE_RECOVERY_EXCEPTION;
  }
};
var Recoverable = class {
  initRecoverable(config) {
    this.firstAfterRepMap = {};
    this.resyncFollows = {};
    this.recoveryEnabled = has_default(config, "recoveryEnabled") ? config.recoveryEnabled : DEFAULT_PARSER_CONFIG.recoveryEnabled;
    if (this.recoveryEnabled) {
      this.attemptInRepetitionRecovery = attemptInRepetitionRecovery;
    }
  }
  getTokenToInsert(tokType) {
    const tokToInsert = createTokenInstance(tokType, "", NaN, NaN, NaN, NaN, NaN, NaN);
    tokToInsert.isInsertedInRecovery = true;
    return tokToInsert;
  }
  canTokenTypeBeInsertedInRecovery(tokType) {
    return true;
  }
  canTokenTypeBeDeletedInRecovery(tokType) {
    return true;
  }
  tryInRepetitionRecovery(grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
    const reSyncTokType = this.findReSyncTokenType();
    const savedLexerState = this.exportLexerState();
    const resyncedTokens = [];
    let passedResyncPoint = false;
    const nextTokenWithoutResync = this.LA(1);
    let currToken = this.LA(1);
    const generateErrorMessage = () => {
      const previousToken = this.LA(0);
      const msg = this.errorMessageProvider.buildMismatchTokenMessage({
        expected: expectedTokType,
        actual: nextTokenWithoutResync,
        previous: previousToken,
        ruleName: this.getCurrRuleFullName()
      });
      const error = new MismatchedTokenException(msg, nextTokenWithoutResync, this.LA(0));
      error.resyncedTokens = dropRight_default(resyncedTokens);
      this.SAVE_ERROR(error);
    };
    while (!passedResyncPoint) {
      if (this.tokenMatcher(currToken, expectedTokType)) {
        generateErrorMessage();
        return;
      } else if (lookAheadFunc.call(this)) {
        generateErrorMessage();
        grammarRule.apply(this, grammarRuleArgs);
        return;
      } else if (this.tokenMatcher(currToken, reSyncTokType)) {
        passedResyncPoint = true;
      } else {
        currToken = this.SKIP_TOKEN();
        this.addToResyncTokens(currToken, resyncedTokens);
      }
    }
    this.importLexerState(savedLexerState);
  }
  shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck) {
    if (notStuck === false) {
      return false;
    }
    if (this.tokenMatcher(this.LA(1), expectTokAfterLastMatch)) {
      return false;
    }
    if (this.isBackTracking()) {
      return false;
    }
    if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) {
      return false;
    }
    return true;
  }
  // Error Recovery functionality
  getFollowsForInRuleRecovery(tokType, tokIdxInRule) {
    const grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
    const follows = this.getNextPossibleTokenTypes(grammarPath);
    return follows;
  }
  tryInRuleRecovery(expectedTokType, follows) {
    if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) {
      const tokToInsert = this.getTokenToInsert(expectedTokType);
      return tokToInsert;
    }
    if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
      const nextTok = this.SKIP_TOKEN();
      this.consumeToken();
      return nextTok;
    }
    throw new InRuleRecoveryException("sad sad panda");
  }
  canPerformInRuleRecovery(expectedToken, follows) {
    return this.canRecoverWithSingleTokenInsertion(expectedToken, follows) || this.canRecoverWithSingleTokenDeletion(expectedToken);
  }
  canRecoverWithSingleTokenInsertion(expectedTokType, follows) {
    if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) {
      return false;
    }
    if (isEmpty_default(follows)) {
      return false;
    }
    const mismatchedTok = this.LA(1);
    const isMisMatchedTokInFollows = find_default(follows, (possibleFollowsTokType) => {
      return this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
    }) !== void 0;
    return isMisMatchedTokInFollows;
  }
  canRecoverWithSingleTokenDeletion(expectedTokType) {
    if (!this.canTokenTypeBeDeletedInRecovery(expectedTokType)) {
      return false;
    }
    const isNextTokenWhatIsExpected = this.tokenMatcher(this.LA(2), expectedTokType);
    return isNextTokenWhatIsExpected;
  }
  isInCurrentRuleReSyncSet(tokenTypeIdx) {
    const followKey = this.getCurrFollowKey();
    const currentRuleReSyncSet = this.getFollowSetFromFollowKey(followKey);
    return includes_default(currentRuleReSyncSet, tokenTypeIdx);
  }
  findReSyncTokenType() {
    const allPossibleReSyncTokTypes = this.flattenFollowSet();
    let nextToken = this.LA(1);
    let k = 2;
    while (true) {
      const foundMatch = find_default(allPossibleReSyncTokTypes, (resyncTokType) => {
        const canMatch = tokenMatcher(nextToken, resyncTokType);
        return canMatch;
      });
      if (foundMatch !== void 0) {
        return foundMatch;
      }
      nextToken = this.LA(k);
      k++;
    }
  }
  getCurrFollowKey() {
    if (this.RULE_STACK.length === 1) {
      return EOF_FOLLOW_KEY;
    }
    const currRuleShortName = this.getLastExplicitRuleShortName();
    const currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
    const prevRuleShortName = this.getPreviousExplicitRuleShortName();
    return {
      ruleName: this.shortRuleNameToFullName(currRuleShortName),
      idxInCallingRule: currRuleIdx,
      inRule: this.shortRuleNameToFullName(prevRuleShortName)
    };
  }
  buildFullFollowKeyStack() {
    const explicitRuleStack = this.RULE_STACK;
    const explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
    return map_default(explicitRuleStack, (ruleName, idx) => {
      if (idx === 0) {
        return EOF_FOLLOW_KEY;
      }
      return {
        ruleName: this.shortRuleNameToFullName(ruleName),
        idxInCallingRule: explicitOccurrenceStack[idx],
        inRule: this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
      };
    });
  }
  flattenFollowSet() {
    const followStack = map_default(this.buildFullFollowKeyStack(), (currKey) => {
      return this.getFollowSetFromFollowKey(currKey);
    });
    return flatten_default(followStack);
  }
  getFollowSetFromFollowKey(followKey) {
    if (followKey === EOF_FOLLOW_KEY) {
      return [EOF];
    }
    const followName = followKey.ruleName + followKey.idxInCallingRule + IN + followKey.inRule;
    return this.resyncFollows[followName];
  }
  // It does not make any sense to include a virtual EOF token in the list of resynced tokens
  // as EOF does not really exist and thus does not contain any useful information (line/column numbers)
  addToResyncTokens(token, resyncTokens) {
    if (!this.tokenMatcher(token, EOF)) {
      resyncTokens.push(token);
    }
    return resyncTokens;
  }
  reSyncTo(tokType) {
    const resyncedTokens = [];
    let nextTok = this.LA(1);
    while (this.tokenMatcher(nextTok, tokType) === false) {
      nextTok = this.SKIP_TOKEN();
      this.addToResyncTokens(nextTok, resyncedTokens);
    }
    return dropRight_default(resyncedTokens);
  }
  attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
  }
  getCurrentGrammarPath(tokType, tokIdxInRule) {
    const pathRuleStack = this.getHumanReadableRuleStack();
    const pathOccurrenceStack = clone_default(this.RULE_OCCURRENCE_STACK);
    const grammarPath = {
      ruleStack: pathRuleStack,
      occurrenceStack: pathOccurrenceStack,
      lastTok: tokType,
      lastTokOccurrence: tokIdxInRule
    };
    return grammarPath;
  }
  getHumanReadableRuleStack() {
    return map_default(this.RULE_STACK, (currShortName) => this.shortRuleNameToFullName(currShortName));
  }
};
function attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
  const key = this.getKeyForAutomaticLookahead(dslMethodIdx, prodOccurrence);
  let firstAfterRepInfo = this.firstAfterRepMap[key];
  if (firstAfterRepInfo === void 0) {
    const currRuleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[currRuleName];
    const walker = new nextToksWalker(ruleGrammar, prodOccurrence);
    firstAfterRepInfo = walker.startWalking();
    this.firstAfterRepMap[key] = firstAfterRepInfo;
  }
  let expectTokAfterLastMatch = firstAfterRepInfo.token;
  let nextTokIdx = firstAfterRepInfo.occurrence;
  const isEndOfRule = firstAfterRepInfo.isEndOfRule;
  if (this.RULE_STACK.length === 1 && isEndOfRule && expectTokAfterLastMatch === void 0) {
    expectTokAfterLastMatch = EOF;
    nextTokIdx = 1;
  }
  if (expectTokAfterLastMatch === void 0 || nextTokIdx === void 0) {
    return;
  }
  if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck)) {
    this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
  }
}

// node_modules/chevrotain/lib/src/parse/grammar/keys.js
var BITS_FOR_METHOD_TYPE = 4;
var BITS_FOR_OCCURRENCE_IDX = 8;
var BITS_FOR_ALT_IDX = 8;
var OR_IDX = 1 << BITS_FOR_OCCURRENCE_IDX;
var OPTION_IDX = 2 << BITS_FOR_OCCURRENCE_IDX;
var MANY_IDX = 3 << BITS_FOR_OCCURRENCE_IDX;
var AT_LEAST_ONE_IDX = 4 << BITS_FOR_OCCURRENCE_IDX;
var MANY_SEP_IDX = 5 << BITS_FOR_OCCURRENCE_IDX;
var AT_LEAST_ONE_SEP_IDX = 6 << BITS_FOR_OCCURRENCE_IDX;
function getKeyForAutomaticLookahead(ruleIdx, dslMethodIdx, occurrence) {
  return occurrence | dslMethodIdx | ruleIdx;
}
var BITS_START_FOR_ALT_IDX = 32 - BITS_FOR_ALT_IDX;

// node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js
var LLkLookaheadStrategy = class {
  constructor(options) {
    var _a;
    this.maxLookahead = (_a = options === null || options === void 0 ? void 0 : options.maxLookahead) !== null && _a !== void 0 ? _a : DEFAULT_PARSER_CONFIG.maxLookahead;
  }
  validate(options) {
    const leftRecursionErrors = this.validateNoLeftRecursion(options.rules);
    if (isEmpty_default(leftRecursionErrors)) {
      const emptyAltErrors = this.validateEmptyOrAlternatives(options.rules);
      const ambiguousAltsErrors = this.validateAmbiguousAlternationAlternatives(options.rules, this.maxLookahead);
      const emptyRepetitionErrors = this.validateSomeNonEmptyLookaheadPath(options.rules, this.maxLookahead);
      const allErrors = [
        ...leftRecursionErrors,
        ...emptyAltErrors,
        ...ambiguousAltsErrors,
        ...emptyRepetitionErrors
      ];
      return allErrors;
    }
    return leftRecursionErrors;
  }
  validateNoLeftRecursion(rules) {
    return flatMap_default(rules, (currTopRule) => validateNoLeftRecursion(currTopRule, currTopRule, defaultGrammarValidatorErrorProvider));
  }
  validateEmptyOrAlternatives(rules) {
    return flatMap_default(rules, (currTopRule) => validateEmptyOrAlternative(currTopRule, defaultGrammarValidatorErrorProvider));
  }
  validateAmbiguousAlternationAlternatives(rules, maxLookahead) {
    return flatMap_default(rules, (currTopRule) => validateAmbiguousAlternationAlternatives(currTopRule, maxLookahead, defaultGrammarValidatorErrorProvider));
  }
  validateSomeNonEmptyLookaheadPath(rules, maxLookahead) {
    return validateSomeNonEmptyLookaheadPath(rules, maxLookahead, defaultGrammarValidatorErrorProvider);
  }
  buildLookaheadForAlternation(options) {
    return buildLookaheadFuncForOr(options.prodOccurrence, options.rule, options.maxLookahead, options.hasPredicates, options.dynamicTokensEnabled, buildAlternativesLookAheadFunc);
  }
  buildLookaheadForOptional(options) {
    return buildLookaheadFuncForOptionalProd(options.prodOccurrence, options.rule, options.maxLookahead, options.dynamicTokensEnabled, getProdType(options.prodType), buildSingleAlternativeLookaheadFunction);
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js
var LooksAhead = class {
  initLooksAhead(config) {
    this.dynamicTokensEnabled = has_default(config, "dynamicTokensEnabled") ? config.dynamicTokensEnabled : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
    this.maxLookahead = has_default(config, "maxLookahead") ? config.maxLookahead : DEFAULT_PARSER_CONFIG.maxLookahead;
    this.lookaheadStrategy = has_default(config, "lookaheadStrategy") ? config.lookaheadStrategy : new LLkLookaheadStrategy({ maxLookahead: this.maxLookahead });
    this.lookAheadFuncsCache = /* @__PURE__ */ new Map();
  }
  preComputeLookaheadFunctions(rules) {
    forEach_default(rules, (currRule) => {
      this.TRACE_INIT(`${currRule.name} Rule Lookahead`, () => {
        const { alternation, repetition, option, repetitionMandatory, repetitionMandatoryWithSeparator, repetitionWithSeparator } = collectMethods(currRule);
        forEach_default(alternation, (currProd) => {
          const prodIdx = currProd.idx === 0 ? "" : currProd.idx;
          this.TRACE_INIT(`${getProductionDslName(currProd)}${prodIdx}`, () => {
            const laFunc = this.lookaheadStrategy.buildLookaheadForAlternation({
              prodOccurrence: currProd.idx,
              rule: currRule,
              maxLookahead: currProd.maxLookahead || this.maxLookahead,
              hasPredicates: currProd.hasPredicates,
              dynamicTokensEnabled: this.dynamicTokensEnabled
            });
            const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[currRule.name], OR_IDX, currProd.idx);
            this.setLaFuncCache(key, laFunc);
          });
        });
        forEach_default(repetition, (currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, MANY_IDX, "Repetition", currProd.maxLookahead, getProductionDslName(currProd));
        });
        forEach_default(option, (currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, OPTION_IDX, "Option", currProd.maxLookahead, getProductionDslName(currProd));
        });
        forEach_default(repetitionMandatory, (currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_IDX, "RepetitionMandatory", currProd.maxLookahead, getProductionDslName(currProd));
        });
        forEach_default(repetitionMandatoryWithSeparator, (currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_SEP_IDX, "RepetitionMandatoryWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
        });
        forEach_default(repetitionWithSeparator, (currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, MANY_SEP_IDX, "RepetitionWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
        });
      });
    });
  }
  computeLookaheadFunc(rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
    this.TRACE_INIT(`${dslMethodName}${prodOccurrence === 0 ? "" : prodOccurrence}`, () => {
      const laFunc = this.lookaheadStrategy.buildLookaheadForOptional({
        prodOccurrence,
        rule,
        maxLookahead: prodMaxLookahead || this.maxLookahead,
        dynamicTokensEnabled: this.dynamicTokensEnabled,
        prodType
      });
      const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[rule.name], prodKey, prodOccurrence);
      this.setLaFuncCache(key, laFunc);
    });
  }
  // this actually returns a number, but it is always used as a string (object prop key)
  getKeyForAutomaticLookahead(dslMethodIdx, occurrence) {
    const currRuleShortName = this.getLastExplicitRuleShortName();
    return getKeyForAutomaticLookahead(currRuleShortName, dslMethodIdx, occurrence);
  }
  getLaFuncFromCache(key) {
    return this.lookAheadFuncsCache.get(key);
  }
  /* istanbul ignore next */
  setLaFuncCache(key, value) {
    this.lookAheadFuncsCache.set(key, value);
  }
};
var DslMethodsCollectorVisitor = class extends GAstVisitor {
  constructor() {
    super(...arguments);
    this.dslMethods = {
      option: [],
      alternation: [],
      repetition: [],
      repetitionWithSeparator: [],
      repetitionMandatory: [],
      repetitionMandatoryWithSeparator: []
    };
  }
  reset() {
    this.dslMethods = {
      option: [],
      alternation: [],
      repetition: [],
      repetitionWithSeparator: [],
      repetitionMandatory: [],
      repetitionMandatoryWithSeparator: []
    };
  }
  visitOption(option) {
    this.dslMethods.option.push(option);
  }
  visitRepetitionWithSeparator(manySep) {
    this.dslMethods.repetitionWithSeparator.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.dslMethods.repetitionMandatory.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.dslMethods.repetitionMandatoryWithSeparator.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.dslMethods.repetition.push(many);
  }
  visitAlternation(or) {
    this.dslMethods.alternation.push(or);
  }
};
var collectorVisitor = new DslMethodsCollectorVisitor();
function collectMethods(rule) {
  collectorVisitor.reset();
  rule.accept(collectorVisitor);
  const dslMethods = collectorVisitor.dslMethods;
  collectorVisitor.reset();
  return dslMethods;
}

// node_modules/chevrotain/lib/src/parse/cst/cst.js
function setNodeLocationOnlyOffset(currNodeLocation, newLocationInfo) {
  if (isNaN(currNodeLocation.startOffset) === true) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  }
}
function setNodeLocationFull(currNodeLocation, newLocationInfo) {
  if (isNaN(currNodeLocation.startOffset) === true) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.startColumn = newLocationInfo.startColumn;
    currNodeLocation.startLine = newLocationInfo.startLine;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  }
}
function addTerminalToCst(node, token, tokenTypeName) {
  if (node.children[tokenTypeName] === void 0) {
    node.children[tokenTypeName] = [token];
  } else {
    node.children[tokenTypeName].push(token);
  }
}
function addNoneTerminalToCst(node, ruleName, ruleResult) {
  if (node.children[ruleName] === void 0) {
    node.children[ruleName] = [ruleResult];
  } else {
    node.children[ruleName].push(ruleResult);
  }
}

// node_modules/chevrotain/lib/src/lang/lang_extensions.js
var NAME = "name";
function defineNameProp(obj, nameValue) {
  Object.defineProperty(obj, NAME, {
    enumerable: false,
    configurable: true,
    writable: false,
    value: nameValue
  });
}

// node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js
function defaultVisit(ctx, param) {
  const childrenNames = keys_default(ctx);
  const childrenNamesLength = childrenNames.length;
  for (let i = 0; i < childrenNamesLength; i++) {
    const currChildName = childrenNames[i];
    const currChildArray = ctx[currChildName];
    const currChildArrayLength = currChildArray.length;
    for (let j = 0; j < currChildArrayLength; j++) {
      const currChild = currChildArray[j];
      if (currChild.tokenTypeIdx === void 0) {
        this[currChild.name](currChild.children, param);
      }
    }
  }
}
function createBaseSemanticVisitorConstructor(grammarName, ruleNames) {
  const derivedConstructor = function() {
  };
  defineNameProp(derivedConstructor, grammarName + "BaseSemantics");
  const semanticProto = {
    visit: function(cstNode, param) {
      if (isArray_default(cstNode)) {
        cstNode = cstNode[0];
      }
      if (isUndefined_default(cstNode)) {
        return void 0;
      }
      return this[cstNode.name](cstNode.children, param);
    },
    validateVisitor: function() {
      const semanticDefinitionErrors = validateVisitor(this, ruleNames);
      if (!isEmpty_default(semanticDefinitionErrors)) {
        const errorMessages = map_default(semanticDefinitionErrors, (currDefError) => currDefError.msg);
        throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${errorMessages.join("\n\n").replace(/\n/g, "\n	")}`);
      }
    }
  };
  derivedConstructor.prototype = semanticProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  derivedConstructor._RULE_NAMES = ruleNames;
  return derivedConstructor;
}
function createBaseVisitorConstructorWithDefaults(grammarName, ruleNames, baseConstructor) {
  const derivedConstructor = function() {
  };
  defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults");
  const withDefaultsProto = Object.create(baseConstructor.prototype);
  forEach_default(ruleNames, (ruleName) => {
    withDefaultsProto[ruleName] = defaultVisit;
  });
  derivedConstructor.prototype = withDefaultsProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  return derivedConstructor;
}
var CstVisitorDefinitionError;
(function(CstVisitorDefinitionError2) {
  CstVisitorDefinitionError2[CstVisitorDefinitionError2["REDUNDANT_METHOD"] = 0] = "REDUNDANT_METHOD";
  CstVisitorDefinitionError2[CstVisitorDefinitionError2["MISSING_METHOD"] = 1] = "MISSING_METHOD";
})(CstVisitorDefinitionError || (CstVisitorDefinitionError = {}));
function validateVisitor(visitorInstance, ruleNames) {
  const missingErrors = validateMissingCstMethods(visitorInstance, ruleNames);
  return missingErrors;
}
function validateMissingCstMethods(visitorInstance, ruleNames) {
  const missingRuleNames = filter_default(ruleNames, (currRuleName) => {
    return isFunction_default(visitorInstance[currRuleName]) === false;
  });
  const errors = map_default(missingRuleNames, (currRuleName) => {
    return {
      msg: `Missing visitor method: <${currRuleName}> on ${visitorInstance.constructor.name} CST Visitor.`,
      type: CstVisitorDefinitionError.MISSING_METHOD,
      methodName: currRuleName
    };
  });
  return compact_default(errors);
}

// node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js
var TreeBuilder = class {
  initTreeBuilder(config) {
    this.CST_STACK = [];
    this.outputCst = config.outputCst;
    this.nodeLocationTracking = has_default(config, "nodeLocationTracking") ? config.nodeLocationTracking : DEFAULT_PARSER_CONFIG.nodeLocationTracking;
    if (!this.outputCst) {
      this.cstInvocationStateUpdate = noop_default;
      this.cstFinallyStateUpdate = noop_default;
      this.cstPostTerminal = noop_default;
      this.cstPostNonTerminal = noop_default;
      this.cstPostRule = noop_default;
    } else {
      if (/full/i.test(this.nodeLocationTracking)) {
        if (this.recoveryEnabled) {
          this.setNodeLocationFromToken = setNodeLocationFull;
          this.setNodeLocationFromNode = setNodeLocationFull;
          this.cstPostRule = noop_default;
          this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery;
        } else {
          this.setNodeLocationFromToken = noop_default;
          this.setNodeLocationFromNode = noop_default;
          this.cstPostRule = this.cstPostRuleFull;
          this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular;
        }
      } else if (/onlyOffset/i.test(this.nodeLocationTracking)) {
        if (this.recoveryEnabled) {
          this.setNodeLocationFromToken = setNodeLocationOnlyOffset;
          this.setNodeLocationFromNode = setNodeLocationOnlyOffset;
          this.cstPostRule = noop_default;
          this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery;
        } else {
          this.setNodeLocationFromToken = noop_default;
          this.setNodeLocationFromNode = noop_default;
          this.cstPostRule = this.cstPostRuleOnlyOffset;
          this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular;
        }
      } else if (/none/i.test(this.nodeLocationTracking)) {
        this.setNodeLocationFromToken = noop_default;
        this.setNodeLocationFromNode = noop_default;
        this.cstPostRule = noop_default;
        this.setInitialNodeLocation = noop_default;
      } else {
        throw Error(`Invalid <nodeLocationTracking> config option: "${config.nodeLocationTracking}"`);
      }
    }
  }
  setInitialNodeLocationOnlyOffsetRecovery(cstNode) {
    cstNode.location = {
      startOffset: NaN,
      endOffset: NaN
    };
  }
  setInitialNodeLocationOnlyOffsetRegular(cstNode) {
    cstNode.location = {
      // without error recovery the starting Location of a new CstNode is guaranteed
      // To be the next Token's startOffset (for valid inputs).
      // For invalid inputs there won't be any CSTOutput so this potential
      // inaccuracy does not matter
      startOffset: this.LA(1).startOffset,
      endOffset: NaN
    };
  }
  setInitialNodeLocationFullRecovery(cstNode) {
    cstNode.location = {
      startOffset: NaN,
      startLine: NaN,
      startColumn: NaN,
      endOffset: NaN,
      endLine: NaN,
      endColumn: NaN
    };
  }
  /**
       *  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
  
       * @param cstNode
       */
  setInitialNodeLocationFullRegular(cstNode) {
    const nextToken = this.LA(1);
    cstNode.location = {
      startOffset: nextToken.startOffset,
      startLine: nextToken.startLine,
      startColumn: nextToken.startColumn,
      endOffset: NaN,
      endLine: NaN,
      endColumn: NaN
    };
  }
  cstInvocationStateUpdate(fullRuleName) {
    const cstNode = {
      name: fullRuleName,
      children: /* @__PURE__ */ Object.create(null)
    };
    this.setInitialNodeLocation(cstNode);
    this.CST_STACK.push(cstNode);
  }
  cstFinallyStateUpdate() {
    this.CST_STACK.pop();
  }
  cstPostRuleFull(ruleCstNode) {
    const prevToken = this.LA(0);
    const loc = ruleCstNode.location;
    if (loc.startOffset <= prevToken.startOffset === true) {
      loc.endOffset = prevToken.endOffset;
      loc.endLine = prevToken.endLine;
      loc.endColumn = prevToken.endColumn;
    } else {
      loc.startOffset = NaN;
      loc.startLine = NaN;
      loc.startColumn = NaN;
    }
  }
  cstPostRuleOnlyOffset(ruleCstNode) {
    const prevToken = this.LA(0);
    const loc = ruleCstNode.location;
    if (loc.startOffset <= prevToken.startOffset === true) {
      loc.endOffset = prevToken.endOffset;
    } else {
      loc.startOffset = NaN;
    }
  }
  cstPostTerminal(key, consumedToken) {
    const rootCst = this.CST_STACK[this.CST_STACK.length - 1];
    addTerminalToCst(rootCst, consumedToken, key);
    this.setNodeLocationFromToken(rootCst.location, consumedToken);
  }
  cstPostNonTerminal(ruleCstResult, ruleName) {
    const preCstNode = this.CST_STACK[this.CST_STACK.length - 1];
    addNoneTerminalToCst(preCstNode, ruleName, ruleCstResult);
    this.setNodeLocationFromNode(preCstNode.location, ruleCstResult.location);
  }
  getBaseCstVisitorConstructor() {
    if (isUndefined_default(this.baseCstVisitorConstructor)) {
      const newBaseCstVisitorConstructor = createBaseSemanticVisitorConstructor(this.className, keys_default(this.gastProductionsCache));
      this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
      return newBaseCstVisitorConstructor;
    }
    return this.baseCstVisitorConstructor;
  }
  getBaseCstVisitorConstructorWithDefaults() {
    if (isUndefined_default(this.baseCstVisitorWithDefaultsConstructor)) {
      const newConstructor = createBaseVisitorConstructorWithDefaults(this.className, keys_default(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
      this.baseCstVisitorWithDefaultsConstructor = newConstructor;
      return newConstructor;
    }
    return this.baseCstVisitorWithDefaultsConstructor;
  }
  getLastExplicitRuleShortName() {
    const ruleStack = this.RULE_STACK;
    return ruleStack[ruleStack.length - 1];
  }
  getPreviousExplicitRuleShortName() {
    const ruleStack = this.RULE_STACK;
    return ruleStack[ruleStack.length - 2];
  }
  getLastExplicitRuleOccurrenceIndex() {
    const occurrenceStack = this.RULE_OCCURRENCE_STACK;
    return occurrenceStack[occurrenceStack.length - 1];
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js
var LexerAdapter = class {
  initLexerAdapter() {
    this.tokVector = [];
    this.tokVectorLength = 0;
    this.currIdx = -1;
  }
  set input(newInput) {
    if (this.selfAnalysisDone !== true) {
      throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`);
    }
    this.reset();
    this.tokVector = newInput;
    this.tokVectorLength = newInput.length;
  }
  get input() {
    return this.tokVector;
  }
  // skips a token and returns the next token
  SKIP_TOKEN() {
    if (this.currIdx <= this.tokVector.length - 2) {
      this.consumeToken();
      return this.LA(1);
    } else {
      return END_OF_FILE;
    }
  }
  // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
  // or lexers dependent on parser context.
  LA(howMuch) {
    const soughtIdx = this.currIdx + howMuch;
    if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) {
      return END_OF_FILE;
    } else {
      return this.tokVector[soughtIdx];
    }
  }
  consumeToken() {
    this.currIdx++;
  }
  exportLexerState() {
    return this.currIdx;
  }
  importLexerState(newState) {
    this.currIdx = newState;
  }
  resetLexerState() {
    this.currIdx = -1;
  }
  moveToTerminatedState() {
    this.currIdx = this.tokVector.length - 1;
  }
  getLexerPosition() {
    return this.exportLexerState();
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js
var RecognizerApi = class {
  ACTION(impl) {
    return impl.call(this);
  }
  consume(idx, tokType, options) {
    return this.consumeInternal(tokType, idx, options);
  }
  subrule(idx, ruleToCall, options) {
    return this.subruleInternal(ruleToCall, idx, options);
  }
  option(idx, actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, idx);
  }
  or(idx, altsOrOpts) {
    return this.orInternal(altsOrOpts, idx);
  }
  many(idx, actionORMethodDef) {
    return this.manyInternal(idx, actionORMethodDef);
  }
  atLeastOne(idx, actionORMethodDef) {
    return this.atLeastOneInternal(idx, actionORMethodDef);
  }
  CONSUME(tokType, options) {
    return this.consumeInternal(tokType, 0, options);
  }
  CONSUME1(tokType, options) {
    return this.consumeInternal(tokType, 1, options);
  }
  CONSUME2(tokType, options) {
    return this.consumeInternal(tokType, 2, options);
  }
  CONSUME3(tokType, options) {
    return this.consumeInternal(tokType, 3, options);
  }
  CONSUME4(tokType, options) {
    return this.consumeInternal(tokType, 4, options);
  }
  CONSUME5(tokType, options) {
    return this.consumeInternal(tokType, 5, options);
  }
  CONSUME6(tokType, options) {
    return this.consumeInternal(tokType, 6, options);
  }
  CONSUME7(tokType, options) {
    return this.consumeInternal(tokType, 7, options);
  }
  CONSUME8(tokType, options) {
    return this.consumeInternal(tokType, 8, options);
  }
  CONSUME9(tokType, options) {
    return this.consumeInternal(tokType, 9, options);
  }
  SUBRULE(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 0, options);
  }
  SUBRULE1(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 1, options);
  }
  SUBRULE2(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 2, options);
  }
  SUBRULE3(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 3, options);
  }
  SUBRULE4(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 4, options);
  }
  SUBRULE5(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 5, options);
  }
  SUBRULE6(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 6, options);
  }
  SUBRULE7(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 7, options);
  }
  SUBRULE8(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 8, options);
  }
  SUBRULE9(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 9, options);
  }
  OPTION(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 0);
  }
  OPTION1(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 1);
  }
  OPTION2(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 2);
  }
  OPTION3(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 3);
  }
  OPTION4(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 4);
  }
  OPTION5(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 5);
  }
  OPTION6(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 6);
  }
  OPTION7(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 7);
  }
  OPTION8(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 8);
  }
  OPTION9(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 9);
  }
  OR(altsOrOpts) {
    return this.orInternal(altsOrOpts, 0);
  }
  OR1(altsOrOpts) {
    return this.orInternal(altsOrOpts, 1);
  }
  OR2(altsOrOpts) {
    return this.orInternal(altsOrOpts, 2);
  }
  OR3(altsOrOpts) {
    return this.orInternal(altsOrOpts, 3);
  }
  OR4(altsOrOpts) {
    return this.orInternal(altsOrOpts, 4);
  }
  OR5(altsOrOpts) {
    return this.orInternal(altsOrOpts, 5);
  }
  OR6(altsOrOpts) {
    return this.orInternal(altsOrOpts, 6);
  }
  OR7(altsOrOpts) {
    return this.orInternal(altsOrOpts, 7);
  }
  OR8(altsOrOpts) {
    return this.orInternal(altsOrOpts, 8);
  }
  OR9(altsOrOpts) {
    return this.orInternal(altsOrOpts, 9);
  }
  MANY(actionORMethodDef) {
    this.manyInternal(0, actionORMethodDef);
  }
  MANY1(actionORMethodDef) {
    this.manyInternal(1, actionORMethodDef);
  }
  MANY2(actionORMethodDef) {
    this.manyInternal(2, actionORMethodDef);
  }
  MANY3(actionORMethodDef) {
    this.manyInternal(3, actionORMethodDef);
  }
  MANY4(actionORMethodDef) {
    this.manyInternal(4, actionORMethodDef);
  }
  MANY5(actionORMethodDef) {
    this.manyInternal(5, actionORMethodDef);
  }
  MANY6(actionORMethodDef) {
    this.manyInternal(6, actionORMethodDef);
  }
  MANY7(actionORMethodDef) {
    this.manyInternal(7, actionORMethodDef);
  }
  MANY8(actionORMethodDef) {
    this.manyInternal(8, actionORMethodDef);
  }
  MANY9(actionORMethodDef) {
    this.manyInternal(9, actionORMethodDef);
  }
  MANY_SEP(options) {
    this.manySepFirstInternal(0, options);
  }
  MANY_SEP1(options) {
    this.manySepFirstInternal(1, options);
  }
  MANY_SEP2(options) {
    this.manySepFirstInternal(2, options);
  }
  MANY_SEP3(options) {
    this.manySepFirstInternal(3, options);
  }
  MANY_SEP4(options) {
    this.manySepFirstInternal(4, options);
  }
  MANY_SEP5(options) {
    this.manySepFirstInternal(5, options);
  }
  MANY_SEP6(options) {
    this.manySepFirstInternal(6, options);
  }
  MANY_SEP7(options) {
    this.manySepFirstInternal(7, options);
  }
  MANY_SEP8(options) {
    this.manySepFirstInternal(8, options);
  }
  MANY_SEP9(options) {
    this.manySepFirstInternal(9, options);
  }
  AT_LEAST_ONE(actionORMethodDef) {
    this.atLeastOneInternal(0, actionORMethodDef);
  }
  AT_LEAST_ONE1(actionORMethodDef) {
    return this.atLeastOneInternal(1, actionORMethodDef);
  }
  AT_LEAST_ONE2(actionORMethodDef) {
    this.atLeastOneInternal(2, actionORMethodDef);
  }
  AT_LEAST_ONE3(actionORMethodDef) {
    this.atLeastOneInternal(3, actionORMethodDef);
  }
  AT_LEAST_ONE4(actionORMethodDef) {
    this.atLeastOneInternal(4, actionORMethodDef);
  }
  AT_LEAST_ONE5(actionORMethodDef) {
    this.atLeastOneInternal(5, actionORMethodDef);
  }
  AT_LEAST_ONE6(actionORMethodDef) {
    this.atLeastOneInternal(6, actionORMethodDef);
  }
  AT_LEAST_ONE7(actionORMethodDef) {
    this.atLeastOneInternal(7, actionORMethodDef);
  }
  AT_LEAST_ONE8(actionORMethodDef) {
    this.atLeastOneInternal(8, actionORMethodDef);
  }
  AT_LEAST_ONE9(actionORMethodDef) {
    this.atLeastOneInternal(9, actionORMethodDef);
  }
  AT_LEAST_ONE_SEP(options) {
    this.atLeastOneSepFirstInternal(0, options);
  }
  AT_LEAST_ONE_SEP1(options) {
    this.atLeastOneSepFirstInternal(1, options);
  }
  AT_LEAST_ONE_SEP2(options) {
    this.atLeastOneSepFirstInternal(2, options);
  }
  AT_LEAST_ONE_SEP3(options) {
    this.atLeastOneSepFirstInternal(3, options);
  }
  AT_LEAST_ONE_SEP4(options) {
    this.atLeastOneSepFirstInternal(4, options);
  }
  AT_LEAST_ONE_SEP5(options) {
    this.atLeastOneSepFirstInternal(5, options);
  }
  AT_LEAST_ONE_SEP6(options) {
    this.atLeastOneSepFirstInternal(6, options);
  }
  AT_LEAST_ONE_SEP7(options) {
    this.atLeastOneSepFirstInternal(7, options);
  }
  AT_LEAST_ONE_SEP8(options) {
    this.atLeastOneSepFirstInternal(8, options);
  }
  AT_LEAST_ONE_SEP9(options) {
    this.atLeastOneSepFirstInternal(9, options);
  }
  RULE(name, implementation, config = DEFAULT_RULE_CONFIG) {
    if (includes_default(this.definedRulesNames, name)) {
      const errMsg = defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
        topLevelRule: name,
        grammarName: this.className
      });
      const error = {
        message: errMsg,
        type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
        ruleName: name
      };
      this.definitionErrors.push(error);
    }
    this.definedRulesNames.push(name);
    const ruleImplementation = this.defineRule(name, implementation, config);
    this[name] = ruleImplementation;
    return ruleImplementation;
  }
  OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
    const ruleErrors = validateRuleIsOverridden(name, this.definedRulesNames, this.className);
    this.definitionErrors = this.definitionErrors.concat(ruleErrors);
    const ruleImplementation = this.defineRule(name, impl, config);
    this[name] = ruleImplementation;
    return ruleImplementation;
  }
  BACKTRACK(grammarRule, args) {
    return function() {
      this.isBackTrackingStack.push(1);
      const orgState = this.saveRecogState();
      try {
        grammarRule.apply(this, args);
        return true;
      } catch (e) {
        if (isRecognitionException(e)) {
          return false;
        } else {
          throw e;
        }
      } finally {
        this.reloadRecogState(orgState);
        this.isBackTrackingStack.pop();
      }
    };
  }
  // GAST export APIs
  getGAstProductions() {
    return this.gastProductionsCache;
  }
  getSerializedGastProductions() {
    return serializeGrammar(values_default(this.gastProductionsCache));
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js
var RecognizerEngine = class {
  initRecognizerEngine(tokenVocabulary, config) {
    this.className = this.constructor.name;
    this.shortRuleNameToFull = {};
    this.fullRuleNameToShort = {};
    this.ruleShortNameIdx = 256;
    this.tokenMatcher = tokenStructuredMatcherNoCategories;
    this.subruleIdx = 0;
    this.definedRulesNames = [];
    this.tokensMap = {};
    this.isBackTrackingStack = [];
    this.RULE_STACK = [];
    this.RULE_OCCURRENCE_STACK = [];
    this.gastProductionsCache = {};
    if (has_default(config, "serializedGrammar")) {
      throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.");
    }
    if (isArray_default(tokenVocabulary)) {
      if (isEmpty_default(tokenVocabulary)) {
        throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).");
      }
      if (typeof tokenVocabulary[0].startOffset === "number") {
        throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.");
      }
    }
    if (isArray_default(tokenVocabulary)) {
      this.tokensMap = reduce_default(tokenVocabulary, (acc, tokType) => {
        acc[tokType.name] = tokType;
        return acc;
      }, {});
    } else if (has_default(tokenVocabulary, "modes") && every_default(flatten_default(values_default(tokenVocabulary.modes)), isTokenType)) {
      const allTokenTypes2 = flatten_default(values_default(tokenVocabulary.modes));
      const uniqueTokens = uniq_default(allTokenTypes2);
      this.tokensMap = reduce_default(uniqueTokens, (acc, tokType) => {
        acc[tokType.name] = tokType;
        return acc;
      }, {});
    } else if (isObject_default(tokenVocabulary)) {
      this.tokensMap = clone_default(tokenVocabulary);
    } else {
      throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
    }
    this.tokensMap["EOF"] = EOF;
    const allTokenTypes = has_default(tokenVocabulary, "modes") ? flatten_default(values_default(tokenVocabulary.modes)) : values_default(tokenVocabulary);
    const noTokenCategoriesUsed = every_default(allTokenTypes, (tokenConstructor) => isEmpty_default(tokenConstructor.categoryMatches));
    this.tokenMatcher = noTokenCategoriesUsed ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
    augmentTokenTypes(values_default(this.tokensMap));
  }
  defineRule(ruleName, impl, config) {
    if (this.selfAnalysisDone) {
      throw Error(`Grammar rule <${ruleName}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
    }
    const resyncEnabled = has_default(config, "resyncEnabled") ? config.resyncEnabled : DEFAULT_RULE_CONFIG.resyncEnabled;
    const recoveryValueFunc = has_default(config, "recoveryValueFunc") ? config.recoveryValueFunc : DEFAULT_RULE_CONFIG.recoveryValueFunc;
    const shortName = this.ruleShortNameIdx << BITS_FOR_METHOD_TYPE + BITS_FOR_OCCURRENCE_IDX;
    this.ruleShortNameIdx++;
    this.shortRuleNameToFull[shortName] = ruleName;
    this.fullRuleNameToShort[ruleName] = shortName;
    let invokeRuleWithTry;
    if (this.outputCst === true) {
      invokeRuleWithTry = function invokeRuleWithTry2(...args) {
        try {
          this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
          impl.apply(this, args);
          const cst = this.CST_STACK[this.CST_STACK.length - 1];
          this.cstPostRule(cst);
          return cst;
        } catch (e) {
          return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
        } finally {
          this.ruleFinallyStateUpdate();
        }
      };
    } else {
      invokeRuleWithTry = function invokeRuleWithTryCst(...args) {
        try {
          this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
          return impl.apply(this, args);
        } catch (e) {
          return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
        } finally {
          this.ruleFinallyStateUpdate();
        }
      };
    }
    const wrappedGrammarRule = Object.assign(invokeRuleWithTry, { ruleName, originalGrammarAction: impl });
    return wrappedGrammarRule;
  }
  invokeRuleCatch(e, resyncEnabledConfig, recoveryValueFunc) {
    const isFirstInvokedRule = this.RULE_STACK.length === 1;
    const reSyncEnabled = resyncEnabledConfig && !this.isBackTracking() && this.recoveryEnabled;
    if (isRecognitionException(e)) {
      const recogError = e;
      if (reSyncEnabled) {
        const reSyncTokType = this.findReSyncTokenType();
        if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
          recogError.resyncedTokens = this.reSyncTo(reSyncTokType);
          if (this.outputCst) {
            const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
            partialCstResult.recoveredNode = true;
            return partialCstResult;
          } else {
            return recoveryValueFunc(e);
          }
        } else {
          if (this.outputCst) {
            const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
            partialCstResult.recoveredNode = true;
            recogError.partialCstResult = partialCstResult;
          }
          throw recogError;
        }
      } else if (isFirstInvokedRule) {
        this.moveToTerminatedState();
        return recoveryValueFunc(e);
      } else {
        throw recogError;
      }
    } else {
      throw e;
    }
  }
  // Implementation of parsing DSL
  optionInternal(actionORMethodDef, occurrence) {
    const key = this.getKeyForAutomaticLookahead(OPTION_IDX, occurrence);
    return this.optionInternalLogic(actionORMethodDef, occurrence, key);
  }
  optionInternalLogic(actionORMethodDef, occurrence, key) {
    let lookAheadFunc = this.getLaFuncFromCache(key);
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookAheadFunc;
        lookAheadFunc = () => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        };
      }
    } else {
      action = actionORMethodDef;
    }
    if (lookAheadFunc.call(this) === true) {
      return action.call(this);
    }
    return void 0;
  }
  atLeastOneInternal(prodOccurrence, actionORMethodDef) {
    const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_IDX, prodOccurrence);
    return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, laKey);
  }
  atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key) {
    let lookAheadFunc = this.getLaFuncFromCache(key);
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookAheadFunc;
        lookAheadFunc = () => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        };
      }
    } else {
      action = actionORMethodDef;
    }
    if (lookAheadFunc.call(this) === true) {
      let notStuck = this.doSingleRepetition(action);
      while (lookAheadFunc.call(this) === true && notStuck === true) {
        notStuck = this.doSingleRepetition(action);
      }
    } else {
      throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
    }
    this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef], lookAheadFunc, AT_LEAST_ONE_IDX, prodOccurrence, NextTerminalAfterAtLeastOneWalker);
  }
  atLeastOneSepFirstInternal(prodOccurrence, options) {
    const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_SEP_IDX, prodOccurrence);
    this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, laKey);
  }
  atLeastOneSepFirstInternalLogic(prodOccurrence, options, key) {
    const action = options.DEF;
    const separator = options.SEP;
    const firstIterationLookaheadFunc = this.getLaFuncFromCache(key);
    if (firstIterationLookaheadFunc.call(this) === true) {
      action.call(this);
      const separatorLookAheadFunc = () => {
        return this.tokenMatcher(this.LA(1), separator);
      };
      while (this.tokenMatcher(this.LA(1), separator) === true) {
        this.CONSUME(separator);
        action.call(this);
      }
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        prodOccurrence,
        separator,
        separatorLookAheadFunc,
        action,
        NextTerminalAfterAtLeastOneSepWalker
      ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, NextTerminalAfterAtLeastOneSepWalker);
    } else {
      throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
    }
  }
  manyInternal(prodOccurrence, actionORMethodDef) {
    const laKey = this.getKeyForAutomaticLookahead(MANY_IDX, prodOccurrence);
    return this.manyInternalLogic(prodOccurrence, actionORMethodDef, laKey);
  }
  manyInternalLogic(prodOccurrence, actionORMethodDef, key) {
    let lookaheadFunction = this.getLaFuncFromCache(key);
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookaheadFunction;
        lookaheadFunction = () => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        };
      }
    } else {
      action = actionORMethodDef;
    }
    let notStuck = true;
    while (lookaheadFunction.call(this) === true && notStuck === true) {
      notStuck = this.doSingleRepetition(action);
    }
    this.attemptInRepetitionRecovery(
      this.manyInternal,
      [prodOccurrence, actionORMethodDef],
      lookaheadFunction,
      MANY_IDX,
      prodOccurrence,
      NextTerminalAfterManyWalker,
      // The notStuck parameter is only relevant when "attemptInRepetitionRecovery"
      // is invoked from manyInternal, in the MANY_SEP case and AT_LEAST_ONE[_SEP]
      // An infinite loop cannot occur as:
      // - Either the lookahead is guaranteed to consume something (Single Token Separator)
      // - AT_LEAST_ONE by definition is guaranteed to consume something (or error out).
      notStuck
    );
  }
  manySepFirstInternal(prodOccurrence, options) {
    const laKey = this.getKeyForAutomaticLookahead(MANY_SEP_IDX, prodOccurrence);
    this.manySepFirstInternalLogic(prodOccurrence, options, laKey);
  }
  manySepFirstInternalLogic(prodOccurrence, options, key) {
    const action = options.DEF;
    const separator = options.SEP;
    const firstIterationLaFunc = this.getLaFuncFromCache(key);
    if (firstIterationLaFunc.call(this) === true) {
      action.call(this);
      const separatorLookAheadFunc = () => {
        return this.tokenMatcher(this.LA(1), separator);
      };
      while (this.tokenMatcher(this.LA(1), separator) === true) {
        this.CONSUME(separator);
        action.call(this);
      }
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        prodOccurrence,
        separator,
        separatorLookAheadFunc,
        action,
        NextTerminalAfterManySepWalker
      ], separatorLookAheadFunc, MANY_SEP_IDX, prodOccurrence, NextTerminalAfterManySepWalker);
    }
  }
  repetitionSepSecondInternal(prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker) {
    while (separatorLookAheadFunc()) {
      this.CONSUME(separator);
      action.call(this);
    }
    this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
      prodOccurrence,
      separator,
      separatorLookAheadFunc,
      action,
      nextTerminalAfterWalker
    ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
  }
  doSingleRepetition(action) {
    const beforeIteration = this.getLexerPosition();
    action.call(this);
    const afterIteration = this.getLexerPosition();
    return afterIteration > beforeIteration;
  }
  orInternal(altsOrOpts, occurrence) {
    const laKey = this.getKeyForAutomaticLookahead(OR_IDX, occurrence);
    const alts = isArray_default(altsOrOpts) ? altsOrOpts : altsOrOpts.DEF;
    const laFunc = this.getLaFuncFromCache(laKey);
    const altIdxToTake = laFunc.call(this, alts);
    if (altIdxToTake !== void 0) {
      const chosenAlternative = alts[altIdxToTake];
      return chosenAlternative.ALT.call(this);
    }
    this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
  }
  ruleFinallyStateUpdate() {
    this.RULE_STACK.pop();
    this.RULE_OCCURRENCE_STACK.pop();
    this.cstFinallyStateUpdate();
    if (this.RULE_STACK.length === 0 && this.isAtEndOfInput() === false) {
      const firstRedundantTok = this.LA(1);
      const errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
        firstRedundant: firstRedundantTok,
        ruleName: this.getCurrRuleFullName()
      });
      this.SAVE_ERROR(new NotAllInputParsedException(errMsg, firstRedundantTok));
    }
  }
  subruleInternal(ruleToCall, idx, options) {
    let ruleResult;
    try {
      const args = options !== void 0 ? options.ARGS : void 0;
      this.subruleIdx = idx;
      ruleResult = ruleToCall.apply(this, args);
      this.cstPostNonTerminal(ruleResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleToCall.ruleName);
      return ruleResult;
    } catch (e) {
      throw this.subruleInternalError(e, options, ruleToCall.ruleName);
    }
  }
  subruleInternalError(e, options, ruleName) {
    if (isRecognitionException(e) && e.partialCstResult !== void 0) {
      this.cstPostNonTerminal(e.partialCstResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleName);
      delete e.partialCstResult;
    }
    throw e;
  }
  consumeInternal(tokType, idx, options) {
    let consumedToken;
    try {
      const nextToken = this.LA(1);
      if (this.tokenMatcher(nextToken, tokType) === true) {
        this.consumeToken();
        consumedToken = nextToken;
      } else {
        this.consumeInternalError(tokType, nextToken, options);
      }
    } catch (eFromConsumption) {
      consumedToken = this.consumeInternalRecovery(tokType, idx, eFromConsumption);
    }
    this.cstPostTerminal(options !== void 0 && options.LABEL !== void 0 ? options.LABEL : tokType.name, consumedToken);
    return consumedToken;
  }
  consumeInternalError(tokType, nextToken, options) {
    let msg;
    const previousToken = this.LA(0);
    if (options !== void 0 && options.ERR_MSG) {
      msg = options.ERR_MSG;
    } else {
      msg = this.errorMessageProvider.buildMismatchTokenMessage({
        expected: tokType,
        actual: nextToken,
        previous: previousToken,
        ruleName: this.getCurrRuleFullName()
      });
    }
    throw this.SAVE_ERROR(new MismatchedTokenException(msg, nextToken, previousToken));
  }
  consumeInternalRecovery(tokType, idx, eFromConsumption) {
    if (this.recoveryEnabled && // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
    eFromConsumption.name === "MismatchedTokenException" && !this.isBackTracking()) {
      const follows = this.getFollowsForInRuleRecovery(tokType, idx);
      try {
        return this.tryInRuleRecovery(tokType, follows);
      } catch (eFromInRuleRecovery) {
        if (eFromInRuleRecovery.name === IN_RULE_RECOVERY_EXCEPTION) {
          throw eFromConsumption;
        } else {
          throw eFromInRuleRecovery;
        }
      }
    } else {
      throw eFromConsumption;
    }
  }
  saveRecogState() {
    const savedErrors = this.errors;
    const savedRuleStack = clone_default(this.RULE_STACK);
    return {
      errors: savedErrors,
      lexerState: this.exportLexerState(),
      RULE_STACK: savedRuleStack,
      CST_STACK: this.CST_STACK
    };
  }
  reloadRecogState(newState) {
    this.errors = newState.errors;
    this.importLexerState(newState.lexerState);
    this.RULE_STACK = newState.RULE_STACK;
  }
  ruleInvocationStateUpdate(shortName, fullName, idxInCallingRule) {
    this.RULE_OCCURRENCE_STACK.push(idxInCallingRule);
    this.RULE_STACK.push(shortName);
    this.cstInvocationStateUpdate(fullName);
  }
  isBackTracking() {
    return this.isBackTrackingStack.length !== 0;
  }
  getCurrRuleFullName() {
    const shortName = this.getLastExplicitRuleShortName();
    return this.shortRuleNameToFull[shortName];
  }
  shortRuleNameToFullName(shortName) {
    return this.shortRuleNameToFull[shortName];
  }
  isAtEndOfInput() {
    return this.tokenMatcher(this.LA(1), EOF);
  }
  reset() {
    this.resetLexerState();
    this.subruleIdx = 0;
    this.isBackTrackingStack = [];
    this.errors = [];
    this.RULE_STACK = [];
    this.CST_STACK = [];
    this.RULE_OCCURRENCE_STACK = [];
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js
var ErrorHandler = class {
  initErrorHandler(config) {
    this._errors = [];
    this.errorMessageProvider = has_default(config, "errorMessageProvider") ? config.errorMessageProvider : DEFAULT_PARSER_CONFIG.errorMessageProvider;
  }
  SAVE_ERROR(error) {
    if (isRecognitionException(error)) {
      error.context = {
        ruleStack: this.getHumanReadableRuleStack(),
        ruleOccurrenceStack: clone_default(this.RULE_OCCURRENCE_STACK)
      };
      this._errors.push(error);
      return error;
    } else {
      throw Error("Trying to save an Error which is not a RecognitionException");
    }
  }
  get errors() {
    return clone_default(this._errors);
  }
  set errors(newErrors) {
    this._errors = newErrors;
  }
  // TODO: consider caching the error message computed information
  raiseEarlyExitException(occurrence, prodType, userDefinedErrMsg) {
    const ruleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[ruleName];
    const lookAheadPathsPerAlternative = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead);
    const insideProdPaths = lookAheadPathsPerAlternative[0];
    const actualTokens = [];
    for (let i = 1; i <= this.maxLookahead; i++) {
      actualTokens.push(this.LA(i));
    }
    const msg = this.errorMessageProvider.buildEarlyExitMessage({
      expectedIterationPaths: insideProdPaths,
      actual: actualTokens,
      previous: this.LA(0),
      customUserDescription: userDefinedErrMsg,
      ruleName
    });
    throw this.SAVE_ERROR(new EarlyExitException(msg, this.LA(1), this.LA(0)));
  }
  // TODO: consider caching the error message computed information
  raiseNoAltException(occurrence, errMsgTypes) {
    const ruleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[ruleName];
    const lookAheadPathsPerAlternative = getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
    const actualTokens = [];
    for (let i = 1; i <= this.maxLookahead; i++) {
      actualTokens.push(this.LA(i));
    }
    const previousToken = this.LA(0);
    const errMsg = this.errorMessageProvider.buildNoViableAltMessage({
      expectedPathsPerAlt: lookAheadPathsPerAlternative,
      actual: actualTokens,
      previous: previousToken,
      customUserDescription: errMsgTypes,
      ruleName: this.getCurrRuleFullName()
    });
    throw this.SAVE_ERROR(new NoViableAltException(errMsg, this.LA(1), previousToken));
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/context_assist.js
var ContentAssist = class {
  initContentAssist() {
  }
  computeContentAssist(startRuleName, precedingInput) {
    const startRuleGast = this.gastProductionsCache[startRuleName];
    if (isUndefined_default(startRuleGast)) {
      throw Error(`Rule ->${startRuleName}<- does not exist in this grammar.`);
    }
    return nextPossibleTokensAfter([startRuleGast], precedingInput, this.tokenMatcher, this.maxLookahead);
  }
  // TODO: should this be a member method or a utility? it does not have any state or usage of 'this'...
  // TODO: should this be more explicitly part of the public API?
  getNextPossibleTokenTypes(grammarPath) {
    const topRuleName = head_default(grammarPath.ruleStack);
    const gastProductions = this.getGAstProductions();
    const topProduction = gastProductions[topRuleName];
    const nextPossibleTokenTypes = new NextAfterTokenWalker(topProduction, grammarPath).startWalking();
    return nextPossibleTokenTypes;
  }
};

// node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js
var RECORDING_NULL_OBJECT = {
  description: "This Object indicates the Parser is during Recording Phase"
};
Object.freeze(RECORDING_NULL_OBJECT);
var HANDLE_SEPARATOR = true;
var MAX_METHOD_IDX = Math.pow(2, BITS_FOR_OCCURRENCE_IDX) - 1;
var RFT = createToken({ name: "RECORDING_PHASE_TOKEN", pattern: Lexer.NA });
augmentTokenTypes([RFT]);
var RECORDING_PHASE_TOKEN = createTokenInstance(
  RFT,
  "This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
  // Using "-1" instead of NaN (as in EOF) because an actual number is less likely to
  // cause errors if the output of LA or CONSUME would be (incorrectly) used during the recording phase.
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
);
Object.freeze(RECORDING_PHASE_TOKEN);
var RECORDING_PHASE_CSTNODE = {
  name: "This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
  children: {}
};
var GastRecorder = class {
  initGastRecorder(config) {
    this.recordingProdStack = [];
    this.RECORDING_PHASE = false;
  }
  enableRecording() {
    this.RECORDING_PHASE = true;
    this.TRACE_INIT("Enable Recording", () => {
      for (let i = 0; i < 10; i++) {
        const idx = i > 0 ? i : "";
        this[`CONSUME${idx}`] = function(arg1, arg2) {
          return this.consumeInternalRecord(arg1, i, arg2);
        };
        this[`SUBRULE${idx}`] = function(arg1, arg2) {
          return this.subruleInternalRecord(arg1, i, arg2);
        };
        this[`OPTION${idx}`] = function(arg1) {
          return this.optionInternalRecord(arg1, i);
        };
        this[`OR${idx}`] = function(arg1) {
          return this.orInternalRecord(arg1, i);
        };
        this[`MANY${idx}`] = function(arg1) {
          this.manyInternalRecord(i, arg1);
        };
        this[`MANY_SEP${idx}`] = function(arg1) {
          this.manySepFirstInternalRecord(i, arg1);
        };
        this[`AT_LEAST_ONE${idx}`] = function(arg1) {
          this.atLeastOneInternalRecord(i, arg1);
        };
        this[`AT_LEAST_ONE_SEP${idx}`] = function(arg1) {
          this.atLeastOneSepFirstInternalRecord(i, arg1);
        };
      }
      this[`consume`] = function(idx, arg1, arg2) {
        return this.consumeInternalRecord(arg1, idx, arg2);
      };
      this[`subrule`] = function(idx, arg1, arg2) {
        return this.subruleInternalRecord(arg1, idx, arg2);
      };
      this[`option`] = function(idx, arg1) {
        return this.optionInternalRecord(arg1, idx);
      };
      this[`or`] = function(idx, arg1) {
        return this.orInternalRecord(arg1, idx);
      };
      this[`many`] = function(idx, arg1) {
        this.manyInternalRecord(idx, arg1);
      };
      this[`atLeastOne`] = function(idx, arg1) {
        this.atLeastOneInternalRecord(idx, arg1);
      };
      this.ACTION = this.ACTION_RECORD;
      this.BACKTRACK = this.BACKTRACK_RECORD;
      this.LA = this.LA_RECORD;
    });
  }
  disableRecording() {
    this.RECORDING_PHASE = false;
    this.TRACE_INIT("Deleting Recording methods", () => {
      const that = this;
      for (let i = 0; i < 10; i++) {
        const idx = i > 0 ? i : "";
        delete that[`CONSUME${idx}`];
        delete that[`SUBRULE${idx}`];
        delete that[`OPTION${idx}`];
        delete that[`OR${idx}`];
        delete that[`MANY${idx}`];
        delete that[`MANY_SEP${idx}`];
        delete that[`AT_LEAST_ONE${idx}`];
        delete that[`AT_LEAST_ONE_SEP${idx}`];
      }
      delete that[`consume`];
      delete that[`subrule`];
      delete that[`option`];
      delete that[`or`];
      delete that[`many`];
      delete that[`atLeastOne`];
      delete that.ACTION;
      delete that.BACKTRACK;
      delete that.LA;
    });
  }
  //   Parser methods are called inside an ACTION?
  //   Maybe try/catch/finally on ACTIONS while disabling the recorders state changes?
  // @ts-expect-error -- noop place holder
  ACTION_RECORD(impl) {
  }
  // Executing backtracking logic will break our recording logic assumptions
  BACKTRACK_RECORD(grammarRule, args) {
    return () => true;
  }
  // LA is part of the official API and may be used for custom lookahead logic
  // by end users who may forget to wrap it in ACTION or inside a GATE
  LA_RECORD(howMuch) {
    return END_OF_FILE;
  }
  topLevelRuleRecord(name, def) {
    try {
      const newTopLevelRule = new Rule({ definition: [], name });
      newTopLevelRule.name = name;
      this.recordingProdStack.push(newTopLevelRule);
      def.call(this);
      this.recordingProdStack.pop();
      return newTopLevelRule;
    } catch (originalError) {
      if (originalError.KNOWN_RECORDER_ERROR !== true) {
        try {
          originalError.message = originalError.message + '\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording';
        } catch (mutabilityError) {
          throw originalError;
        }
      }
      throw originalError;
    }
  }
  // Implementation of parsing DSL
  optionInternalRecord(actionORMethodDef, occurrence) {
    return recordProd.call(this, Option, actionORMethodDef, occurrence);
  }
  atLeastOneInternalRecord(occurrence, actionORMethodDef) {
    recordProd.call(this, RepetitionMandatory, actionORMethodDef, occurrence);
  }
  atLeastOneSepFirstInternalRecord(occurrence, options) {
    recordProd.call(this, RepetitionMandatoryWithSeparator, options, occurrence, HANDLE_SEPARATOR);
  }
  manyInternalRecord(occurrence, actionORMethodDef) {
    recordProd.call(this, Repetition, actionORMethodDef, occurrence);
  }
  manySepFirstInternalRecord(occurrence, options) {
    recordProd.call(this, RepetitionWithSeparator, options, occurrence, HANDLE_SEPARATOR);
  }
  orInternalRecord(altsOrOpts, occurrence) {
    return recordOrProd.call(this, altsOrOpts, occurrence);
  }
  subruleInternalRecord(ruleToCall, occurrence, options) {
    assertMethodIdxIsValid(occurrence);
    if (!ruleToCall || has_default(ruleToCall, "ruleName") === false) {
      const error = new Error(`<SUBRULE${getIdxSuffix(occurrence)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(ruleToCall)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
      error.KNOWN_RECORDER_ERROR = true;
      throw error;
    }
    const prevProd = last_default(this.recordingProdStack);
    const ruleName = ruleToCall.ruleName;
    const newNoneTerminal = new NonTerminal({
      idx: occurrence,
      nonTerminalName: ruleName,
      label: options === null || options === void 0 ? void 0 : options.LABEL,
      // The resolving of the `referencedRule` property will be done once all the Rule's GASTs have been created
      referencedRule: void 0
    });
    prevProd.definition.push(newNoneTerminal);
    return this.outputCst ? RECORDING_PHASE_CSTNODE : RECORDING_NULL_OBJECT;
  }
  consumeInternalRecord(tokType, occurrence, options) {
    assertMethodIdxIsValid(occurrence);
    if (!hasShortKeyProperty(tokType)) {
      const error = new Error(`<CONSUME${getIdxSuffix(occurrence)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(tokType)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
      error.KNOWN_RECORDER_ERROR = true;
      throw error;
    }
    const prevProd = last_default(this.recordingProdStack);
    const newNoneTerminal = new Terminal({
      idx: occurrence,
      terminalType: tokType,
      label: options === null || options === void 0 ? void 0 : options.LABEL
    });
    prevProd.definition.push(newNoneTerminal);
    return RECORDING_PHASE_TOKEN;
  }
};
function recordProd(prodConstructor, mainProdArg, occurrence, handleSep = false) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = last_default(this.recordingProdStack);
  const grammarAction = isFunction_default(mainProdArg) ? mainProdArg : mainProdArg.DEF;
  const newProd = new prodConstructor({ definition: [], idx: occurrence });
  if (handleSep) {
    newProd.separator = mainProdArg.SEP;
  }
  if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
    newProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  this.recordingProdStack.push(newProd);
  grammarAction.call(this);
  prevProd.definition.push(newProd);
  this.recordingProdStack.pop();
  return RECORDING_NULL_OBJECT;
}
function recordOrProd(mainProdArg, occurrence) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = last_default(this.recordingProdStack);
  const hasOptions = isArray_default(mainProdArg) === false;
  const alts = hasOptions === false ? mainProdArg : mainProdArg.DEF;
  const newOrProd = new Alternation({
    definition: [],
    idx: occurrence,
    ignoreAmbiguities: hasOptions && mainProdArg.IGNORE_AMBIGUITIES === true
  });
  if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
    newOrProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  const hasPredicates = some_default(alts, (currAlt) => isFunction_default(currAlt.GATE));
  newOrProd.hasPredicates = hasPredicates;
  prevProd.definition.push(newOrProd);
  forEach_default(alts, (currAlt) => {
    const currAltFlat = new Alternative({ definition: [] });
    newOrProd.definition.push(currAltFlat);
    if (has_default(currAlt, "IGNORE_AMBIGUITIES")) {
      currAltFlat.ignoreAmbiguities = currAlt.IGNORE_AMBIGUITIES;
    } else if (has_default(currAlt, "GATE")) {
      currAltFlat.ignoreAmbiguities = true;
    }
    this.recordingProdStack.push(currAltFlat);
    currAlt.ALT.call(this);
    this.recordingProdStack.pop();
  });
  return RECORDING_NULL_OBJECT;
}
function getIdxSuffix(idx) {
  return idx === 0 ? "" : `${idx}`;
}
function assertMethodIdxIsValid(idx) {
  if (idx < 0 || idx > MAX_METHOD_IDX) {
    const error = new Error(
      // The stack trace will contain all the needed details
      `Invalid DSL Method idx value: <${idx}>
	Idx value must be a none negative value smaller than ${MAX_METHOD_IDX + 1}`
    );
    error.KNOWN_RECORDER_ERROR = true;
    throw error;
  }
}

// node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js
var PerformanceTracer = class {
  initPerformanceTracer(config) {
    if (has_default(config, "traceInitPerf")) {
      const userTraceInitPerf = config.traceInitPerf;
      const traceIsNumber = typeof userTraceInitPerf === "number";
      this.traceInitMaxIdent = traceIsNumber ? userTraceInitPerf : Infinity;
      this.traceInitPerf = traceIsNumber ? userTraceInitPerf > 0 : userTraceInitPerf;
    } else {
      this.traceInitMaxIdent = 0;
      this.traceInitPerf = DEFAULT_PARSER_CONFIG.traceInitPerf;
    }
    this.traceInitIndent = -1;
  }
  TRACE_INIT(phaseDesc, phaseImpl) {
    if (this.traceInitPerf === true) {
      this.traceInitIndent++;
      const indent = new Array(this.traceInitIndent + 1).join("	");
      if (this.traceInitIndent < this.traceInitMaxIdent) {
        console.log(`${indent}--> <${phaseDesc}>`);
      }
      const { time, value } = timer(phaseImpl);
      const traceMethod = time > 10 ? console.warn : console.log;
      if (this.traceInitIndent < this.traceInitMaxIdent) {
        traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
      }
      this.traceInitIndent--;
      return value;
    } else {
      return phaseImpl();
    }
  }
};

// node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js
function applyMixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    const baseProto = baseCtor.prototype;
    Object.getOwnPropertyNames(baseProto).forEach((propName) => {
      if (propName === "constructor") {
        return;
      }
      const basePropDescriptor = Object.getOwnPropertyDescriptor(baseProto, propName);
      if (basePropDescriptor && (basePropDescriptor.get || basePropDescriptor.set)) {
        Object.defineProperty(derivedCtor.prototype, propName, basePropDescriptor);
      } else {
        derivedCtor.prototype[propName] = baseCtor.prototype[propName];
      }
    });
  });
}

// node_modules/chevrotain/lib/src/parse/parser/parser.js
var END_OF_FILE = createTokenInstance(EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
Object.freeze(END_OF_FILE);
var DEFAULT_PARSER_CONFIG = Object.freeze({
  recoveryEnabled: false,
  maxLookahead: 3,
  dynamicTokensEnabled: false,
  outputCst: true,
  errorMessageProvider: defaultParserErrorProvider,
  nodeLocationTracking: "none",
  traceInitPerf: false,
  skipValidations: false
});
var DEFAULT_RULE_CONFIG = Object.freeze({
  recoveryValueFunc: () => void 0,
  resyncEnabled: true
});
var ParserDefinitionErrorType;
(function(ParserDefinitionErrorType2) {
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["NO_NON_EMPTY_LOOKAHEAD"] = 10] = "NO_NON_EMPTY_LOOKAHEAD";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_PREFIX_ALTS"] = 11] = "AMBIGUOUS_PREFIX_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["TOO_MANY_ALTS"] = 12] = "TOO_MANY_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["CUSTOM_LOOKAHEAD_VALIDATION"] = 13] = "CUSTOM_LOOKAHEAD_VALIDATION";
})(ParserDefinitionErrorType || (ParserDefinitionErrorType = {}));
var Parser = class _Parser {
  /**
   *  @deprecated use the **instance** method with the same name instead
   */
  static performSelfAnalysis(parserInstance) {
    throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
  }
  performSelfAnalysis() {
    this.TRACE_INIT("performSelfAnalysis", () => {
      let defErrorsMsgs;
      this.selfAnalysisDone = true;
      const className = this.className;
      this.TRACE_INIT("toFastProps", () => {
        toFastProperties(this);
      });
      this.TRACE_INIT("Grammar Recording", () => {
        try {
          this.enableRecording();
          forEach_default(this.definedRulesNames, (currRuleName) => {
            const wrappedRule = this[currRuleName];
            const originalGrammarAction = wrappedRule["originalGrammarAction"];
            let recordedRuleGast;
            this.TRACE_INIT(`${currRuleName} Rule`, () => {
              recordedRuleGast = this.topLevelRuleRecord(currRuleName, originalGrammarAction);
            });
            this.gastProductionsCache[currRuleName] = recordedRuleGast;
          });
        } finally {
          this.disableRecording();
        }
      });
      let resolverErrors = [];
      this.TRACE_INIT("Grammar Resolving", () => {
        resolverErrors = resolveGrammar2({
          rules: values_default(this.gastProductionsCache)
        });
        this.definitionErrors = this.definitionErrors.concat(resolverErrors);
      });
      this.TRACE_INIT("Grammar Validations", () => {
        if (isEmpty_default(resolverErrors) && this.skipValidations === false) {
          const validationErrors = validateGrammar2({
            rules: values_default(this.gastProductionsCache),
            tokenTypes: values_default(this.tokensMap),
            errMsgProvider: defaultGrammarValidatorErrorProvider,
            grammarName: className
          });
          const lookaheadValidationErrors = validateLookahead({
            lookaheadStrategy: this.lookaheadStrategy,
            rules: values_default(this.gastProductionsCache),
            tokenTypes: values_default(this.tokensMap),
            grammarName: className
          });
          this.definitionErrors = this.definitionErrors.concat(validationErrors, lookaheadValidationErrors);
        }
      });
      if (isEmpty_default(this.definitionErrors)) {
        if (this.recoveryEnabled) {
          this.TRACE_INIT("computeAllProdsFollows", () => {
            const allFollows = computeAllProdsFollows(values_default(this.gastProductionsCache));
            this.resyncFollows = allFollows;
          });
        }
        this.TRACE_INIT("ComputeLookaheadFunctions", () => {
          var _a, _b;
          (_b = (_a = this.lookaheadStrategy).initialize) === null || _b === void 0 ? void 0 : _b.call(_a, {
            rules: values_default(this.gastProductionsCache)
          });
          this.preComputeLookaheadFunctions(values_default(this.gastProductionsCache));
        });
      }
      if (!_Parser.DEFER_DEFINITION_ERRORS_HANDLING && !isEmpty_default(this.definitionErrors)) {
        defErrorsMsgs = map_default(this.definitionErrors, (defError) => defError.message);
        throw new Error(`Parser Definition Errors detected:
 ${defErrorsMsgs.join("\n-------------------------------\n")}`);
      }
    });
  }
  constructor(tokenVocabulary, config) {
    this.definitionErrors = [];
    this.selfAnalysisDone = false;
    const that = this;
    that.initErrorHandler(config);
    that.initLexerAdapter();
    that.initLooksAhead(config);
    that.initRecognizerEngine(tokenVocabulary, config);
    that.initRecoverable(config);
    that.initTreeBuilder(config);
    that.initContentAssist();
    that.initGastRecorder(config);
    that.initPerformanceTracer(config);
    if (has_default(config, "ignoredIssues")) {
      throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.");
    }
    this.skipValidations = has_default(config, "skipValidations") ? config.skipValidations : DEFAULT_PARSER_CONFIG.skipValidations;
  }
};
Parser.DEFER_DEFINITION_ERRORS_HANDLING = false;
applyMixins(Parser, [
  Recoverable,
  LooksAhead,
  TreeBuilder,
  LexerAdapter,
  RecognizerEngine,
  RecognizerApi,
  ErrorHandler,
  ContentAssist,
  GastRecorder,
  PerformanceTracer
]);
var CstParser = class extends Parser {
  constructor(tokenVocabulary, config = DEFAULT_PARSER_CONFIG) {
    const configClone = clone_default(config);
    configClone.outputCst = true;
    super(tokenVocabulary, configClone);
  }
};

// node_modules/chevrotain/lib/src/diagrams/render_public.js
function createSyntaxDiagramsCode(grammar, { resourceBase = `https://unpkg.com/chevrotain@${VERSION}/diagrams/`, css = `https://unpkg.com/chevrotain@${VERSION}/diagrams/diagrams.css` } = {}) {
  const header = `
<!-- This is a generated file -->
<!DOCTYPE html>
<meta charset="utf-8">
<style>
  body {
    background-color: hsl(30, 20%, 95%)
  }
</style>

`;
  const cssHtml = `
<link rel='stylesheet' href='${css}'>
`;
  const scripts = `
<script src='${resourceBase}vendor/railroad-diagrams.js'><\/script>
<script src='${resourceBase}src/diagrams_builder.js'><\/script>
<script src='${resourceBase}src/diagrams_behavior.js'><\/script>
<script src='${resourceBase}src/main.js'><\/script>
`;
  const diagramsDiv = `
<div id="diagrams" align="center"></div>    
`;
  const serializedGrammar = `
<script>
    window.serializedGrammar = ${JSON.stringify(grammar, null, "  ")};
<\/script>
`;
  const initLogic = `
<script>
    var diagramsDiv = document.getElementById("diagrams");
    main.drawDiagramsFromSerializedGrammar(serializedGrammar, diagramsDiv);
<\/script>
`;
  return header + cssHtml + scripts + diagramsDiv + serializedGrammar + initLogic;
}

// src/zinc/zinc-rule.ts
var ZincRule = /* @__PURE__ */ ((ZincRule2) => {
  ZincRule2["zinc"] = "zinc";
  ZincRule2["library"] = "library";
  ZincRule2["variable_declare"] = "variable_declare";
  ZincRule2["function_declare"] = "function_declare";
  ZincRule2["function_locals"] = "function_locals";
  ZincRule2["function_returns"] = "function_returns";
  ZincRule2["function_args"] = "function_args";
  ZincRule2["function_call"] = "function_call";
  ZincRule2["return_statement"] = "return_statement";
  ZincRule2["if_statement"] = "if_statement";
  ZincRule2["else_statement"] = "else_statement";
  ZincRule2["elseif_statement"] = "elseif_statement";
  ZincRule2["addition"] = "addition";
  ZincRule2["arrayaccess"] = "arrayaccess";
  ZincRule2["call_statement"] = "call_statement";
  ZincRule2["exitwhen_statement"] = "exitwhen_statement";
  ZincRule2["expression"] = "expression";
  ZincRule2["typedname"] = "typedname";
  ZincRule2["loop_statement"] = "loop_statement";
  ZincRule2["multiplication"] = "multiplication";
  ZincRule2["primary"] = "primary";
  ZincRule2["set_statement"] = "set_statement";
  ZincRule2["statement"] = "statement";
  ZincRule2["whitespace"] = "whitespace";
  ZincRule2["comment"] = "comment";
  ZincRule2["and"] = "and";
  ZincRule2["array"] = "array";
  ZincRule2["call"] = "call";
  ZincRule2["constant"] = "constant";
  ZincRule2["debug"] = "debug";
  ZincRule2["else"] = "else";
  ZincRule2["elseif"] = "elseif";
  ZincRule2["endfunction"] = "endfunction";
  ZincRule2["endglobals"] = "endglobals";
  ZincRule2["endif"] = "endif";
  ZincRule2["endloop"] = "endloop";
  ZincRule2["exitwhen"] = "exitwhen";
  ZincRule2["extends"] = "extends";
  ZincRule2["function"] = "function";
  ZincRule2["globals"] = "globals";
  ZincRule2["if"] = "if";
  ZincRule2["local"] = "local";
  ZincRule2["loop"] = "loop";
  ZincRule2["native"] = "native";
  ZincRule2["not"] = "not";
  ZincRule2["nothing"] = "nothing";
  ZincRule2["or"] = "or";
  ZincRule2["returns"] = "returns";
  ZincRule2["return"] = "return";
  ZincRule2["set"] = "set";
  ZincRule2["takes"] = "takes";
  ZincRule2["then"] = "then";
  ZincRule2["type"] = "type";
  ZincRule2["comma"] = "comma";
  ZincRule2["equals"] = "equals";
  ZincRule2["assign"] = "assign";
  ZincRule2["notequals"] = "notequals";
  ZincRule2["lessorequal"] = "lessorequal";
  ZincRule2["less"] = "less";
  ZincRule2["greatorequal"] = "greatorequal";
  ZincRule2["great"] = "great";
  ZincRule2["add"] = "add";
  ZincRule2["sub"] = "sub";
  ZincRule2["mult"] = "mult";
  ZincRule2["div"] = "div";
  ZincRule2["lparen"] = "lparen";
  ZincRule2["rparen"] = "rparen";
  ZincRule2["lsquareparen"] = "lsquareparen";
  ZincRule2["rsquareparen"] = "rsquareparen";
  ZincRule2["real"] = "real";
  ZincRule2["integer"] = "integer";
  ZincRule2["linebreak"] = "linebreak";
  ZincRule2["idliteral"] = "idliteral";
  ZincRule2["stringliteral"] = "stringliteral";
  ZincRule2["identifier"] = "identifier";
  return ZincRule2;
})(ZincRule || {});
var zinc_rule_default = ZincRule;

// src/utils/char-code.ts
var CharCodeWhitespaceBreakList = [
  9 /* HorizontalTab */,
  10 /* LineFeed */,
  11 /* LineTabulation */,
  12 /* FormFeed */,
  13 /* CarriageReturn */,
  32 /* Space */,
  133 /* NextLine */
];
var CharCodeBreakList = [
  10 /* LineFeed */,
  13 /* CarriageReturn */
];
var CharCodeDigitList = [];
for (let i = 48 /* d0 */; i <= 57 /* d9 */; i++)
  CharCodeDigitList.push(i);
var CharCodeLetterList = [];
for (let i = 65 /* A */; i <= 90 /* Z */; i++)
  CharCodeLetterList.push(i);
for (let i = 97 /* a */; i <= 122 /* z */; i++)
  CharCodeLetterList.push(i);

// src/zinc/zinc-tokens.ts
var add = (config) => {
  return createToken(config);
};
var keyword = (k) => {
  return createToken({
    name: k,
    pattern: new RegExp(`\\b${k}\\b`),
    start_chars_hint: [k.charCodeAt(0)],
    line_breaks: false
  });
};
var numberColor = "#e760cc";
var operatorColor = "#e7be60";
var parenColor = "#e1d132";
var ZincTokens = {
  [zinc_rule_default.whitespace]: add({
    name: zinc_rule_default.whitespace,
    pattern: /\s+/,
    line_breaks: true,
    start_chars_hint: CharCodeWhitespaceBreakList,
    group: Lexer.SKIPPED
  }),
  [zinc_rule_default.comment]: add({
    name: zinc_rule_default.comment,
    pattern: /\/\/[^\r\n]*/,
    line_breaks: false,
    start_chars_hint: [47 /* Slash */],
    color: "#308030"
  }),
  [zinc_rule_default.linebreak]: add({
    name: zinc_rule_default.linebreak,
    pattern: /\n|\r\n?/,
    label: "\\n",
    start_chars_hint: CharCodeBreakList,
    line_breaks: true
  }),
  // keyword
  [zinc_rule_default.library]: keyword(zinc_rule_default.library),
  [zinc_rule_default.and]: keyword(zinc_rule_default.and),
  [zinc_rule_default.array]: keyword(zinc_rule_default.array),
  [zinc_rule_default.call]: keyword(zinc_rule_default.call),
  [zinc_rule_default.constant]: keyword(zinc_rule_default.constant),
  [zinc_rule_default.debug]: keyword(zinc_rule_default.debug),
  [zinc_rule_default.else]: keyword(zinc_rule_default.else),
  [zinc_rule_default.elseif]: keyword(zinc_rule_default.elseif),
  [zinc_rule_default.endfunction]: keyword(zinc_rule_default.endfunction),
  [zinc_rule_default.endglobals]: keyword(zinc_rule_default.endglobals),
  [zinc_rule_default.endif]: keyword(zinc_rule_default.endif),
  [zinc_rule_default.endloop]: keyword(zinc_rule_default.endloop),
  [zinc_rule_default.exitwhen]: keyword(zinc_rule_default.exitwhen),
  [zinc_rule_default.extends]: keyword(zinc_rule_default.extends),
  [zinc_rule_default.function]: keyword(zinc_rule_default.function),
  [zinc_rule_default.globals]: keyword(zinc_rule_default.globals),
  [zinc_rule_default.if]: keyword(zinc_rule_default.if),
  [zinc_rule_default.local]: keyword(zinc_rule_default.local),
  [zinc_rule_default.loop]: keyword(zinc_rule_default.loop),
  [zinc_rule_default.native]: keyword(zinc_rule_default.native),
  [zinc_rule_default.not]: keyword(zinc_rule_default.not),
  [zinc_rule_default.nothing]: keyword(zinc_rule_default.nothing),
  [zinc_rule_default.or]: keyword(zinc_rule_default.or),
  [zinc_rule_default.returns]: keyword(zinc_rule_default.returns),
  [zinc_rule_default.return]: keyword(zinc_rule_default.return),
  [zinc_rule_default.set]: keyword(zinc_rule_default.set),
  [zinc_rule_default.takes]: keyword(zinc_rule_default.takes),
  [zinc_rule_default.then]: keyword(zinc_rule_default.then),
  [zinc_rule_default.type]: keyword(zinc_rule_default.type),
  // operator
  [zinc_rule_default.comma]: add({
    name: zinc_rule_default.comma,
    pattern: /,/,
    start_chars_hint: [44 /* Comma */],
    label: ",",
    line_breaks: false,
    color: "#FFFFFF"
  }),
  [zinc_rule_default.equals]: add({
    name: zinc_rule_default.equals,
    pattern: /==/,
    start_chars_hint: [61 /* Equal */],
    line_breaks: false,
    label: "==",
    color: operatorColor
  }),
  [zinc_rule_default.assign]: add({
    name: zinc_rule_default.assign,
    pattern: /=/,
    start_chars_hint: [61 /* Equal */],
    line_breaks: false,
    label: "=",
    color: operatorColor
  }),
  [zinc_rule_default.notequals]: add({
    name: zinc_rule_default.notequals,
    pattern: /!=/,
    start_chars_hint: [33 /* Exclamation */],
    line_breaks: false,
    label: "!=",
    color: operatorColor
  }),
  [zinc_rule_default.lessorequal]: add({
    name: zinc_rule_default.lessorequal,
    pattern: /<=/,
    start_chars_hint: [60 /* Less */],
    line_breaks: false,
    label: "<=",
    color: operatorColor
  }),
  [zinc_rule_default.less]: add({
    name: zinc_rule_default.less,
    pattern: /</,
    start_chars_hint: [60 /* Less */],
    line_breaks: false,
    label: "<",
    color: operatorColor
  }),
  [zinc_rule_default.greatorequal]: add({
    name: zinc_rule_default.greatorequal,
    pattern: />=/,
    start_chars_hint: [62 /* Greater */],
    line_breaks: false,
    label: ">=",
    color: operatorColor
  }),
  [zinc_rule_default.great]: add({
    name: zinc_rule_default.great,
    pattern: />/,
    start_chars_hint: [62 /* Greater */],
    line_breaks: false,
    label: ">",
    color: operatorColor
  }),
  [zinc_rule_default.add]: add({
    name: zinc_rule_default.add,
    pattern: /\+/,
    start_chars_hint: [43 /* Plus */],
    line_breaks: false,
    label: "+",
    color: operatorColor
  }),
  [zinc_rule_default.sub]: add({
    name: zinc_rule_default.sub,
    pattern: /-/,
    start_chars_hint: [45 /* Minus */],
    line_breaks: false,
    label: "-",
    color: operatorColor
  }),
  [zinc_rule_default.mult]: add({
    name: zinc_rule_default.mult,
    pattern: /\*/,
    start_chars_hint: [42 /* Asterisk */],
    line_breaks: false,
    label: "*",
    color: operatorColor
  }),
  [zinc_rule_default.div]: add({
    name: zinc_rule_default.div,
    pattern: /\//,
    start_chars_hint: [47 /* Slash */],
    line_breaks: false,
    label: "/",
    color: operatorColor
  }),
  [zinc_rule_default.lparen]: add({
    name: zinc_rule_default.lparen,
    pattern: /\(/,
    start_chars_hint: [40 /* LeftParenthesis */],
    line_breaks: false,
    label: "(",
    color: parenColor
  }),
  [zinc_rule_default.rparen]: add({
    name: zinc_rule_default.rparen,
    pattern: /\)/,
    start_chars_hint: [41 /* RightParenthesis */],
    line_breaks: false,
    label: ")",
    color: parenColor
  }),
  [zinc_rule_default.lsquareparen]: add({
    name: zinc_rule_default.lsquareparen,
    pattern: /\[/,
    start_chars_hint: [91 /* LeftSquareBracket */],
    line_breaks: false,
    label: "[",
    color: parenColor
  }),
  [zinc_rule_default.rsquareparen]: add({
    name: zinc_rule_default.rsquareparen,
    pattern: /]/,
    start_chars_hint: [93 /* RightSquareBracket */],
    line_breaks: false,
    label: "]",
    color: parenColor
  }),
  //
  [zinc_rule_default.idliteral]: add({
    name: zinc_rule_default.idliteral,
    pattern: /'[^']*'/,
    line_breaks: true,
    start_chars_hint: [39 /* Apostrophe */],
    color: numberColor
  }),
  [zinc_rule_default.stringliteral]: add({
    name: zinc_rule_default.stringliteral,
    pattern: /"[^"\\]*(?:\\.[^"\\]*)*"/,
    start_chars_hint: [34 /* Quotation */],
    line_breaks: true,
    color: "#CE9178"
  }),
  [zinc_rule_default.real]: add({
    name: zinc_rule_default.real,
    pattern: /\d+\.\d*|\.\d+/,
    line_breaks: false,
    start_chars_hint: [46 /* Dot */, ...CharCodeDigitList],
    color: numberColor
  }),
  [zinc_rule_default.integer]: add({
    name: zinc_rule_default.integer,
    pattern: /\b0x[0-9a-z]+|\$[0-9a-z]+|\d+\b/i,
    start_chars_hint: [36 /* Dollar */, ...CharCodeDigitList],
    line_breaks: false,
    color: numberColor
  }),
  [zinc_rule_default.identifier]: add({
    name: zinc_rule_default.identifier,
    pattern: /\b[a-zA-Z][a-zA-Z0-9_]*\b/,
    line_breaks: false,
    start_chars_hint: CharCodeLetterList
  })
};
var zinc_tokens_default = ZincTokens;

// src/zinc/zinc-tokens-list.ts
var zinc_tokens_list_default = Object.values(zinc_tokens_default);

// src/zinc/zinc-parser.ts
var ZincParser = class extends CstParser {
  constructor(config) {
    super(zinc_tokens_list_default, config);
    const $ = this;
    $.RULE(zinc_rule_default.zinc, () => $.MANY(() => $.SUBRULE($[zinc_rule_default.function_declare])));
    $.RULE(zinc_rule_default.function_declare, () => {
      $.OPTION(() => $.CONSUME(zinc_tokens_default[zinc_rule_default.constant]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.function]);
      $.CONSUME2(zinc_tokens_default[zinc_rule_default.identifier]);
      $.CONSUME3(zinc_tokens_default[zinc_rule_default.takes]);
      $.SUBRULE($[zinc_rule_default.function_args]);
      $.CONSUME4(zinc_tokens_default[zinc_rule_default.returns]);
      $.SUBRULE($[zinc_rule_default.function_returns]);
      $.MANY1(() => $.SUBRULE($[zinc_rule_default.function_locals]));
      $.MANY2(() => $.SUBRULE($[zinc_rule_default.statement]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.endfunction]);
    });
    $.RULE(zinc_rule_default.variable_declare, () => {
      $.OPTION(() => $.OR([
        { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.constant]) },
        { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.local]) }
      ]));
      $.SUBRULE($[zinc_rule_default.typedname]);
      $.OPTION2(() => {
        $.CONSUME(zinc_tokens_default[zinc_rule_default.assign]);
        $.SUBRULE($[zinc_rule_default.expression]);
      });
    });
    $.RULE(zinc_rule_default.if_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.if]);
      $.SUBRULE($[zinc_rule_default.expression]);
      $.CONSUME(zinc_tokens_default[zinc_rule_default.then]);
      $.MANY(() => $.SUBRULE($[zinc_rule_default.statement]));
      $.MANY2(() => $.SUBRULE($[zinc_rule_default.elseif_statement]));
      $.OPTION(() => $.SUBRULE($[zinc_rule_default.else_statement]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.endif]);
    });
    $.RULE(zinc_rule_default.elseif_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.elseif]);
      $.SUBRULE($[zinc_rule_default.expression]);
      $.CONSUME(zinc_tokens_default[zinc_rule_default.then]);
      $.MANY(() => $.SUBRULE($[zinc_rule_default.statement]));
    });
    $.RULE(zinc_rule_default.else_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.else]);
      $.MANY(() => $.SUBRULE($[zinc_rule_default.statement]));
    });
    $.RULE(zinc_rule_default.call_statement, () => {
      $.OPTION(() => $.CONSUME(zinc_tokens_default[zinc_rule_default.debug]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.call]);
      $.SUBRULE($[zinc_rule_default.function_call]);
    });
    $.RULE(zinc_rule_default.return_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.return]);
      $.OPTION(() => $.SUBRULE($[zinc_rule_default.expression]));
    });
    $.RULE(zinc_rule_default.set_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.set]);
      $.CONSUME(zinc_tokens_default[zinc_rule_default.identifier]);
      $.OPTION(() => $.SUBRULE($[zinc_rule_default.arrayaccess]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.assign]);
      $.SUBRULE($[zinc_rule_default.expression]);
    });
    $.RULE(zinc_rule_default.loop_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.loop]);
      $.MANY(() => $.SUBRULE($[zinc_rule_default.statement]));
      $.CONSUME(zinc_tokens_default[zinc_rule_default.endloop]);
    });
    $.RULE(zinc_rule_default.exitwhen_statement, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.exitwhen]);
      $.SUBRULE($[zinc_rule_default.expression]);
    });
    $.RULE(zinc_rule_default.function_args, () => {
      $.OR([
        { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.nothing]) },
        {
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              SEP: zinc_tokens_default[zinc_rule_default.comma],
              DEF: () => $.SUBRULE($[zinc_rule_default.typedname])
            });
          }
        }
      ]);
    });
    $.RULE(zinc_rule_default.typedname, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.identifier]);
      $.OPTION2(() => $.CONSUME(zinc_tokens_default[zinc_rule_default.array]));
      $.CONSUME2(zinc_tokens_default[zinc_rule_default.identifier]);
    });
    $.RULE(zinc_rule_default.function_returns, () => {
      $.OR([
        { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.nothing]) },
        { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.identifier]) }
      ]);
    });
    $.RULE(zinc_rule_default.function_locals, () => {
      $.OR([
        { ALT: () => $.SUBRULE($[zinc_rule_default.variable_declare]) }
      ]);
    });
    $.RULE(zinc_rule_default.expression, () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($[zinc_rule_default.addition]);
            $.MANY(() => {
              $.OR2([
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.and]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.or]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.equals]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.notequals]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.less]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.lessorequal]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.great]) },
                { ALT: () => $.CONSUME(zinc_tokens_default[zinc_rule_default.greatorequal]) }
              ]);
              $.SUBRULE2($[zinc_rule_default.addition]);
            });
          }
        }
      ]);
    });
    $.RULE(zinc_rule_default.addition, () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($[zinc_rule_default.multiplication]);
            $.MANY(() => {
              $.OR2([
                { ALT: () => $.CONSUME2(zinc_tokens_default[zinc_rule_default.add]) },
                { ALT: () => $.CONSUME3(zinc_tokens_default[zinc_rule_default.sub]) }
              ]);
              $.SUBRULE2($[zinc_rule_default.multiplication]);
            });
          }
        }
      ]);
    });
    $.RULE(zinc_rule_default.multiplication, () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($[zinc_rule_default.primary]);
            $.MANY(() => {
              $.OR2([
                { ALT: () => $.CONSUME2(zinc_tokens_default[zinc_rule_default.mult]) },
                { ALT: () => $.CONSUME3(zinc_tokens_default[zinc_rule_default.div]) }
              ]);
              $.SUBRULE2($[zinc_rule_default.primary]);
            });
          }
        }
      ]);
    });
    $.RULE(zinc_rule_default.primary, () => {
      $.OR([
        {
          ALT: () => {
            $.OPTION(() => $.CONSUME(zinc_tokens_default[zinc_rule_default.sub]));
            $.CONSUME(zinc_tokens_default[zinc_rule_default.integer]);
          }
        },
        {
          ALT: () => {
            $.CONSUME(zinc_tokens_default[zinc_rule_default.not]);
            $.SUBRULE($[zinc_rule_default.primary]);
          }
        },
        {
          ALT: () => {
            $.OPTION5(() => $.CONSUME3(zinc_tokens_default[zinc_rule_default.sub]));
            $.SUBRULE($[zinc_rule_default.function_call]);
          }
        },
        {
          ALT: () => {
            $.OPTION6(() => $.CONSUME6(zinc_tokens_default[zinc_rule_default.sub]));
            $.CONSUME(zinc_tokens_default[zinc_rule_default.lparen]);
            $.SUBRULE2($[zinc_rule_default.expression]);
            $.CONSUME(zinc_tokens_default[zinc_rule_default.rparen]);
          }
        },
        {
          ALT: () => {
            $.OPTION3(() => $.CONSUME5(zinc_tokens_default[zinc_rule_default.sub]));
            $.CONSUME3(zinc_tokens_default[zinc_rule_default.identifier]);
            $.OPTION4(() => $.SUBRULE($[zinc_rule_default.arrayaccess]));
          }
        },
        {
          ALT: () => {
            $.CONSUME(zinc_tokens_default[zinc_rule_default.function]);
            $.CONSUME4(zinc_tokens_default[zinc_rule_default.identifier]);
          }
        },
        {
          ALT: () => {
            $.OPTION2(() => $.CONSUME2(zinc_tokens_default[zinc_rule_default.sub]));
            $.CONSUME3(zinc_tokens_default[zinc_rule_default.real]);
          }
        },
        {
          ALT: () => $.CONSUME3(zinc_tokens_default[zinc_rule_default.idliteral])
        },
        {
          ALT: () => $.CONSUME3(zinc_tokens_default[zinc_rule_default.stringliteral])
        }
      ]);
    });
    $.RULE(zinc_rule_default.arrayaccess, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.lsquareparen]);
      $.SUBRULE3($[zinc_rule_default.expression]);
      $.CONSUME(zinc_tokens_default[zinc_rule_default.rsquareparen]);
    });
    $.RULE(zinc_rule_default.function_call, () => {
      $.CONSUME(zinc_tokens_default[zinc_rule_default.identifier]);
      $.CONSUME2(zinc_tokens_default[zinc_rule_default.lparen]);
      $.MANY_SEP({
        SEP: zinc_tokens_default[zinc_rule_default.comma],
        DEF: () => $.SUBRULE($[zinc_rule_default.expression])
      });
      $.CONSUME3(zinc_tokens_default[zinc_rule_default.rparen]);
    });
    $.RULE(zinc_rule_default.statement, () => {
      $.OR4([
        { ALT: () => $.SUBRULE($[zinc_rule_default.call_statement]) },
        { ALT: () => $.SUBRULE($[zinc_rule_default.set_statement]) },
        { ALT: () => $.SUBRULE($[zinc_rule_default.loop_statement]) },
        { ALT: () => $.SUBRULE($[zinc_rule_default.exitwhen_statement]) },
        { ALT: () => $.SUBRULE($[zinc_rule_default.if_statement]) },
        { ALT: () => $.SUBRULE($[zinc_rule_default.return_statement]) }
      ]);
    });
    this.performSelfAnalysis();
  }
};

// src/zinc/zinc-visitor.ts
var import_vscode2 = require("vscode");

// src/semantic/token-legend.ts
var token_legend_default = {
  jass_comment: 0,
  jass_and: 1,
  jass_array: 2,
  jass_call: 3,
  jass_constant: 4,
  jass_debug: 5,
  jass_else: 6,
  jass_elseif: 7,
  jass_endfunction: 8,
  jass_endglobals: 9,
  jass_endif: 10,
  jass_endloop: 11,
  jass_exitwhen: 12,
  jass_extends: 13,
  jass_function: 14,
  jass_globals: 15,
  jass_if: 16,
  jass_local: 17,
  jass_loop: 18,
  jass_native: 19,
  jass_not: 20,
  jass_nothing: 21,
  jass_or: 22,
  jass_returns: 23,
  jass_return: 24,
  jass_set: 25,
  jass_takes: 26,
  jass_then: 27,
  jass_type: 28,
  jass_comma: 29,
  jass_equals: 30,
  jass_assign: 31,
  jass_notequals: 32,
  jass_lessorequal: 33,
  jass_less: 34,
  jass_greatorequal: 35,
  jass_great: 36,
  jass_add: 37,
  jass_sub: 38,
  jass_mult: 39,
  jass_div: 40,
  jass_lparen: 41,
  jass_rparen: 42,
  jass_lsquareparen: 43,
  jass_rsquareparen: 44,
  jass_real: 45,
  jass_integer: 46,
  jass_idliteral: 47,
  jass_stringliteral: 48,
  jass_variable: 49,
  jass_function_user: 50,
  jass_function_native: 51,
  jass_type_name: 52,
  jass_argument: 53,
  wts_string: 54,
  wts_index: 55,
  wts_comment: 56,
  wts_paren: 57,
  wts_text: 58
};

// node_modules/i18next/dist/esm/i18next.js
var consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    if (console && console[type])
      console[type].apply(console, args);
  }
};
var Logger = class _Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug)
      return null;
    if (typeof args[0] === "string")
      args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new _Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new _Logger(this.logger, options);
  }
};
var baseLogger = new Logger();
var EventEmitter = class {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      this.observers[event] = this.observers[event] || [];
      this.observers[event].push(listener);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event])
      return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event] = this.observers[event].filter((l) => l !== listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = [].concat(this.observers[event]);
      cloned.forEach((observer) => {
        observer(...args);
      });
    }
    if (this.observers["*"]) {
      const cloned = [].concat(this.observers["*"]);
      cloned.forEach((observer) => {
        observer.apply(observer, [event, ...args]);
      });
    }
  }
};
function defer() {
  let res;
  let rej;
  const promise = new Promise((resolve, reject2) => {
    res = resolve;
    rej = reject2;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null)
    return "";
  return "" + object;
}
function copy(a, s, t2) {
  a.forEach((m) => {
    if (s[m])
      t2[m] = s[m];
  });
}
function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;
  }
  function canNotTraverseDeeper() {
    return !object || typeof object === "string";
  }
  const stack = typeof path !== "string" ? [].concat(path) : path.split(".");
  while (stack.length > 1) {
    if (canNotTraverseDeeper())
      return {};
    const key = cleanKey(stack.shift());
    if (!object[key] && Empty)
      object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
  }
  if (canNotTraverseDeeper())
    return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}
function setPath(object, path, newValue) {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  if (concat)
    obj[k] = obj[k].concat(newValue);
  if (!concat)
    obj[k].push(newValue);
}
function getPath(object, path) {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj)
    return void 0;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
          if (overwrite)
            target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
function escape(data) {
  if (typeof data === "string") {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
}
var chars = [" ", ",", "?", "!", ";"];
function looksLikeObjectPath(key, nsSeparator, keySeparator) {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0)
    return true;
  const r = new RegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
}
function deepFind(obj, path) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj)
    return void 0;
  if (obj[path])
    return obj[path];
  const paths = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < paths.length; ++i) {
    if (!current)
      return void 0;
    if (typeof current[paths[i]] === "string" && i + 1 < paths.length) {
      return void 0;
    }
    if (current[paths[i]] === void 0) {
      let j = 2;
      let p = paths.slice(i, i + j).join(keySeparator);
      let mix = current[p];
      while (mix === void 0 && paths.length > i + j) {
        j++;
        p = paths.slice(i, i + j).join(keySeparator);
        mix = current[p];
      }
      if (mix === void 0)
        return void 0;
      if (mix === null)
        return null;
      if (path.endsWith(p)) {
        if (typeof mix === "string")
          return mix;
        if (p && typeof mix[p] === "string")
          return mix[p];
      }
      const joinedPath = paths.slice(i + j).join(keySeparator);
      if (joinedPath)
        return deepFind(mix, joinedPath, keySeparator);
      return void 0;
    }
    current = current[paths[i]];
  }
  return current;
}
function getCleanedCode(code) {
  if (code && code.indexOf("_") > 0)
    return code.replace("_", "-");
  return code;
}
var ResourceStore = class extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path = [lng, ns];
    if (key && typeof key !== "string")
      path = path.concat(key);
    if (key && typeof key === "string")
      path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
    }
    const result = getPath(this.data, path);
    if (result || !ignoreJSONStructure || typeof key !== "string")
      return result;
    return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key)
      path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent)
      this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m in resources) {
      if (typeof resources[m] === "string" || Object.prototype.toString.apply(resources[m]) === "[object Array]")
        this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
    }
    if (!options.silent)
      this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false
    };
    let path = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent)
      this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns)
      ns = this.options.defaultNS;
    if (this.options.compatibilityAPI === "v1")
      return {
        ...{},
        ...this.getResource(lng, ns)
      };
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
};
var postProcessor = {
  processors: {},
  addPostProcessor(module2) {
    this.processors[module2.name] = module2;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      if (this.processors[processor])
        value = this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};
var checkedLoadedFor = {};
var Translator = class _Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng)
      this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key === void 0 || key === null) {
      return false;
    }
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0)
      nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1)
        namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    if (typeof namespaces === "string")
      namespaces = [namespaces];
    return {
      key,
      namespaces
    };
  }
  translate(keys2, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object")
      options = {
        ...options
      };
    if (!options)
      options = {};
    if (keys2 === void 0 || keys2 === null)
      return "";
    if (!Array.isArray(keys2))
      keys2 = [String(keys2)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys2[keys2.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace
        };
      }
      return key;
    }
    const resolved = this.resolve(keys2, options);
    let res = resolved && resolved.res;
    const resUsedKey = resolved && resolved.usedKey || key;
    const resExactUsedKey = resolved && resolved.exactUsedKey || key;
    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number";
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === "string" && resType === "[object Array]")) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = resType === "[object Array]";
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            copy2[m] = this.translate(deepKey, {
              ...options,
              ...{
                joinArrays: false,
                ns: namespaces
              }
            });
            if (copy2[m] === deepKey)
              copy2[m] = res[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && typeof joinArrays === "string" && resType === "[object Array]") {
      res = res.join(joinArrays);
      if (res)
        res = this.extendTranslation(res, keys2, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      const needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
      const hasDefaultValue = _Translator.hasDefaultValue(options);
      const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
      const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
        ordinal: false
      }) : "";
      const defaultValue = options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk && fk.res)
            this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              this.pluralResolver.getSuffixes(language, options).forEach((suffix) => {
                send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys2, options, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey)
        res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        if (this.options.compatibilityAPI !== "v1") {
          res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
        } else {
          res = this.options.parseMissingKeyHandler(res);
        }
      }
    }
    if (returnDetails) {
      resolved.res = res;
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved, lastKey) {
    var _this = this;
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation)
        this.interpolator.init({
          ...options,
          ...{
            interpolation: {
              ...this.options.interpolation,
              ...options.interpolation
            }
          }
        });
      const skipOnVariables = typeof res === "string" && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = options.replace && typeof options.replace !== "string" ? options.replace : options;
      if (this.options.interpolation.defaultVariables)
        data = {
          ...this.options.interpolation.defaultVariables,
          ...data
        };
      res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft)
          options.nest = false;
      }
      if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res)
        options.lng = resolved.usedLng;
      if (options.nest !== false)
        res = this.interpolator.nest(res, function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          if (lastKey && lastKey[0] === args[0] && !options.context) {
            _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
            return null;
          }
          return _this.translate(...args, key);
        }, options);
      if (options.interpolation)
        this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = typeof postProcess === "string" ? [postProcess] : postProcess;
    if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: resolved,
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys2) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (typeof keys2 === "string")
      keys2 = [keys2];
    keys2.forEach((k) => {
      if (this.isValidLookup(found))
        return;
      const extracted = this.extractFromKey(k, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS)
        namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const needsContextHandling = options.context !== void 0 && (typeof options.context === "string" || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found))
          return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found))
            return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling)
              pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat && this.i18nFormat.getResource)
      return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
};
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var LanguageUtil = class {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0)
      return null;
    const p = code.split("-");
    if (p.length === 2)
      return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x")
      return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0)
      return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (typeof code === "string" && code.indexOf("-") > -1) {
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p = code.split("-");
      if (this.options.lowerCaseLng) {
        p = p.map((part) => part.toLowerCase());
      } else if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1)
          p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase();
        if (p[1].length === 2)
          p[1] = p[1].toUpperCase();
        if (p[0] !== "sgn" && p[2].length === 2)
          p[2] = p[2].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1)
          p[1] = capitalize(p[1].toLowerCase());
        if (specialCases.indexOf(p[2].toLowerCase()) > -1)
          p[2] = capitalize(p[2].toLowerCase());
      }
      return p.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes)
      return null;
    let found;
    codes.forEach((code) => {
      if (found)
        return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng))
        found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found)
          return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly))
          return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly)
            return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0)
            return;
          if (supportedLng.indexOf(lngOnly) === 0)
            return supportedLng;
        });
      });
    }
    if (!found)
      found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks)
      return [];
    if (typeof fallbacks === "function")
      fallbacks = fallbacks(code);
    if (typeof fallbacks === "string")
      fallbacks = [fallbacks];
    if (Object.prototype.toString.apply(fallbacks) === "[object Array]")
      return fallbacks;
    if (!code)
      return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found)
      found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found)
      found = fallbacks[this.formatLanguageCode(code)];
    if (!found)
      found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found)
      found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c)
        return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (typeof code === "string" && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly")
        addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly")
        addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly")
        addCode(this.getLanguagePartFromCode(code));
    } else if (typeof code === "string") {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0)
        addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
};
var sets = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function(n) {
    return Number(n > 1);
  },
  2: function(n) {
    return Number(n != 1);
  },
  3: function(n) {
    return 0;
  },
  4: function(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function(n) {
    return Number(n >= 2);
  },
  10: function(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function(n) {
    return Number(n !== 0);
  },
  14: function(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function(n) {
    return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
  },
  18: function(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};
var nonIntlVersions = ["v1", "v2", "v3"];
var intlVersions = ["v4"];
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
function createRules() {
  const rules = {};
  sets.forEach((set) => {
    set.lngs.forEach((l) => {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}
var PluralResolver = class {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
      this.options.compatibilityJSON = "v3";
      this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
    }
    this.rules = createRules();
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      try {
        return new Intl.PluralRules(getCleanedCode(code), {
          type: options.ordinal ? "ordinal" : "cardinal"
        });
      } catch {
        return;
      }
    }
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (this.shouldUseIntlApi()) {
      return rule && rule.resolvedOptions().pluralCategories.length > 1;
    }
    return rule && rule.numbers.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (!rule) {
      return [];
    }
    if (this.shouldUseIntlApi()) {
      return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
    }
    return rule.numbers.map((number) => this.getSuffix(code, number, options));
  }
  getSuffix(code, count) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      if (this.shouldUseIntlApi()) {
        return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
      }
      return this.getSuffixRetroCompatible(rule, count);
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return "";
  }
  getSuffixRetroCompatible(rule, count) {
    const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
    let suffix = rule.numbers[idx];
    if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }
    }
    const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
    if (this.options.compatibilityJSON === "v1") {
      if (suffix === 1)
        return "";
      if (typeof suffix === "number")
        return `_plural_${suffix.toString()}`;
      return returnSuffix();
    } else if (this.options.compatibilityJSON === "v2") {
      return returnSuffix();
    } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      return returnSuffix();
    }
    return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
  }
  shouldUseIntlApi() {
    return !nonIntlVersions.includes(this.options.compatibilityJSON);
  }
};
function deepFindWithDefaults(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && typeof key === "string") {
    path = deepFind(data, key, keySeparator);
    if (path === void 0)
      path = deepFind(defaultData, key, keySeparator);
  }
  return path;
}
var Interpolator = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || ((value) => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation)
      options.interpolation = {
        escapeValue: true
      };
    const iOpts = options.interpolation;
    this.escape = iOpts.escape !== void 0 ? iOpts.escape : escape;
    this.escapeValue = iOpts.escapeValue !== void 0 ? iOpts.escapeValue : true;
    this.useRawValueToEscape = iOpts.useRawValueToEscape !== void 0 ? iOpts.useRawValueToEscape : false;
    this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || "{{";
    this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || "}}";
    this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
    this.unescapePrefix = iOpts.unescapeSuffix ? "" : iOpts.unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : iOpts.unescapeSuffix || "";
    this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ",";
    this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1e3;
    this.alwaysFormat = iOpts.alwaysFormat !== void 0 ? iOpts.alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options)
      this.init(this.options);
  }
  resetRegExp() {
    const regexpStr = `${this.prefix}(.+?)${this.suffix}`;
    this.regexp = new RegExp(regexpStr, "g");
    const regexpUnescapeStr = `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`;
    this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
    const nestingRegexpStr = `${this.nestingPrefix}(.+?)${this.nestingSuffix}`;
    this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    function regexSafe(val) {
      return val.replace(/\$/g, "$$$$");
    }
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = typeof temp === "string" ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (typeof value !== "string" && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    function handleHasOptions(key, inheritedOptions) {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0)
        return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions)
          clonedOptions = {
            ...inheritedOptions,
            ...clonedOptions
          };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      delete clonedOptions.defaultValue;
      return key;
    }
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && typeof clonedOptions.replace !== "string" ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r.shift();
        formatters = r;
        doReduce = true;
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && typeof value !== "string")
        return value;
      if (typeof value !== "string")
        value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (doReduce) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
};
function parseFormatStr(formatStr) {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency)
        formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range)
        formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (!opt)
          return;
        const [key, ...rest] = opt.split(":");
        const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
        if (!formatOptions[key.trim()])
          formatOptions[key.trim()] = val;
        if (val === "false")
          formatOptions[key.trim()] = false;
        if (val === "true")
          formatOptions[key.trim()] = true;
        if (!isNaN(val))
          formatOptions[key.trim()] = parseInt(val, 10);
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
}
function createCachedFormatter(fn) {
  const cache = {};
  return function invokeFormatter(val, lng, options) {
    const key = lng + JSON.stringify(options);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
}
var Formatter = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    const iOpts = options.interpolation;
    this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
};
function removePending(q, name) {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
}
var Connector = class extends EventEmitter {
  constructor(backend, store, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0)
          ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0)
            pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0)
            pending[name] = true;
          if (toLoad[name] === void 0)
            toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0)
            toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces)
        toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err)
      this.emit("failedLoading", lng, ns, err);
    if (data) {
      this.store.addResourceBundle(lng, ns, data);
    }
    this.state[name] = err ? -1 : 2;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err)
        q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l])
            loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0)
                loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length)
      return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (typeof languages === "string")
      languages = this.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === "string")
      namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length)
        callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err)
        this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data)
        this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "")
      return;
    if (this.backend && this.backend.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0])
      return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
};
function get2() {
  return {
    debug: false,
    initImmediate: true,
    ns: ["translation"],
    defaultNS: ["translation"],
    fallbackLng: ["dev"],
    fallbackNS: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: "all",
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: ".",
    nsSeparator: ":",
    pluralSeparator: "_",
    contextSeparator: "_",
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: "fallback",
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: false,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      let ret = {};
      if (typeof args[1] === "object")
        ret = args[1];
      if (typeof args[1] === "string")
        ret.defaultValue = args[1];
      if (typeof args[2] === "string")
        ret.tDescription = args[2];
      if (typeof args[2] === "object" || typeof args[3] === "object") {
        const options = args[3] || args[2];
        Object.keys(options).forEach((key) => {
          ret[key] = options[key];
        });
      }
      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: (value, format, lng, options) => value,
      prefix: "{{",
      suffix: "}}",
      formatSeparator: ",",
      unescapePrefix: "-",
      nestingPrefix: "$t(",
      nestingSuffix: ")",
      nestingOptionsSeparator: ",",
      maxReplaces: 1e3,
      skipOnVariables: true
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === "string")
    options.ns = [options.ns];
  if (typeof options.fallbackLng === "string")
    options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === "string")
    options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
}
function noop2() {
}
function bindMemberFunctions(inst) {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
}
var I18n = class _I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initImmediate) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options.defaultNS && options.defaultNS !== false && options.ns) {
      if (typeof options.ns === "string") {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get2();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    if (this.options.compatibilityAPI !== "v1") {
      this.options.interpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation
      };
    }
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    function createClassOnDemand(ClassOrObject) {
      if (!ClassOrObject)
        return null;
      if (typeof ClassOrObject === "function")
        return new ClassOrObject();
      return ClassOrObject;
    }
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else if (typeof Intl !== "undefined") {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", function(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init)
          s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init)
          s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init)
          m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback)
      callback = noop2;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev")
        this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        if (this.isInitialized && !this.initializedStoreOnce)
          this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone)
          this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized)
        return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop2;
    let usedCallback = callback;
    const usedLng = typeof language === "string" ? language : this.language;
    if (typeof language === "function")
      usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng && usedLng.toLowerCase() === "cimode")
        return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng)
          return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (toLoad.indexOf(l) < 0)
            toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      if (this.options.preload) {
        this.options.preload.forEach((l) => append(l));
      }
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language)
          this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (!lngs)
      lngs = this.languages;
    if (!ns)
      ns = this.options.ns;
    if (!callback)
      callback = noop2;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module2) {
    if (!module2)
      throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module2.type)
      throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module2.type === "backend") {
      this.modules.backend = module2;
    }
    if (module2.type === "logger" || module2.log && module2.warn && module2.error) {
      this.modules.logger = module2;
    }
    if (module2.type === "languageDetector") {
      this.modules.languageDetector = module2;
    }
    if (module2.type === "i18nFormat") {
      this.modules.i18nFormat = module2;
    }
    if (module2.type === "postProcessor") {
      postProcessor.addPostProcessor(module2);
    }
    if (module2.type === "formatter") {
      this.modules.formatter = module2;
    }
    if (module2.type === "3rdParty") {
      this.modules.external.push(module2);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages)
      return;
    if (["cimode", "dev"].indexOf(l) > -1)
      return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1)
        continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        setLngProps(l);
        this.translator.changeLanguage(l);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l);
        this.logger.log("languageChanged", l);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback)
        callback(err, function() {
          return _this2.t(...arguments);
        });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector)
        lngs = [];
      const l = typeof lngs === "string" ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language)
          this.translator.changeLanguage(l);
        if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage)
          this.services.languageDetector.cacheUserLanguage(l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (typeof lng === "string") {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode")
      return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0)
        return preResult;
    }
    if (this.hasResourceBundle(lng, ns))
      return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages)
      return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns)))
      return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback)
        callback();
      return Promise.resolve();
    }
    if (typeof ns === "string")
      ns = [ns];
    ns.forEach((n) => {
      if (this.options.ns.indexOf(n) < 0)
        this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback)
        callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (typeof lngs === "string")
      lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0);
    if (!newLngs.length) {
      if (callback)
        callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback)
        callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng)
      lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
    if (!lng)
      return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get2());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new _I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop2;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore)
      delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone2 = new _I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone2.logger = clone2.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone2[m] = this[m];
    });
    clone2.services = {
      ...this.services
    };
    clone2.services.utils = {
      hasLoadedNamespace: clone2.hasLoadedNamespace.bind(clone2)
    };
    if (forkResourceStore) {
      clone2.store = new ResourceStore(this.store.data, mergedOptions);
      clone2.services.resourceStore = clone2.store;
    }
    clone2.translator = new Translator(clone2.services, mergedOptions);
    clone2.translator.on("*", function(event) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      clone2.emit(event, ...args);
    });
    clone2.init(mergedOptions, callback);
    clone2.translator.options = mergedOptions;
    clone2.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone2.hasLoadedNamespace.bind(clone2)
    };
    return clone2;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
};
var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

// src/utils/i18n.ts
var import_vscode = require("vscode");
var en = {
  // lexer
  ["lexerError" /* lexerError */]: "Lexer:",
  ["unexpectedCharacter" /* unexpectedCharacter */]: `$t(${"lexerError" /* lexerError */}) Unexpected character.`,
  ["unableToPopLexerMode" /* unableToPopLexerMode */]: `$t(${"lexerError" /* lexerError */}) Unable to pop lexer mode.`,
  // parser
  ["parserError" /* parserError */]: "Parser:",
  ["mismatchToken" /* mismatchToken */]: `$t(${"lexerError" /* lexerError */}) Mismatch tokens.`,
  ["notAllInputParsed" /* notAllInputParsed */]: `$t(${"lexerError" /* lexerError */}) Not all input parsed.`,
  ["noViableAlt" /* noViableAlt */]: `$t(${"lexerError" /* lexerError */}) No viable alt.`,
  ["earlyExit" /* earlyExit */]: `$t(${"lexerError" /* lexerError */}) Early Exit.`,
  // validator
  ["stringIndexRedeclareError" /* stringIndexRedeclareError */]: "String with index {{index}} redeclared.",
  ["localInGlobalsError" /* localInGlobalsError */]: "Local variable not allowed in globals block.",
  ["multilineStringError" /* multilineStringError */]: "Avoid multiline strings. Use |n or \\n to linebreak.",
  ["arrayInFunctionArgumentError" /* arrayInFunctionArgumentError */]: "Array not allowed in function argument.",
  ["localRedeclareArgumentError" /* localRedeclareArgumentError */]: "Local variable `{{name}}` redeclare argument.",
  ["localRedeclaredError" /* localRedeclaredError */]: "Local variable `{{name}}` redeclared.",
  ["constantInFunctionError" /* constantInFunctionError */]: "Constant not allowed in function.",
  ["misssingLocalKeywordError" /* misssingLocalKeywordError */]: "Missing local keyword.",
  ["sameNameArgumentError" /* sameNameArgumentError */]: "Arguments with same name `{{name}}`.",
  ["arrayInitializeError" /* arrayInitializeError */]: "Array varriables can't be initialised."
};
var ru = {
  // lexer
  ["lexerError" /* lexerError */]: "\u041B\u0435\u043A\u0441\u0435\u0440:",
  ["unexpectedCharacter" /* unexpectedCharacter */]: `$t(${"lexerError" /* lexerError */}) \u041D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u0439 \u0441\u0438\u043C\u0432\u043E\u043B.`,
  ["unableToPopLexerMode" /* unableToPopLexerMode */]: `$t(${"lexerError" /* lexerError */}) \u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0443\u0431\u0440\u0430\u0442\u044C \u0440\u0435\u0436\u0438\u043C \u043B\u0435\u043A\u0441\u0435\u0440\u0430.`,
  // parser
  ["parserError" /* parserError */]: "\u041F\u0430\u0440\u0441\u0435\u0440:",
  ["mismatchToken" /* mismatchToken */]: `$t(${"parserError" /* parserError */}) \u041D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0442\u043E\u043A\u0435\u043D.`,
  ["notAllInputParsed" /* notAllInputParsed */]: `$t(${"parserError" /* parserError */}) \u041F\u0430\u0440\u0441\u0438\u043D\u0433 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D \u043D\u0435 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E.`,
  ["noViableAlt" /* noViableAlt */]: `$t(${"parserError" /* parserError */}) \u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`,
  ["earlyExit" /* earlyExit */]: `$t(${"parserError" /* parserError */}) \u041F\u0440\u0435\u0436\u0434\u0435\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435.`,
  // validator
  ["stringIndexRedeclareError" /* stringIndexRedeclareError */]: "\u0421\u0442\u0440\u043E\u043A\u0430 \u0441 \u0438\u043D\u0434\u0435\u043A\u0441\u043E\u043C {{index}} \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0430.",
  ["localInGlobalsError" /* localInGlobalsError */]: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0431\u044A\u044F\u0432\u043B\u044F\u0442\u044C \u0432 \u0431\u043B\u043E\u043A\u0435 globals.",
  ["multilineStringError" /* multilineStringError */]: "\u0418\u0437\u0431\u0435\u0433\u0430\u0439\u0442\u0435 \u043C\u043D\u043E\u0433\u043E\u0441\u0442\u0440\u043E\u0447\u043D\u044B\u0445 \u0441\u0442\u0440\u043E\u043A. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 |n \u0438\u043B\u0438 \\n \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0430 \u0441\u0442\u0440\u043E\u043A\u0438.",
  ["arrayInFunctionArgumentError" /* arrayInFunctionArgumentError */]: "\u0417\u0430\u043F\u0440\u0435\u0448\u0435\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0441\u0441\u0438\u0432\u044B \u0432 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442\u0430\u0445 \u0444\u0443\u043D\u043A\u0446\u0438\u0438.",
  ["localRedeclareArgumentError" /* localRedeclareArgumentError */]: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F `{{name}}` \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u0442 \u0430\u0440\u0433\u0443\u043C\u0435\u043D\u0442.",
  ["localRedeclaredError" /* localRedeclaredError */]: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F `{{name}}` \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E.",
  ["constantInFunctionError" /* constantInFunctionError */]: "\u041E\u0431\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0441\u0442\u0430\u043D\u0442 \u0432 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.",
  ["misssingLocalKeywordError" /* misssingLocalKeywordError */]: "\u041D\u0435 \u0434\u043E\u0441\u0442\u0430\u0451\u0442 \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0433\u043E \u0441\u043B\u043E\u0432\u0430 `local`.",
  ["sameNameArgumentError" /* sameNameArgumentError */]: "\u0410\u0440\u0433\u0443\u043C\u0435\u043D\u0442\u044B \u0441 \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u043C \u0438\u043C\u0435\u043D\u0435\u043C `{{name}}`.",
  ["arrayInitializeError" /* arrayInitializeError */]: "\u041C\u0430\u0441\u0441\u0438\u0432\u044B \u043D\u0435\u043B\u044C\u0437\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C."
};
instance.init({
  lng: import_vscode.env.language,
  //debug: true,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ru: { translation: ru }
  }
}).then();

// src/zinc/zinc-visitor.ts
var parser = new ZincParser();
var ParserVisitor = parser.getBaseCstVisitorConstructor();
var _comment, comment_fn, _string, string_fn;
var ZincVisitor = class extends ParserVisitor {
  constructor() {
    super();
    __privateAdd(this, _comment);
    __privateAdd(this, _string);
    this.validateVisitor();
  }
  [zinc_rule_default.zinc](ctx) {
    return ctx[zinc_rule_default.root]?.map((item) => this.visit(item));
  }
  [zinc_rule_default.root](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    const native = ctx[zinc_rule_default.native_declare];
    if (native)
      return this.visit(native);
    const func = ctx[zinc_rule_default.function_declare];
    if (func)
      return this.visit(func);
  }
  [zinc_rule_default.end](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
  }
  [zinc_rule_default.native_declare](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    const b = this?.bridge;
    if (b) {
      b.mark(ctx[zinc_rule_default.constant]?.[0], token_legend_default.jass_constant);
      b.mark(ctx[zinc_rule_default.identifier]?.[0], token_legend_default.jass_function_native);
      b.mark(ctx[zinc_rule_default.native]?.[0], token_legend_default.jass_native);
      b.mark(ctx[zinc_rule_default.takes]?.[0], token_legend_default.jass_takes);
      b.mark(ctx[zinc_rule_default.returns]?.[0], token_legend_default.jass_returns);
    }
    this.visit(ctx[zinc_rule_default.function_args]);
    this.visit(ctx[zinc_rule_default.function_returns]);
  }
  [zinc_rule_default.function_declare](ctx) {
    var _a;
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    const b = this?.bridge;
    if (b) {
      b.mark(ctx[zinc_rule_default.constant]?.[0], token_legend_default.jass_constant);
      b.mark(ctx[zinc_rule_default.function]?.[0], token_legend_default.jass_function);
      b.mark(ctx[zinc_rule_default.identifier]?.[0], token_legend_default.jass_function_user);
      b.mark(ctx[zinc_rule_default.takes]?.[0], token_legend_default.jass_takes);
      b.mark(ctx[zinc_rule_default.returns]?.[0], token_legend_default.jass_returns);
      b.mark(ctx[zinc_rule_default.endfunction]?.[0], token_legend_default.jass_endfunction);
    }
    const args = this.visit(ctx[zinc_rule_default.function_args]);
    if (b && args?.list) {
      for (const arg of args.list) {
        const array = arg[zinc_rule_default.array];
        if (array) {
          b.diagnostics.push({
            message: instance.t("arrayInFunctionArgumentError" /* arrayInFunctionArgumentError */),
            range: new import_vscode2.Range(
              b.document.positionAt(array.startOffset),
              b.document.positionAt(array.startOffset + array.image.length)
            ),
            severity: import_vscode2.DiagnosticSeverity.Error
          });
        }
      }
    }
    const locals = ctx?.[zinc_rule_default.function_locals];
    if (locals) {
      const localMap = {};
      for (const local of locals) {
        const typedname = this.visit(local)?.[zinc_rule_default.typedname];
        if (!typedname)
          continue;
        const { type, name } = typedname;
        if (b) {
          b.mark(type, token_legend_default.jass_type_name);
          b.mark(name, token_legend_default.jass_variable);
        }
        if (name) {
          (localMap[_a = name.image] ?? (localMap[_a] = [])).push(name);
          const argList = args.map[name.image];
          if (b && argList) {
            for (const t2 of [name, ...argList]) {
              this.bridge?.diagnostics.push({
                message: instance.t("localRedeclareArgumentError" /* localRedeclareArgumentError */, { name: t2.image }),
                range: new import_vscode2.Range(
                  b.document.positionAt(t2.startOffset),
                  b.document.positionAt(t2.startOffset + t2.image.length)
                ),
                severity: import_vscode2.DiagnosticSeverity.Warning
              });
            }
          }
        }
      }
      if (b)
        for (const v of Object.values(localMap)) {
          if (v.length < 2)
            continue;
          for (const t2 of v) {
            b.diagnostics.push({
              message: instance.t("localRedeclaredError" /* localRedeclaredError */, { name: t2.image }),
              range: new import_vscode2.Range(
                b.document.positionAt(t2.startOffset),
                b.document.positionAt(t2.startOffset + t2.image.length)
              ),
              severity: import_vscode2.DiagnosticSeverity.Warning
            });
          }
        }
    }
    const statements = ctx[zinc_rule_default.statement];
    if (statements) {
      for (const statement of statements) {
        this.visit(statement);
      }
    }
    this.visit(ctx[zinc_rule_default.function_returns]);
    return {};
  }
  [zinc_rule_default.function_locals](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    const variableDeclare = ctx[zinc_rule_default.variable_declare];
    if (!variableDeclare)
      return null;
    const variable = this.visit(variableDeclare);
    const b = this.bridge;
    if (b) {
      const constant2 = variable?.[zinc_rule_default.constant];
      if (constant2) {
        b.diagnostics.push({
          message: instance.t("constantInFunctionError" /* constantInFunctionError */),
          range: new import_vscode2.Range(
            b.document.positionAt(constant2.startOffset),
            b.document.positionAt(constant2.startOffset + constant2.image.length)
          ),
          severity: import_vscode2.DiagnosticSeverity.Error
        });
      }
      const local = variable?.[zinc_rule_default.local];
      if (!local) {
        const { type } = variable?.[zinc_rule_default.typedname];
        if (type) {
          b.diagnostics.push({
            message: instance.t("misssingLocalKeywordError" /* misssingLocalKeywordError */),
            range: new import_vscode2.Range(
              b.document.positionAt(type.startOffset),
              b.document.positionAt(type.startOffset + type.image.length)
            ),
            severity: import_vscode2.DiagnosticSeverity.Error
          });
        }
      }
    }
    return variable;
  }
  [zinc_rule_default.typedname](ctx) {
    const array = ctx[zinc_rule_default.array]?.[0];
    this?.bridge?.mark(array, token_legend_default.jass_array);
    const list = ctx[zinc_rule_default.identifier];
    if (!list)
      return {};
    const [type, name] = list;
    return {
      type: type?.isInsertedInRecovery ?? false ? null : type,
      name: name?.isInsertedInRecovery ?? false ? null : name,
      array
    };
  }
  [zinc_rule_default.function_call](ctx) {
    const b = this.bridge;
    if (b) {
      b.mark(ctx[zinc_rule_default.identifier]?.[0], token_legend_default.jass_function_user);
      b.mark(ctx[zinc_rule_default.lparen]?.[0], token_legend_default.jass_lparen);
      b.mark(ctx[zinc_rule_default.rparen]?.[0], token_legend_default.jass_rparen);
      ctx[zinc_rule_default.comma]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_comma));
    }
    ctx[zinc_rule_default.expression]?.map((item) => this.visit(item));
    return ctx;
  }
  [zinc_rule_default.function_args](ctx) {
    var _a;
    const b = this?.bridge;
    const nothing = ctx?.[zinc_rule_default.nothing]?.[0];
    if (nothing) {
      b?.mark(nothing, token_legend_default.jass_type_name);
      return { map: {}, list: [] };
    }
    const commas = ctx[zinc_rule_default.comma];
    if (b && commas)
      for (const comma of commas) {
        this?.bridge?.mark(comma, token_legend_default.jass_comma);
      }
    const args = ctx?.[zinc_rule_default.typedname]?.map((item) => this.visit(item));
    const argMap = {};
    if (args) {
      for (const arg of args) {
        const { type, name } = arg;
        this?.bridge?.mark(type, token_legend_default.jass_type_name);
        this?.bridge?.mark(name, token_legend_default.jass_argument);
        if (name)
          (argMap[_a = name.image] ?? (argMap[_a] = [])).push(name);
      }
      if (b)
        for (const v of Object.values(argMap)) {
          if (v.length < 2)
            continue;
          for (const t2 of v) {
            b.diagnostics.push({
              message: instance.t("sameNameArgumentError" /* sameNameArgumentError */, { name: t2.image }),
              range: new import_vscode2.Range(
                b.document.positionAt(t2.startOffset),
                b.document.positionAt(t2.startOffset + t2.image.length)
              ),
              severity: import_vscode2.DiagnosticSeverity.Warning
            });
          }
        }
    }
    return {
      map: argMap,
      list: args
    };
  }
  [zinc_rule_default.function_returns](ctx) {
    const b = this?.bridge;
    const nothing = ctx[zinc_rule_default.nothing]?.[0];
    const type = ctx[zinc_rule_default.identifier]?.[0];
    if (b) {
      if (nothing)
        b.mark(nothing, token_legend_default.jass_type_name);
      if (type)
        b.mark(type, token_legend_default.jass_type_name);
    }
    return null;
  }
  [zinc_rule_default.variable_declare](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    const equals = ctx[zinc_rule_default.assign]?.[0];
    const typedname = this.visit(ctx[zinc_rule_default.typedname]);
    const array = typedname[zinc_rule_default.array];
    const b = this.bridge;
    if (b && equals && array) {
      b.diagnostics.push({
        message: instance.t("arrayInitializeError" /* arrayInitializeError */),
        range: new import_vscode2.Range(
          b.document.positionAt(array.startOffset),
          b.document.positionAt(array.startOffset + array.image.length)
        ),
        severity: import_vscode2.DiagnosticSeverity.Error
      });
    }
    const local = ctx[zinc_rule_default.local]?.[0];
    const constant2 = ctx[zinc_rule_default.constant]?.[0];
    if (b) {
      if (local)
        b.mark(local, token_legend_default.jass_local);
      if (constant2)
        b.mark(constant2, token_legend_default.jass_constant);
      b.mark(ctx[zinc_rule_default.assign]?.[0], token_legend_default.jass_equals);
    }
    const exp = ctx[zinc_rule_default.expression];
    if (exp)
      this.visit(exp);
    return {
      [zinc_rule_default.typedname]: typedname,
      [zinc_rule_default.local]: local,
      [zinc_rule_default.constant]: constant2
    };
  }
  [zinc_rule_default.statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    for (const statement of [
      ctx[zinc_rule_default.if_statement],
      ctx[zinc_rule_default.set_statement],
      ctx[zinc_rule_default.call_statement],
      ctx[zinc_rule_default.loop_statement],
      ctx[zinc_rule_default.exitwhen_statement],
      ctx[zinc_rule_default.return_statement]
    ])
      if (statement)
        return this.visit(statement);
    return null;
  }
  [zinc_rule_default.call_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.debug]?.[0], token_legend_default.jass_debug);
    this?.bridge?.mark(ctx[zinc_rule_default.call]?.[0], token_legend_default.jass_call);
    this.visit(ctx[zinc_rule_default.function_call]);
    return null;
  }
  [zinc_rule_default.set_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.set]?.[0], token_legend_default.jass_set);
    this?.bridge?.mark(ctx[zinc_rule_default.identifier]?.[0], token_legend_default.jass_variable);
    this?.bridge?.mark(ctx[zinc_rule_default.assign]?.[0], token_legend_default.jass_assign);
    this.visit(ctx[zinc_rule_default.expression]);
    this.visit(ctx[zinc_rule_default.arrayaccess]);
    return null;
  }
  [zinc_rule_default.loop_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.loop]?.[0], token_legend_default.jass_loop);
    this?.bridge?.mark(ctx[zinc_rule_default.endloop]?.[0], token_legend_default.jass_endloop);
    ctx[zinc_rule_default.statement]?.map((item) => this.visit(item));
    return ctx;
  }
  [zinc_rule_default.exitwhen_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.exitwhen]?.[0], token_legend_default.jass_loop);
    this.visit(ctx[zinc_rule_default.expression]);
    return ctx;
  }
  [zinc_rule_default.return_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.return]?.[0], token_legend_default.jass_return);
    this.visit(ctx[zinc_rule_default.expression]);
    return null;
  }
  [zinc_rule_default.if_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.if]?.[0], token_legend_default.jass_if);
    this?.bridge?.mark(ctx[zinc_rule_default.then]?.[0], token_legend_default.jass_then);
    this?.bridge?.mark(ctx[zinc_rule_default.endif]?.[0], token_legend_default.jass_endif);
    this.visit(ctx[zinc_rule_default.expression]);
    ctx[zinc_rule_default.statement]?.map((item) => this.visit(item));
    ctx[zinc_rule_default.elseif_statement]?.map((item) => this.visit(item));
    this.visit(ctx[zinc_rule_default.else_statement]);
    return null;
  }
  [zinc_rule_default.elseif_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this.visit(ctx[zinc_rule_default.expression]);
    this?.bridge?.mark(ctx[zinc_rule_default.elseif]?.[0], token_legend_default.jass_elseif);
    this?.bridge?.mark(ctx[zinc_rule_default.then]?.[0], token_legend_default.jass_then);
    ctx[zinc_rule_default.statement]?.map((item) => this.visit(item));
    return null;
  }
  [zinc_rule_default.else_statement](ctx) {
    __privateMethod(this, _comment, comment_fn).call(this, ctx);
    this?.bridge?.mark(ctx[zinc_rule_default.else]?.[0], token_legend_default.jass_else);
    ctx[zinc_rule_default.statement]?.map((item) => this.visit(item));
    return null;
  }
  [zinc_rule_default.expression](ctx) {
    ctx[zinc_rule_default.and]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_and));
    ctx[zinc_rule_default.or]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_or));
    ctx[zinc_rule_default.equals]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_equals));
    ctx[zinc_rule_default.notequals]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_notequals));
    ctx[zinc_rule_default.lessorequal]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_lessorequal));
    ctx[zinc_rule_default.great]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_great));
    ctx[zinc_rule_default.greatorequal]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_greatorequal));
    ctx[zinc_rule_default.addition]?.map((item) => this.visit(item));
    return null;
  }
  [zinc_rule_default.primary](ctx) {
    __privateMethod(this, _string, string_fn).call(this, ctx);
    const b = this?.bridge;
    if (b) {
      b.mark(ctx[zinc_rule_default.sub]?.[0], token_legend_default.jass_sub);
      b.mark(ctx[zinc_rule_default.integer]?.[0], token_legend_default.jass_integer);
      b.mark(ctx[zinc_rule_default.real]?.[0], token_legend_default.jass_real);
      b.mark(ctx[zinc_rule_default.idliteral]?.[0], token_legend_default.jass_idliteral);
      b.mark(ctx[zinc_rule_default.function]?.[0], token_legend_default.jass_function);
      b.mark(ctx[zinc_rule_default.not]?.[0], token_legend_default.jass_function);
      const identifier = ctx[zinc_rule_default.identifier]?.[0];
      if (identifier) {
        if (["null", "true", "false"].indexOf(identifier.image) < 0) {
          b.mark(identifier, token_legend_default.jass_variable);
        } else {
          b.mark(identifier, token_legend_default.jass_function);
        }
      }
    }
    this.visit(ctx[zinc_rule_default.arrayaccess]);
    this.visit(ctx[zinc_rule_default.function_call]);
    this.visit(ctx[zinc_rule_default.expression]);
    this.visit(ctx[zinc_rule_default.primary]);
    return null;
  }
  [zinc_rule_default.addition](ctx) {
    ctx[zinc_rule_default.add]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_add));
    ctx[zinc_rule_default.sub]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_sub));
    ctx[zinc_rule_default.multiplication]?.map((item) => this.visit(item));
    return null;
  }
  [zinc_rule_default.multiplication](ctx) {
    const b = this?.bridge;
    if (b) {
      ctx[zinc_rule_default.mult]?.map((item) => b.mark(item, token_legend_default.jass_mult));
      ctx[zinc_rule_default.div]?.map((item) => b.mark(item, token_legend_default.jass_div));
    }
    ctx[zinc_rule_default.primary]?.map((item) => this.visit(item));
    return null;
  }
  [zinc_rule_default.arrayaccess](ctx) {
    this?.bridge?.mark(ctx[zinc_rule_default.lsquareparen]?.[0], token_legend_default.jass_lsquareparen);
    this?.bridge?.mark(ctx[zinc_rule_default.rsquareparen]?.[0], token_legend_default.jass_rsquareparen);
    this.visit(ctx[zinc_rule_default.expression]);
    return null;
  }
};
_comment = new WeakSet();
comment_fn = function(ctx) {
  ctx[zinc_rule_default.end]?.map((item) => this.visit(item));
  ctx[zinc_rule_default.comment]?.map((item) => this?.bridge?.mark(item, token_legend_default.jass_comment));
};
_string = new WeakSet();
string_fn = function(ctx) {
  const strings = ctx[zinc_rule_default.stringliteral];
  if (!strings)
    return;
  const b = this.bridge;
  if (b) {
    for (const string of strings) {
      const start = b.document.positionAt(string.startOffset);
      const end = b.document.positionAt(string.startOffset + string.image.length);
      if (start.line === end.line) {
        b.mark(string, token_legend_default.jass_stringliteral);
        continue;
      }
      if (string) {
        b.diagnostics.push({
          message: instance.t("multilineStringError" /* multilineStringError */),
          range: new import_vscode2.Range(
            b.document.positionAt(string.startOffset),
            b.document.positionAt(string.startOffset + string.image.length)
          ),
          severity: import_vscode2.DiagnosticSeverity.Warning
        });
      }
    }
  }
};

// docs/zinc/main.ts
var parser2 = new ZincParser();
var iframe = document.createElement("iframe");
iframe.src = "data:text/html;charset=utf-8," + encodeURI(createSyntaxDiagramsCode(parser2.getSerializedGastProductions()));
document.body.appendChild(iframe);
(async () => {
  const request = await fetch("test.txt");
  const text = await request.text();
  const lexer = new Lexer(zinc_tokens_list_default, {
    recoveryEnabled: true,
    positionTracking: "onlyOffset",
    deferDefinitionErrorsHandling: true,
    ensureOptimizations: true
  });
  const result = lexer.tokenize(text);
  parser2.input = result.tokens;
  const nodes = parser2[zinc_rule_default.zinc]();
  const visitor = new ZincVisitor();
  visitor.visit(nodes);
})();
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=main.mjs.map
