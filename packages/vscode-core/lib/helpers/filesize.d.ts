export interface FilesizeDescriptor {
    base?: number;
    bits?: boolean;
    exponent?: number;
    fullform?: boolean;
    fullforms?: [];
    locale?: string | boolean;
    localeOptions?: object;
    output?: string;
    round?: number;
    separator?: string;
    spacer?: string;
    standard?: string;
    symbols?: object;
    unix?: boolean;
}
export declare type FilesizeResult = string | number | any[] | {
    value: any;
    symbol: any;
    exponent: number;
};
/**
 * filesize https://github.com/avoidwork/filesize.js
 *
 * @method filesize
 * @param  {Mixed}   arg        String, Int or Float to transform
 * @param  {Object}  descriptor [Optional] Flags
 * @return {String}             Readable file size String
 */
export declare function filesize(arg: number, descriptor?: FilesizeDescriptor): FilesizeResult;
export declare namespace filesize {
    var partial: (opt: any) => (arg: any) => FilesizeResult;
}
export default filesize;
