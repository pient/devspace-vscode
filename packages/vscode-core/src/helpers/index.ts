/**
 * 帮助方法
 */
// 之付出是否为空
export function isEmpty(str: any): boolean {
  return !str || "" === str;
}

// 字符串是否为非空
export function isNotEmpty(str: any): boolean {
  return <boolean>(str && "" !== str);
}

// 是否为空
export function isBoolean(val: any) {
  return typeof(val) === 'boolean'
}

// 是否undefined
export function isUndefined(val: any) {
  return typeof(val) === 'undefined'
}

// 对象是否为object
export function isObject(val: any) {
  return typeof val === 'object'
}

// 判断对象是否为数组
export function isArray(val: any) {
  return Array.isArray(val)
}

/** 根据key或查询方法替换或则新增项 */
export function setObjectsByKey(writeObjs: any[], readObjs: any[], searchFn: string | string[] | Function) {
  let _schFn: any = () => {};

  if (searchFn instanceof Function) {
    _schFn = searchFn;
  } else {
    let _schKeys: any = searchFn;
    if (typeof searchFn === "string") {
      _schKeys = [searchFn];
    }

    _schFn = function (obj) {
      return obj && _schKeys.every((key: string) => obj[key] === this[key]);
    };
  }

  readObjs.forEach((readObj: any) => {
    if (!readObj) {
      return;
    }

    let index = writeObjs.findIndex(_schFn, readObj);

    if (index < 0) {
      writeObjs.push(readObj);
    } else {
      writeObjs[index] = readObj;
    }
  });

  return writeObjs;
}

/** 深度克隆 */
export function deepCopy(obj, cache = []) {
  function find(list: any[], f: (param: any) => boolean) {
    return list.filter(f)[0]
  }
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy: any = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = this.deepCopy((<any>obj)[key], cache)
  })

  return copy
}

/**
 * 将第二个的对象的值给第一个对象,
 * isFull: 是否完整复制
 * emptySource: 是否清空原对象
 */
export function writeObject(writeObj, readObj, options?: { isFull?: boolean; emptySource?: boolean }) {
  options = Object.assign({}, options);

  if (options.emptySource) {
    Object.keys(readObj).forEach((key: any) => {
      delete readObj[key];
    });
  }

  Object.keys(writeObj).forEach((key: any) => {
    if (readObj.hasOwnProperty(key)) {
      writeObj[key] = readObj[key];
    }
  });

  // 完整复制
  if (options.isFull === true) {
    Object.keys(readObj).forEach((key: any) => {
      if (readObj.hasOwnProperty(key)) {
        writeObj[key] = readObj[key];
      }
    });
  }

  return writeObj;
}

// 生成 GUID
export function generateGuid(): string {
  let hexValues: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
  let oct: string = "";
  let tmp: number;
  /* tslint:disable:no-bitwise */
  for (let a: number = 0; a < 4; a++) {
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
  let clockSequenceHi: string = hexValues[(8 + Math.random() * 4) | 0];
  return (
    oct.substr(0, 8) +
    "-" +
    oct.substr(9, 4) +
    "-4" +
    oct.substr(13, 3) +
    "-" +
    clockSequenceHi +
    oct.substr(16, 3) +
    "-" +
    oct.substr(19, 12)
  );
  /* tslint:enable:no-bitwise */
}

// 获取网页中nonce码
export function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
