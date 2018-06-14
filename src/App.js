import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MainRoute from './routes'
import { PersistGate } from 'redux-persist/es/integration/react'
import createHistory from 'history/createBrowserHistory'
//TODO：npm install 的时候 react-router-redux要加上 @next 最新版本号
import {ConnectedRouter} from 'react-router-redux'
import { store, persistor } from 'redux/store';
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './App.css';
moment.locale('zh-cn')

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
