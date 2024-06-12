import {HOST, req_get, req_post} from './axiosFun.js'

// 创建问题
export const create_issue = (data) => {
    const url = `${HOST}/issues/`
    return req_post('post', url, data)
}

// 获取问题列表
export const list_issues = () => {
    const url = `${HOST}/issues/`
    return req_get('get', url)
}

// 获取问题详情
export const get_issue_details = (issueId) => {
    const url = `${HOST}/issues/${issueId}/`
    return req_get('get', url)
}

// 更新问题
export const update_issue = (issueId, data) => {
    const url = `${HOST}/issues/${issueId}/`
    return req_post('put', url, data)
}

// 删除问题
export const delete_issue = (issueId) => {
    const url = `${HOST}/issues/${issueId}/`
    return req_post('delete', url)
}

// 获取甘特图数据
export const get_gantt_chart_data = (issueId) => {
    const url = `${HOST}/issues/${issueId}/gantt/`
    return req_get('get', url)
}

// 通过问题id获取评论
export const get_comments_by_issue_id = (issueId) => {
    const url = `${HOST}/comments/issue/${issueId}`
    return req_get('get', url)
}
// 创建评论
export const create_comment = (issueId, data) => {
    const url = `${HOST}/issues/${issueId}/comments`
    return req_post('post', url, data)
}

// 修改状态
export const update_issue_status = (issueId, status) => {
    const url = `${HOST}/issues/${issueId}/${status}`
    return req_post('put', url)
}