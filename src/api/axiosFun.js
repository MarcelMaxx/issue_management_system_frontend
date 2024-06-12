import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { HOST } from './hosts.js'
import { ref } from 'vue'

const req_get = async (method, url, params = {}) => {
  try {
    const response = await axios({
      method, url, params,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}

const req_get_auth = async (method, url, params = {}) => {
  try {
    const response = await axios({
      method, url, params,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      },
      traditional: true,
      withCredentials: true
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}


const req_post = async (method, url, data = {}) => {
  try {
    const response = await axios({
      method, url, data,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      traditional: true,
      withCredentials: true
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}


const req_post_auth = async (method, url, data = {}) => {
  try {
    const response = await axios({
      method, url, data,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'JWT ' + localStorage.getItem('token')
      },
      traditional: true,
      withCredentials: true
    })
    return response.data
  } catch (error) {
    handleError(error)
    throw error
  }
}

const flag_logout = ref(0)
const isModalShown = ref(false)
const handleError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        flag_logout.value += 1
        // 登陆状态已过期或失效，请重新登陆！
        if (!isModalShown.value) {
          isModalShown.value = true
          localStorage.clear()
          // Message.warning({
          //     content: "登陆状态已过期或失效，请重新登陆！",
          //     duration: 3000
          // })
          // Modal.warning({
          //     title: '警告',
          //     content: '登陆状态已过期或失效，请重新登陆！',
          //     okText: "重新登录",
          //     maskClosable: false,
          //     onOk: () => {
          //         console.log('OK');
          //         router.push({path: '/login'});
          //     },
          //     onClose: () => {
          //         isModalShown.value = false
          //     }
          // });
        }
        break
      case 403:
        // 无权限
        Message.warning({
          content: '无权限！请联系管理员',
          duration: 3000
        })
        break
      // 可以处理更多的HTTP状态码
      default:
        // 默认错误处理
        break
    }
  } else {
    // 网络或其他错误
  }
}

export {
  HOST,
  req_get,
  req_get_auth,
  req_post,
  req_post_auth
}
