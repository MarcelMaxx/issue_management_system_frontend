import axios from 'axios';

export const HOST = 'http://localhost:8080';

export const req_get = (method, url) => {
    return axios({
        method: method,
        url: url
    });
};

export const req_post = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        data: data
    });
};

// 获取所有用户
export const list_user = () => {
    const url = `${HOST}/users`;
    return req_get('get', url);
};

// 获取指定ID的用户
export const get_user_by_id = (id) => {
    const url = `${HOST}/users/${id}`;
    return req_get('get', url);
};

// 创建用户
export const create_user = (data) => {
    const url = `${HOST}/users`;
    return req_post('post', url, data);
};

// 更新用户
export const update_user = (id, data) => {
    const url = `${HOST}/users/${id}`;
    return req_post('put', url, data);
};

// delete user
export const delete_user = (id) => {
    const url = `${HOST}/users/${id}`;
    return req_post('delete', url);
};
//
export const get_user_by_role = (role) => {
    const url = `${HOST}/users/role/${role}`;
    return req_get('get', url);
};