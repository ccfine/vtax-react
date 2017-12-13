/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 15:53
 * description  :
 */

import { createActions, handleActions } from 'redux-actions'
//TODO:  npm 的时候必须加上版本号 4.0.0-rc.9  要不然 getIn() 用不了
import {fromJS} from 'immutable';

const data = {
    password: "123",
    phoneNumber: "18675567665",
    provinceCode: "string",
    realname: "刘心",
    remark: "string",
    sex: "string",
    userId: 0,
    username: "admin",
    token: "string",
    email: "2541337855@qq.com",
    address: "string",
    administrator: 0,
    avatar: "string",
}

const initialState = fromJS({
    /**用户个人信息*/
    personal:{
        realname:null,
        username:null,
        userId:null,
        codeList:{
            list:null,
        },
    },
    /**登录凭证*/
    token:null,

    /**是否登录成功*/
    isAuthed:false,
});

export const {personal, token, isAuthed,codeList} = createActions({
    PERSONAL: {
        /**增加*/
        INCREMENT: info => info
    },
    TOKEN:{
        /**增加*/
        INCREMENT:token => token,
    },
    IS_AUTHED:{
        /**登录*/
        LOGIN:() => true,
        /**退出*/
        LOGOUT:() => false
    },
    CODE_LIST:{
        INCREMENT: info => info
    }
})

export default handleActions({
    [personal.increment] : (state, {payload})=>{
        return state.set('personal', payload)
    },
    [token.increment] : (state, {payload})=>{
        return state.set('token', payload)
    },
    [isAuthed.login] : (state, {payload})=>{
        return state.set('isAuthed', payload)
    },
    [isAuthed.logout] : state=>{
        return initialState
    },
    [codeList.increment] : (state, {payload})=>{
        return state.setIn(['personal','codeList'], payload)
    }
}, initialState)

export const login = dispatch => async ({userName,password,success,fail})=>{
    try {
        let getTokenSuccess = false;
        if(userName==='admin' && password==='123'){
            getTokenSuccess = true;
            dispatch(token.increment('登录成功！'))
        }else{
            fail && fail('登录失败！')
        }

        if(getTokenSuccess){
            //获取用户信息
            dispatch(personal.increment(data))
            //用户信息获取成功的话
            //所需信息全部加载完毕，完成登录
            dispatch(isAuthed.login())
            //执行登录成功回调
            success && success()
        }
    }catch(err) {
        console.log(err)
    }
}

export const logout = dispatch => async () =>{
    //登出
    dispatch(isAuthed.logout())
}

export const saveCodeList = dispatch => async (item) =>{
    try {
        dispatch(codeList.increment(item))
    }catch (err){
        console.log(err)
    }
}