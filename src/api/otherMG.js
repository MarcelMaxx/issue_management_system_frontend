import { req_get_auth, req_post_auth, req_post, HOST } from './axiosFun.js'

// 示例：获取其他信息
export const get_other_info = (params) => {
    const url = `${HOST}/api/other/info`
    return req_get_auth('get', url, params)
}

// 示例：更新其他信息
export const update_other_info = (data) => {
    const url = `${HOST}/api/other/update`
    return req_post_auth('post', url, data)
}
