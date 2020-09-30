import Taro from "@tarojs/taro";

export function getAppId() {
    switch (process.env.TARO_ENV) {
        case "weapp":
        case "qq":
            return Taro.getAccountInfoSync()['miniProgram']['appId'];
        case 'tt':
            return 'ttaebcd801318685f0';
        default:
            return 'none';
    }
}

export function inArray(value, array) {
    if (!Array.isArray(array)) {
        return false;
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
}


export function backPage(delta = 1) {
    if (Taro.getCurrentPages().length === 1) {
        return Taro.redirectTo({url: '/pages/home/home'});
    }

    Taro.navigateBack({delta}).catch(() => Taro.redirectTo({url: '/pages/home/home'}));
}
