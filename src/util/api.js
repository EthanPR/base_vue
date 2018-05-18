import axios from 'axios'
import {
    Message
} from 'iview'
import Route from '@/router'


const baseUrl = BASE_URL
// http request 拦截器
axios.interceptors.request.use(
    config => {
        //config.headers.common['MUserAgent'] = "userAgent"
        if (localStorage.getItem('token') && localStorage.getItem('token').length > 1) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers['Authorization'] = localStorage.getItem('token')
        }
        //   if(localStorage.getItem('userId') && localStorage.getItem('userId').length > 0){
        //       config.headers['userId'] = localStorage.getItem('userId');
        //   }
        return config
    },
    err => {
        return Promise.reject(err)
    })

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null || o[key] === undefined) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

function apiAxios(method, url, params, success) {
    let config = {}
    if(typeof(url) !== 'object'){
        if (typeof (params) === 'function') {
            success = params
            params = null

        } else if (params) {
            params = filterNull(params)
        }

        config.url = url;
        config.params = params;
        config.success = success;
    }else{
        config = url;
    }
 
    return axios({
        method: method,
        url: config.url,
        baseURL: config.baseUrl ? config.baseUrl : baseUrl,
        data: method === 'POST' || method === 'PUT' ? config.params : null,
        params: method === 'GET' || method === 'DELETE' ? config.params : null,
        withCredentials: true,
        transformRequest: [function (data, headers) {
            if (data == null) {
                return data;
            }
            if (data && config.isJson) {
                headers['Content-Type'] = 'application/json;charset=utf-8';
                return JSON.stringify(data);
            } else {
                headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                let keys2 = Object.keys(data);
                /* 这里就是把json变成url形式，并进行encode */
                let newData = encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'));
                return newData;
            }

        }],
    }).then(res => {
        if (res.data.code) {
            switch (res.data.code) {
                case 200:
                    if (typeof (config.success) === 'function') {
                        config.success(res.data.data, res.data, res)
                    }
                    break;
                case 401:
                    Route.push('/login')
                    break;
                default:
                    if (typeof (config.error) === 'function') {
                        config.error(res.data.data, res.data, res)
                    } else {
                        Message.warning({
                            content: res.data.msg,
                            duration: 2,
                            closable: true
                        });
                    }
                    break;
            }
        } else {
            if (config.baseUrl == baseUrl) {
                Message.error({
                    content: "响应格式有误",
                    duration: 2,
                    closable: true
                });
                console.group("响应格式有误")
                console.log("url:" + url)
                console.log("response:")
                console.log(res.data)
                console.groupEnd()
            } else {
                config.success(res.data, res)
            }

        }

        if (typeof (config.mustCall) === 'function') {
            setTimeout(()=>{
                config.mustCall()
            },260)
        }
    }).catch(err => {
        if (typeof (config.excep) === 'function') {
            config.excep(err)
        } else {
            Message.error({
                content: "请求异常",
                duration: 2,
                closable: true
            });
            console.group("异常:   url:" + url)
            console.info(err)
            console.info("---------------------------------------------")
            console.groupEnd();
        }
        console.log(config)
        if (typeof (config.mustCall) === 'function') {
            setTimeout(()=>{
                config.mustCall()
            },260)
        }
    })

}
export default {
    get: function (url, params, success) {
        return apiAxios("GET", url, params, success)
    },
    post: function (url, params, success) {
        return apiAxios("POST", url, params, success)
    },
    put: function (url, params, success) {
        return apiAxios("PUT", url, params, success)
    },
    delete: function (url, params, success) {
        return apiAxios("DELETE", url, params, success)
    }
}
