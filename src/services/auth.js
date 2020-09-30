import {post, get} from "../utils/request";
import {getAppId} from "../utils/app";

export async function loginService(code) {
    const data = {
        code,
        app_id: getAppId(),
        channel: process.env.TARO_ENV,
    };
    return post('/api/wechat/login', data);
}

export async function getAuth(id) {
    return get('/api/wechat/auth/' + id);
}

export async function authAction(id, action) {
    return post('/api/wechat/auth/' + id, action);
}


