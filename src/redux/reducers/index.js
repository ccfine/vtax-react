/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 16:26
 * description  : 需要在redux中管理的数据必须要在这里注册reducer
 */

import { combineReducers } from 'redux'
import user from '../ducks/user'
import router from './rootReducer'

const rootReducer = combineReducers({
    //every modules reducer should be define here
    //[home.NAME]:home.reducer,
    user,
    router
});

export default rootReducer