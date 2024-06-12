import { req_get_auth, req_post_auth, req_post, HOST } from './axiosFun.js'

// 创建Wiki文档
export const create_wiki_document = (data) => {
    const url = `${HOST}/api/wiki`
    return req_post_auth('post', url, data)
}

// 获取Wiki文档列表
export const list_wiki_documents = () => {
    const url = `${HOST}/api/wiki`
    return req_get_auth('get', url)
}

// 获取Wiki文档详情
export const get_wiki_document_details = (wikiId) => {
    const url = `${HOST}/api/wiki/${wikiId}`
    return req_get_auth('get', url)
}

// 更新Wiki文档
export const update_wiki_document = (wikiId, data) => {
    const url = `${HOST}/api/wiki/${wikiId}`
    return req_post_auth('put', url, data)
}

// 删除Wiki文档
export const delete_wiki_document = (wikiId) => {
    const url = `${HOST}/api/wiki/${wikiId}`
    return req_post_auth('delete', url)
}
