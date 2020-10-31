import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {Image, View, Text} from '@tarojs/components'

import {connect} from '@tarojs/redux'
import './home.scss'
import {Common} from "../../models/common";
import config from "../../config";

type PageStateProps = {
    common: Common,
}

type PageOwnProps = {}
type IProps = PageStateProps & PageOwnProps

interface Home {
    props: IProps;
}

@connect(({common}) => ({common}))
class Home extends Component {

    config: Config = {
        navigationBarTitleText: config.title,
        disableSwipeBack: true,
    };

    render() {
        return (
            <View className='container'>
                <View className='header item'>
                    <Image className='header-logo' src={require('../../assets/janguly-logo.jpg')}/>
                    <View className='header-info'>
                        <Text className='header-name'>广州坚谷粒网络科技有限公司</Text>
                        <Text className='header-intro'>成立于 2018-09-28 广州</Text>
                        <View className='header-tags'>
                            <View className='header-tag'>网站开发</View>
                            <View className='header-tag'>小程序开发(多平台)</View>
                            <View className='header-tag'>H5开发</View>
                            <View className='header-tag'>公众号开发</View>
                            <View className='header-tag'>小程序商城开发</View>
                            <View className='header-tag'>UI设计</View>

                        </View>
                    </View>
                </View>

                <View className='intro item'>
                    <View className='item-title'>企业介绍</View>
                    <View className='intro-body'>
                        <View className='intro-item'>
                            <Text className='intro-label'>企业简介</Text>
                            <View className='intro-content'>
                                广州坚谷粒成立于2018年，是一家专注于为微小企业IT技术服务和设计服务的企业。可以为企业提供微服务开发、公众号开发、小程序开发、网站设计和开发、UI设计等服务。
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default Home as ComponentClass<PageOwnProps>
