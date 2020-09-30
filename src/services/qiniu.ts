import Taro from '@tarojs/taro'
import {post} from "../utils/request";

export async function getQiniuToken() {
    return (await post('/api/qiniu-token')).token;
}

export async function uploadImage(filePath: string, filename: string = '') {
    let data = {token: await getQiniuToken()};
    if (filename) {
        data['key'] = filename;
    }
    return Taro.uploadFile({
        url: 'https://upload-z2.qiniup.com',
        name: 'file',
        filePath: filePath,
        header: {
            "Content-Type": "multipart/form-data"
        },
        formData: data,
    }).then(res => {
        return JSON.parse(res.data);
    });
}

export function fileUrl(key: string) {
    return key.indexOf('://') !== -1 ? key : 'http://static.janguly.com/' + key;
}
