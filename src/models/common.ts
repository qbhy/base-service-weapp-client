import Taro from "@tarojs/taro";
import {loginService} from "../services/auth";
import {action} from "../dva";
import {Model} from "./index";

export interface Common {
    access_token: string | null,
    user: { [key: string]: any } | null,
};

export default {
    namespace: 'common',
    state: {
        access_token: Taro.getStorageSync('access_token'),
        user: Taro.getStorageSync('userinfo'),
    } as Common,
    effects: {
        * login({payload}) {
            payload = payload || {};
            let code = payload.code;
            if (!code) {
                code = yield Taro.login().then(res => res.code);
            }
            loginService(code).then(res => {
                Taro.hideLoading();
                if (res) {
                    Taro.setStorageSync('access_token', res.token);
                    Taro.setStorageSync('userinfo', res.user);
                    action('common/save', {access_token: res.token, user: res.user});
                } else {
                    action('common/save', {passLogin: true});
                    // 登录失败了
                }
            }).catch(_ => {
                action('common/save', {passLogin: true});
            })
        },
        * save({payload}) {
            action('common/saveState', payload);
        },
    },
    reducers: {
        saveState(state, {payload}) {
            return {...state, ...payload};
        },
    },
} as Model;
