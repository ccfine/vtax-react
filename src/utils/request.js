/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 18:10
 * description  :
 */
import Axios from 'axios';
import {message} from 'antd'
import {logout} from '../redux/ducks/user'

const request = Axios.create({
    baseURL:window.baseURL,
    timeout:20000
});
request.getToken = ()=>{
    return request.getState().user.get('token') || false
}
request.testSuccess = (data,success,fail) => {
    if(data.code===200){
        success && success(data.data)
    }else{
        fail && fail(data.msg)
    }
};
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(request.getToken()){
        config.headers={
            Authorization:request.getToken(),
            'X-Requested-With': 'XMLHttpRequest'
        }
        if(config.method==='get'){
            let obj = config.params;
            let temp = {};
            if(config.params){
                for(let i in obj) {
                    if((obj[i] + "").replace(/\s+/g,"") !== "" || obj[i] === null){
                        temp[i] = obj[i];
                    }
                }
                config.params = {
                    _t: Date.parse(new Date())/1000,
                    ...temp
                }
            }

            config.params = {
                ...config.params,
                _t: Date.parse(new Date())/1000,
            }

        }else if(config.method==='delete'){
            config.params = {
                _t: Date.parse(new Date())/1000,
                ...config.params
            }
        }
    }

    /*config.params = {
        ...config.params,
        _t: Date.parse(new Date())/1000,
    }*/

    return config;
}, function (error) {
    // 对请求错误做些什么
    message.error('网络请求超时',4)
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    if (error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '请求错误'
                break
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                request.dispatch && logout(request.dispatch)()
                error.message = '登录超时,请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break

            case 404:
                error.message = `请求地址出错: ${error.response.config.url}`
                break

            case 408:
                error.message = '请求超时'
                break

            case 500:
                error.message = '服务器内部错误'
                break

            case 501:
                error.message = '服务未实现'
                break

            case 502:
                error.message = '网关错误'
                break

            case 503:
                error.message = '服务不可用'
                break

            case 504:
                error.message = '网关超时'
                break

            case 505:
                error.message = 'HTTP版本不受支持'
                break
            default:
                message.error(error.response.statusText,4)
            //no default statusText
        }
        message.error(error.message)
    }else{
        message.error('网络错误')
    }
    return Promise.reject(error);
});


export default request;