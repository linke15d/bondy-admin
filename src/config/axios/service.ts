import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosError} from 'axios';

import qs from 'qs';

import {config} from './config';
import {cleanEmptyParams} from '@/utils/format';
import {ElMessage, ElLoading} from 'element-plus';
import {loginOutApi} from '@/utils/publicRequest';
import {resetRouter} from '@/router';
import {useCache} from '@/hooks/web/useCache';
import {clearStorage, getToken, removeSession} from '@/utils/auth.util';
import {useTagsViewStore} from '@/store/modules/tagsView';

const {wsCache} = useCache();
const tagsViewStore = useTagsViewStore();

const {base_url} = config;

const {VITE_NODE_ENV, VITE_API_BASEURL} = import.meta.env;
export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH];

let loading: any;

function startLoading() {
    loading = ElLoading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
    });
}
function endLoading() {
    loading.close();
}

let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}

let APIURL;
if (VITE_NODE_ENV === 'development') {
    APIURL = PATH_URL;
} else {
    APIURL = PATH_URL + VITE_API_BASEURL;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: APIURL, // api 的 base_url
    timeout: config.request_timeout, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (
            config.method === 'post' &&
            (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
        ) {
            config.data = cleanEmptyParams(config.data || {});
            config.data = qs.stringify(config.data);
        }
        // 上传图片
        if (config.url === '/api/image/upload') {
            config.headers['Content-Type'] = 'multipart/form-data';
            const formdata = new FormData();
            formdata.append('file', config.data);
            config.data = formdata;
        }

        if (getToken()) {
            (config.headers as AxiosRequestHeaders)['Authorization'] = 'Bearer ' + getToken();
        }
        //清理 GET 参数
        if (config.method === 'get' && config.params) {
            config.params = cleanEmptyParams(config.params);
        }
        // get参数编码
        if (config.method === 'get' && config.params) {
            let url = config.url as string;
            url += '?';
            const keys = Object.keys(config.params);
            for (const key of keys) {
                if (config.params[key] !== void 0 && config.params[key] !== null) {
                    url += `${key}=${encodeURIComponent(config.params[key])}&`;
                }
            }
            url = url.substring(0, url.length - 1);
            config.params = {};
            config.url = url;
        }
        // 普通 json post过滤
        if (
            config.method === 'post' &&
            config.data &&
            !(config.data instanceof FormData) &&
            (config.headers as AxiosRequestHeaders)['Content-Type'] !== 'application/x-www-form-urlencoded'
        ) {
            config.data = cleanEmptyParams(config.data);
        }

        //过滤加载动画
        if (
            config.url === '/api/merchant/finance/daily' ||
            config.url === '/api/user/merchantUserCount' ||
            config.url === '/api/merchant/finance/rank' ||
            config.url === '/api/enum/query' ||
            config.url === '/api/trading/pair/contract/queryAllPairs'||
            config.url === '/api/currency/queryAll'||
            config.url === '/api/risk/contract-warning-rule/warning/unhandled'||
            config.url === '/api/risk/common/warning/today'||
            config.url === '/api/contract/trade/overview'||
            config.url === '/api/spot/order/trade/overview'||
            config.url === '/api/account/accountCount'||
            config.url === '/api/user/userCount'||
            config.url === '/api/user/finance/rank'||
            config.url === '/api/merchant/info/query/all'
        ) {
            return config;
        }

        showFullScreenLoading();
        return config;
    },
    (error: AxiosError) => {
        // Do something with request error
        console.log('err', error); // for debug
        Promise.reject(error);
    },
);

// response 拦截器
service.interceptors.response.use(
    async (response: AxiosResponse<any>) => {
        tryHideFullScreenLoading();
        if (response.config.responseType === 'blob') {
            // 如果是文件流，直接过
            return response;
        } else if (response.data.success) {
            return response.data;
        } else if (!response.data.success && response.data.code == 211) {
            return response.data;
        } else if (response.data.code === '401') {
            const res: any = await loginOutApi().catch(() => {
                clearStorage();
                tagsViewStore.delAllViews();
                resetRouter(); // 重置静态路由表
                removeSession('routeList');
                window.location.replace('#/login');
            });
            if (res.success) {
                ElMessage.error(response.data.msg);
                clearStorage();
                tagsViewStore.delAllViews();
                resetRouter(); // 重置静态路由表
                removeSession('routeList');
                window.location.replace('#/login');
            }
        } else {
            // 没有code的是默认模版配置的api
            if (response.data.code) {
                ElMessage.error(response.data.msg);
            }
            return response.data;
        }
    },
    (error: AxiosError | any) => {
        tryHideFullScreenLoading();
        console.log(error); // for debug
        let {message, response} = error;
        if (message == 'Network Error') {
            message = '后端接口连接异常';
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时';
        } else if (response?.status == 401) {
            clearStorage();
            removeSession('routeList');
            wsCache.clear();
            tagsViewStore.delAllViews();
            resetRouter();
            window.location.replace('#/login');
            message = '登录过期，请重新登录';
        } else {
            message = response?.data.msg || '系统接口' + message.substr(message.length - 3) + '异常';
        }
        ElMessage.error(message);
        return Promise.reject(error);
    },
);

export {service};
