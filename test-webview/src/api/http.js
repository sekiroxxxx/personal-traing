//封装的axios 没用上

import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';

let http = axios.create({
    baseUrl: "",
    tiemout: 1000
});

let loadingInstance;

http.interceptors.request.use(
    (config) => {
        loadingInstance = ElLoading.service("加载中");
        return config;
    },
    (err) => {
        loadingInstance?.close();
        ElMessage.error("网络异常");
        return Promise.reject(err);
    }
);

http.interceptors.response.use(
    (res) => {
        loadingInstance?.close();
        return res.data;
    },
    (err) => {
        loadingInstance?.close();
        ElMessage.error("请求失败");
        return Promise.reject(err);
    }
);

export default http;