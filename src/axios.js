import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://your-api-base-url', // 替换为实际的API基础URL
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export default instance;
