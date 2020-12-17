import { LogDebugFn } from '../types/core';
/**
 * Http请求类
 */
export declare class HttpRequest {
    private _queue;
    protected _baseUrl: string | undefined;
    private _logDebug;
    constructor(baseUrl: string | undefined, config?: {
        logDebug: LogDebugFn;
    });
    fetch(options: any): Promise<import("axios").AxiosResponse<any>>;
    destroy(url: any): void;
    private getInnerConfig;
    private interceptors;
}
