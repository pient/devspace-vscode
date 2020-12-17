/**
 * 帮助方法
 */
export declare function isEmpty(str: any): boolean;
export declare function isNotEmpty(str: any): boolean;
export declare function isBoolean(val: any): boolean;
export declare function isUndefined(val: any): boolean;
export declare function isObject(val: any): boolean;
export declare function isArray(val: any): boolean;
/** 根据key或查询方法替换或则新增项 */
export declare function setObjectsByKey(writeObjs: any[], readObjs: any[], searchFn: string | string[] | Function): any[];
/** 深度克隆 */
export declare function deepCopy(obj: any, cache?: any[]): any;
/**
 * 将第二个的对象的值给第一个对象,
 * isFull: 是否完整复制
 * emptySource: 是否清空原对象
 */
export declare function writeObject(writeObj: any, readObj: any, options?: {
    isFull?: boolean;
    emptySource?: boolean;
}): any;
export declare function generateGuid(): string;
export declare function getNonce(): string;
