/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 16:26
 * description  : 使用了redux-persist做持久化存储
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import rootReducer from '../reducers'
import immutableTransform from 'redux-persist-transform-immutable'

const config = {
    transforms: [immutableTransform()],
    key: 'root', // key is required
    storage, // storage is now required
}

const persistedReducer = persistReducer(config, rootReducer);
const middleware = applyMiddleware(thunk,promiseMiddleware);

const configureStore = preloadedState => {

    const store = createStore(persistedReducer, preloadedState, compose(
        middleware,
        global.devToolsExtension ? global.devToolsExtension() : f => f
    ));

    let persistor = persistStore(store)

    return {
        persistor, store
    }
}



export default configureStore