import axios from 'axios'
import Cookie from 'js-cookie'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName

//设置默认请求头数据格式
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

// 生成随机字符串
function randomString() {
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var randomStr = '';
  for (var i = 0; i < 32; i++) {
    randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomStr;
}
/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, { params, ...config })
    case METHOD.POST:
      return axios.post(url, params, config)
    default:
      return axios.get(url, { params, ...config })
  }
}
//设计为一个方法调用，method默认值为“get“，data为数据，config为上传图片时的加载进度
function request1(url, method = "get", data, config) {
  return axiosRequest(url, method, data, config);
}
//get
const $get = (url, data, config) => axiosRequest(url, "get", data, config);
//post
const $post = (url, data, config) => axiosRequest(url, "post", data, config);
/**
 *
 * @param {String} url 请求地址
 * @param {String} method 请求方式
 * @param {Object} data 请求参数
 * @param {Object} config 上传的文件
 */
function axiosRequest(url, method, data = {}, config = {}) {
  //接收后改为小写
  let methods = method.toLocaleLowerCase();
  let params
  switch (methods) {
    case "post":
      //设一个key-value接收格式，然后遍历出来  用于转换数据form格式
      params = new URLSearchParams();
      params.append('timestamp', Date.parse(new Date()))
      params.append('nonce', randomString())
      if (data instanceof Object) {
        for (let key in data) {
          params.append(key, data[key]);
        }
        data = params;
      }
      break;
    case "file":
      params = new FormData();
      params.append('timestamp', Date.parse(new Date()))
      params.append('nonce', randomString())
      if (data instanceof Object) {
        for (let key in data) {
          params.append(key, data[key]);
        }
        data = params;
      }
      break;
    default:
      data.timestamp = Date.parse(new Date());
      data.nonce = randomString();
      break;
  }

  //将参数都放在axiosConfig变量里面。
  let axiosConfig = {
    method: methods,
    url: url,
  };
  // axiosConfig.headers["token"] = store.state.loginMsg.token;
  methods === 'get' ? axiosConfig.params = data : axiosConfig.data = data;

  //将上传文件的进度加入data数据流
  if (config instanceof Object) {
    for (let key in config) {
      axiosConfig[key] = config[key];
    }
  }
  //直接调用请求然后返回即可
  return axios(axiosConfig).then((res) => res.data);
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  console.log(auth.expireAt)
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.set(xsrfHeaderName, 'Bearer ' + auth.token, { expires: auth.expireAt })
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookie.remove(xsrfHeaderName)
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookie.get(xsrfHeaderName)) {
        return true
      }
      break
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break
  }
  return false
}

/**
 * 加载 axios 拦截器 @/utils/axios-interceptors 拦截器所在地址
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors
  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器  
  response.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  request1,
  $get,
  $post,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
}
