import axios from 'axios'

const Http = {}

Http.install = function (Vue, options) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 4. 添加实例方法
  Vue.prototype.$http = axios
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.Authorization = AUTH_TOKEN
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
}
export default Http
