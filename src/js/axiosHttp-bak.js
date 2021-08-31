import axios from 'axios'
// 添加一个新的axios实例
const axiosHttp = axios.create({})
// 添加请求拦截器 (请求发出前处理请求)
axiosHttp.defaults.timeout =  3000;
// 添加请求拦截器
axiosHttp.interceptors.request.use(function (config) {
  if (config.method === 'get') {
    config.data = true
  }

  if (sessionStorage.getItem('token')) {
    config.headers.token = sessionStorage.getItem('token')
  }
  config.headers['Content-Type'] = 'application/json;charset=utf-8'

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})







export default axiosHttp
