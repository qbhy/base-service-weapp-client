import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View} from '@tarojs/components'
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
            <View>
                测试
            </View>
        )
    }
}

export default Home as ComponentClass<PageOwnProps>
