import axios from 'axios'
import { Message } from 'element-ui';


const service = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 3000,
})

// 请求拦截器
service.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
    // Do something before response is sent
    if (response.data.meta.status !== 200) {
        Message.error(response.data.meta.msg || 'error')
    }
    return response;
}, error => {
    // Do something with response error
    Message.error(error+'')
    return Promise.reject(error);
});
export default service