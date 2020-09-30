import Taro, {PureComponent} from '@tarojs/taro';
import {View} from '@tarojs/components';
import {action} from "../../dva";
import './authorization.scss';
import {ComponentClass} from "react";
import {connect} from "@tarojs/redux";
import {Common} from "../../models/common";

type PageStateProps = {
    scene?: any,
    children: any,
}

type IProps = Common & PageStateProps;

interface Authorization {
    props: IProps;
}

@connect(({common}) => ({...common}))
class Authorization extends PureComponent<IProps> {

    state = {
        refuse: false,
    };

    code = '';

    componentDidMount(): void {
        Taro.login().then(res => this.code = res.code).catch(res => {
            console.debug('登录失败', res);
        });
    }

    updateUserinfo = async (res) => {
        // 授权成功
        if (res.detail.errMsg === "getUserInfo:ok") {
            await Taro.showLoading({title: '登录中...'});
            action('common/login', {
                code: this.code,
                iv: res.detail.iv,
                encrypted: res.detail.encryptedData,
                key: this.props.scene,
            });
        }
    };

    render() {
        const {user} = this.props;
        return (
            <View>
                {user ? (
                    <View>
                        加载成功
                    </View>
                ) : '加载中'}
            </View>
        );
    }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion
export default Authorization as ComponentClass<PageStateProps>
