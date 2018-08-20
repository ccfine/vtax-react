import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MainRoute from './routes'
import { PersistGate } from 'redux-persist/es/integration/react'
import createHistory from 'history/createBrowserHistory'
//TODO：npm install 的时候 react-router-redux要加上 @next 最新版本号
import {ConnectedRouter} from 'react-router-redux'
import { store, persistor } from 'redux/store';
import { LocaleProvider,message } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './App.css';
moment.locale('zh-cn')

message.config({
    top: 50, //window.screen.availHeight/2-140,  //消息距离顶部的位置
    duration: 3,  //默认自动关闭延时，单位秒
    maxCount: 1,  //最大显示数, 超过限制时，最早的消息会被自动关闭
});

const history = createHistory();
const onBeforeLift = () => {
    // take some action before the gate lifts
    const rootLoading =window.document.getElementById('root-loading');
    if(rootLoading){
        rootLoading.style.opacity=0;
        setTimeout(()=>{
            rootLoading.style.display='none';
        },500)
    }
}
const Loading = props => <div>loading</div>

class App extends Component {

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Provider store={store}>
                    <PersistGate
                        loading={<Loading />}
                        onBeforeLift={onBeforeLift}
                        persistor={persistor}>
                        <ConnectedRouter history={history}>
                            {
                                MainRoute
                            }
                        </ConnectedRouter>
                    </PersistGate>
                </Provider>
            </LocaleProvider>
        );
    }
}

export default App;
