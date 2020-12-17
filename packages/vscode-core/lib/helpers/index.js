"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = exports.generateGuid = exports.writeObject = exports.deepCopy = exports.setObjectsByKey = exports.isArray = exports.isObject = exports.isUndefined = exports.isBoolean = exports.isNotEmpty = exports.isEmpty = void 0;
/**
 * 帮助方法
 */
// 之付出是否为空
function isEmpty(str) {
    return !str || "" === str;
}
exports.isEmpty = isEmpty;
// 字符串是否为非空
function isNotEmpty(str) {
    return (str && "" !== str);
}
exports.isNotEmpty = isNotEmpty;
// 是否为空
function isBoolean(val) {
    return typeof (val) === 'boolean';
}
exports.isBoolean = isBoolean;
// 是否undefined
function isUndefined(val) {
    return typeof (val) === 'undefined';
}
exports.isUndefined = isUndefined;
// 对象是否为object
function isObject(val) {
    return typeof val === 'object';
}
exports.isObject = isObject;
// 判断对象是否为数组
function isArray(val) {
    return Array.isArray(val);
}
exports.isArray = isArray;
/** 根据key或查询方法替换或则新增项 */
function setObjectsByKey(writeObjs, readObjs, searchFn) {
    let _schFn = () => { };
    if (searchFn instanceof Function) {
        _schFn = searchFn;
    }
    else {
        let _schKeys = searchFn;
        if (typeof searchFn === "string") {
            _schKeys = [searchFn];
        }
        _schFn = function (obj) {
            return obj && _schKeys.every((key) => obj[key] === this[key]);
        };
    }
    readObjs.forEach((readObj) => {
        if (!readObj) {
            return;
        }
        let index = writeObjs.findIndex(_schFn, readObj);
        if (index < 0) {
            writeObjs.push(readObj);
        }
        else {
            writeObjs[index] = readObj;
        }
    });
    return writeObjs;
}
exports.setObjectsByKey = setObjectsByKey;
/** 深度克隆 */
function deepCopy(obj, cache = []) {
    function find(list, f) {
        return list.filter(f)[0];
    }
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj);
    if (hit) {
        return hit.copy;
    }
    const copy = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    });
    Object.keys(obj).forEach(key => {
        copy[key] = this.deepCopy(obj[key], cache);
    });
    return copy;
}
exports.deepCopy = deepCopy;
/**
 * 将第二个的对象的值给第一个对象,
 * isFull: 是否完整复制
 * emptySource: 是否清空原对象
 */
function writeObject(writeObj, readObj, options) {
    options = Object.assign({}, options);
    if (options.emptySource) {
        Object.keys(readObj).forEach((key) => {
            delete readObj[key];
        });
    }
    Object.keys(writeObj).forEach((key) => {
        if (readObj.hasOwnProperty(key)) {
            writeObj[key] = readObj[key];
        }
    });
    // 完整复制
    if (options.isFull === true) {
        Object.keys(readObj).forEach((key) => {
            if (readObj.hasOwnProperty(key)) {
                writeObj[key] = readObj[key];
            }
        });
    }
    return writeObj;
}
exports.writeObject = writeObject;
// 生成 GUID
function generateGuid() {
    let hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    let oct = "";
    let tmp;
    /* tslint:disable:no-bitwise */
    for (let a = 0; a < 4; a++) {
        tmp = (4294967296 * Math.random()) | 0;
        oct +=
            hexValues[tmp & 0xf] +
                hexValues[(tmp >> 4) & 0xf] +
                hexValues[(tmp >> 8) & 0xf] +
                hexValues[(tmp >> 12) & 0xf] +
                hexValues[(tmp >> 16) & 0xf] +
                hexValues[(tmp >> 20) & 0xf] +
                hexValues[(tmp >> 24) & 0xf] +
                hexValues[(tmp >> 28) & 0xf];
    }
    // 'Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively'
    let clockSequenceHi = hexValues[(8 + Math.random() * 4) | 0];
    return (oct.substr(0, 8) +
        "-" +
        oct.substr(9, 4) +
        "-4" +
        oct.substr(13, 3) +
        "-" +
        clockSequenceHi +
        oct.substr(16, 3) +
        "-" +
        oct.substr(19, 12));
    /* tslint:enable:no-bitwise */
}
exports.generateGuid = generateGuid;
// 获取网页中nonce码
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;
//# sourceMappingURL=index.js.map