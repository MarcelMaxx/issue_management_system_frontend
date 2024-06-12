import { req_get_auth, req_post_auth, HOST } from './axiosFun.js'

// 获取通知
export const list_notifications = () => {
    const url = `${HOST}/api/notifications`
    return req_get_auth('get', url)
}

// 读取通知
export const read_notification = (notificationId) => {
    const url = `${HOST}/api/notifications/${notificationId}`
    return req_post_auth('post', url)
}

// 删除通知
export const delete_notification = (notificationId) => {
    const url = `${HOST}/api/notifications/${notificationId}`
    return req_post_auth('delete', url)
}
