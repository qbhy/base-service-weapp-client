import Taro from '@tarojs/taro'

export const DEV_SOCKET_SERVER = 'ws://127.0.0.1:8888';
export const DEV_SERVER = 'http://127.0.0.1:8000';

type ExcludeAble = string | null;

export let SERVERS = [
    'https://s.janguly.com',
];

let SERVER_ERRORS = {} as {
    [server: string]: number
};

export let BLACKLIST = [];

export function getServer(exclude: ExcludeAble = null) {
    const servers = exclude ? SERVERS.filter(domain => domain !== exclude) : SERVERS;
    let server = servers[Math.floor((Math.random() * servers.length))];
    return server;
    // return process.env.NODE_ENV === 'production' ? server : DEV_SERVER;
}
export function onError(callback: any = null) {
    return function (res) {

        console.log('onError', res);

        if (res.statusCode) {
            res = res.data;
        }
        Taro.showToast({
            duration: res.duration || 2000,
            title: res.msg || '报错了，请稍后重试！',
            icon: res.icon || 'none'
        })
        callback && callback(res);
    };
}

export function assemblyUrl(url, exclude: ExcludeAble = null) {
    const server = getServer(exclude);
    return url.indexOf('://') !== -1 ? [url, null] : [server + url, server];
}

function assemblyHeaders(headers: { [key: string]: string } = {}) {
    const token = Taro.getStorageSync('access_token');
    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    headers.accept = 'Application/json';
    headers.channel = process.env.TARO_ENV;
    return {...headers};
}

function checkStatus(res) {
    if (res.statusCode > 200) {
        throw res;
    }
    return res.data;
}

export async function get(url, query = {}, headers = {}) {
    return request({
        url: url,
        method: "GET",
        data: query,
        header: assemblyHeaders(headers),
    });
}

export async function post(url, data = {}, headers = {}) {
    return request({
        url: url,
        method: 'POST',
        data: data,
        header: assemblyHeaders(headers),
    });
}

export async function request(options, exclude: ExcludeAble = null, attempts: number = 0) {
    let server: ExcludeAble = null;
    const originUrl = options.url;
    [options.url, server] = assemblyUrl(originUrl, exclude);

    return Taro.request(options).then(checkStatus).catch(async res => {
        if (res.statusCode !== undefined && res.statusCode < 500) {
            throw res;
        }

        if (server) {
            if (SERVER_ERRORS[server] !== undefined) {
                SERVER_ERRORS[server]++;
            } else {
                SERVER_ERRORS[server] = 1;
            }

            if (SERVER_ERRORS[server] > 10) {
                SERVERS = SERVERS.filter(domain => domain !== server)
            }
        }

        options.url = originUrl;

        console.log('报错了', res, SERVERS, SERVER_ERRORS);

        if (attempts > SERVERS.length) {
            throw res;
        }

        return await request(options, server, ++attempts);
    });
}
