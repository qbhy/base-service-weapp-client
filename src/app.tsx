import '@tarojs/async-await';
import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'
import Home from './pages/home/home';
import dva from "./dva";
import models from './models';
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.scss'

const dvaApp = dva.createApp({
    initialState: {},
    models: models,
});
const store = dvaApp.getStore();

class App extends Component {

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: [
            'pages/home/home',
            'pages/home/auth',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black'
        },
    };

    componentWillMount(): void {
        if (!Taro.getStorageSync('userinfo')) {
            dva.action('common/login');
        }
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    componentDidCatchError() {
    }

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Home/>
            </Provider>
        )
    }
}

Taro.render(<App/>, document.getElementById('app'))
