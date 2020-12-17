"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Http请求类
 */
class HttpRequest {
    constructor(baseUrl, config) {
        this._queue = {};
        this._logDebug = (msg) => { console.debug(msg); };
        this._baseUrl = baseUrl;
        if (config && config.logDebug) {
            this._logDebug = config.logDebug;
        }
    }
    // 发起请求
    fetch(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = axios_1.default.create();
            options = Object.assign(this.getInnerConfig(), options);
            this.interceptors(instance, options.url);
            let res = yield instance.request(options);
            return res;
        });
    }
    destroy(url) {
        delete this._queue[url];
    }
    getInnerConfig() {
        const config = {
            baseURL: this._baseUrl,
            headers: {},
        };
        return config;
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use((config) => {
            this._logDebug(config);
            this._queue[url] = true;
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // 响应拦截
        instance.interceptors.response.use((res) => {
            let data = res && res.data;
            this._logDebug(`request result: `);
            this._logDebug(data);
            this.destroy(url);
            return data;
        }, (error) => {
            this._logDebug(`request error: `);
            this._logDebug(error);
            this.destroy(url);
            let errorData = error && error.response;
            return Promise.reject(errorData);
        });
    }
}
exports.HttpRequest = HttpRequest;
//# sourceMappingURL=httpRequest.js.map