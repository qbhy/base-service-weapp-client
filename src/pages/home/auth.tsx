import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {Button, Image, Text, View} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import './auth.scss'
import {Common} from "../../models/common";
import {authAction, getAuth} from "../../services/auth";

type PageStateProps = Common;

type PageOwnProps = {}
type AuthState = {
    auth: {
        app: {
            id: number,
            logo: string,
            name: string
        },
        user_action: number,
        type: number,
        id: number,
    } | null,
    error_message: string | null,
}
type IProps = PageStateProps & PageOwnProps

interface Auth {
    props: IProps;
    state: AuthState;
}

const types = {
    1: '头像、昵称等公开信息',
    2: '手机号',
};

const actions = {
    1: '同意',
    2: '拒绝',
};

@connect(({common}) => ({...common}))
class Auth extends Component {

    code = '';

    state: AuthState = {
        auth: null,
        error_message: null,
    };

    config: Config = {
        navigationBarTitleText: '授权',
        disableSwipeBack: true,
    };

    componentWillMount() {
        Taro.login().then(res => this.code = res.code);

        if (this.props.user && this.$router.params.scene) {
            getAuth(this.$router.params.scene)
                .then(auth => this.setState({auth}))
                .catch(() => {
                    this.setState({error_message: '参数错误！'})
                });
        }
    }

    componentWillReceiveProps(nextProps: Readonly<{ access_token }>, _: any) {
        console.log('componentWillReceiveProps', nextProps);
        if (this.state.auth === null && nextProps.access_token) {
            getAuth(this.$router.params.scene)
                .then(auth => this.setState({auth}));
        }
    }

    onAgree = (res) => {
        if (res.detail.encryptedData === undefined) {
            // 取消了
            return;
        }

        const auth = this.state.auth;
        auth && authAction(auth.id, {
            action: 1,
            iv: res.detail.iv,
            encrypted: res.detail.encryptedData,
            code: this.code
        }).then(() => {
            auth.user_action = 1;
            this.setState({auth})
        })
    }

    onRefuse = () => {
        const auth = this.state.auth;
        auth && authAction(auth.id, {action: 2}).then(() => {
            auth.user_action = 2;
            this.setState({auth})
        }).then((res: any) => {
            if (res.msg) {
                Taro.showToast({title: res.msg, icon: 'none'});
            }
        })
    };

    render() {
        const {auth, error_message} = this.state;
        return (
            <View className='auth-container'>
                {error_message || ''}
                {auth ? (
                    <View className='auth-container'>
                        <Image src={auth.app.logo} className='auth-app-logo'/>
                        <Text className='auth-description'>
                            为了更好的给您提供服务，<Text className='app-name'>{auth.app.name}</Text> 申请获得以下权限
                        </Text>

                        <Text className='permission-description'>
                            获得您的{types[auth.type]}
                        </Text>

                        {auth.user_action === 0 && auth.type === 1 ? (
                            <View className='auth-actions'>
                                <Button className='auth-action-btn' openType='getUserInfo'
                                        onGetUserInfo={this.onAgree}>我同意</Button>
                                <Button className='auth-action-btn auth-action-btn-refuse'
                                        onClick={this.onRefuse}>拒绝</Button>
                            </View>
                        ) : null}

                        {auth.user_action === 0 && auth.type === 2 ? (
                            <View className='auth-actions'>
                                <Button className='auth-action-btn' openType='getPhoneNumber'
                                        onGetPhoneNumber={this.onAgree}>我同意</Button>
                                <Button className='auth-action-btn auth-action-btn-refuse'
                                        onClick={this.onRefuse}>拒绝</Button>
                            </View>
                        ) : null}

                        {auth.user_action > 0 ? (
                            <View className='auth-actions'>
                                <Button
                                    className={'auth-action-btn ' + (auth.user_action == 1 ? 'agreed' : 'refused')}>您已{actions[auth.user_action]}</Button>
                            </View>
                        ) : null}
                    </View>
                ) : '加载中'}
            </View>
        )
    }
}

export default Auth as ComponentClass<PageOwnProps, AuthState>
