import Vue from 'vue';
import axios from 'axios'
import { Message, Loading } from 'element-ui';

// 添加一个新的axios实例
const axiosHttp = axios.create({})
// 添加请求拦截器 (请求发出前处理请求)

axiosHttp.defaults.timeout =  120000;
// 添加请求拦截器

Vue.axiosPromiseArr = [] //储存cancel token
axiosHttp.interceptors.request.use(function (config) {
	if (config.method === 'get') {
		config.data = true
	}
	// 在发送请求设置cancel token
    config.cancelToken = new axios.CancelToken(cancel => {
        Vue.axiosPromiseArr.push({cancel})
	})
	if (sessionStorage.getItem('token')) {
		config.headers.token = sessionStorage.getItem('token')
	}
	config.headers['Content-Type'] = 'application/json;charset=utf-8'

	return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */
axiosHttp.interceptors.response.use(
  // 请求成功
  res => {
	if(res.data.status === -1){
		if(document.getElementsByClassName('el-message').length == 0){
			 Message.error('登陆失效,三秒后跳转登陆页') 
		}
		setTimeout(function(){
			window.location.href = '/login'
		}, 3000);
	}
    return Promise.resolve(res)
  },
  // 请求失败
  err => {
	  if(document.getElementsByClassName('el-message').length == 0 && err.message){
	  	 Message.error(err.message)
	  }
	//  throw new Error('出错了tree:::')
	return Promise.reject(err)
  }
);
export default axiosHttp
