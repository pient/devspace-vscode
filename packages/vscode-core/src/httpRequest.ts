import axios from "axios";

import { LogDebugFn } from '../types/core'

/**
 * Http请求类
 */
export class HttpRequest {
  private _queue: object = {};
  protected _baseUrl: string | undefined;
  private _logDebug: LogDebugFn = (msg: any) => { console.debug(msg) }

  constructor(baseUrl: string | undefined, config?: {
    logDebug: LogDebugFn
  }) {
    this._baseUrl = baseUrl;
    
    if (config && config.logDebug) {
      this._logDebug = config.logDebug
    }
  }

  // 发起请求
  async fetch(options) {
    const instance = axios.create();
    options = Object.assign(this.getInnerConfig(), options);
    this.interceptors(instance, options.url);

    let res = await instance.request(options);
    return res;
  }

  destroy(url) {
    delete this._queue[url];
  }

  private getInnerConfig() {
    const config = {
      baseURL: this._baseUrl,
      headers: {},
    };

    return config;
  }

  private interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        this._logDebug(config);

        this._queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        let data = res && res.data;
        this._logDebug(`request result: `);
        this._logDebug(data);

        this.destroy(url);
        return data;
      },
      (error) => {
        this._logDebug(`request error: `);
        this._logDebug(error);

        this.destroy(url);

        let errorData = error && error.response;
        return Promise.reject(errorData);
      }
    );
  }
}
