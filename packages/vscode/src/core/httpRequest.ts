import axios from "axios";
import { logDebug } from "./vscodeUtil";

export default class HttpRequest {
  private _queue: object = {};
  protected _baseUrl: string | undefined;

  constructor(baseUrl: string | undefined) {
    this._baseUrl = baseUrl;
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
        logDebug(config);

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
        logDebug(`request result: `);
        logDebug(data);

        this.destroy(url);
        return data;
      },
      (error) => {
        logDebug(`request error: `);
        logDebug(error);

        this.destroy(url);

        let errorData = error && error.response;
        return Promise.reject(errorData);
      }
    );
  }
}
