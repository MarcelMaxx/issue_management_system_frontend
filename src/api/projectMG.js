import {HOST, req_get, req_post} from './axiosFun.js'

// 创建项目
export const create_project = (data) => {
    const url = `${HOST}/projects`
    return req_post('post', url, data)
}

// 获取项目列表
export const list_projects = () => {
    const url = `${HOST}/projects`
    return req_get('get', url)
}

// 获取项目详情
export const get_project_details = (projectId) => {
    const url = `${HOST}/projects/${projectId}`
    return req_get('get', url)
}

// 更新项目
export const update_project = (projectId, data) => {
    const url = `${HOST}/projects/${projectId}`
    return req_post('put', url, data)
}

// 删除项目
export const delete_project = (projectId) => {
    const url = `${HOST}/projects/${projectId}`
    return req_post('delete', url)
}

// 获取用户项目历史
export const get_user_project_history = (userId) => {
    const url = `${HOST}/user/${userId}/projects/history`
    return req_get('get', url)
}
