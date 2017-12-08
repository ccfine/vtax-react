/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 15:53
 * description  :
 */

import { createActions, handleActions } from 'redux-actions'
//TODO:  npm 的时候必须加上版本号 4.0.0-rc.9  要不然 getIn() 用不了
import {fromJS} from 'immutable';

const data = {
    password: "string",
    phoneNumber: "string",
    provinceCode: "string",
    realname: "string",
    remark: "string",
    sex: "string",
    userId: 0,
    username: "string",
    token: "string",
    email: "string",
    address: "string",
    administrator: 0,
    avatar: "string",
}

const initialState = fromJS({
    /**用户个人信息*/
    personal:{
        realname:undefined,
        username:undefined,
        userId:undefined,
    },
    /**登录凭证*/
    token:undefined,

    /**是否登录成功*/
    isAuthed:false,
});

export const {personal, token, isAuthed} = createActions({
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