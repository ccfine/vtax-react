import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MainRoute from './routes'
import { PersistGate } from 'redux-persist/es/integration/react'
import createHistory from 'history/createBrowserHistory'
import configureStore from './redux/store/configureStore'
//TODO：npm install 的时候 react-router-redux要加上 @next 最新版本号
import {ConnectedRouter} from 'react-router-redux'
import {request} from 'utils'
import './App.css';

const {store,persistor} = configureStore();
const history = createHistory();
const onBeforeLift = () => {
    // take some action before the gate lifts
    request.dispatch = store.dispatch;
    request.getState = store.getState;
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
        );
    }
}

export default App;
