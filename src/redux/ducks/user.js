/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 15:53
 * description  :
 */

import { createActions, handleActions } from 'redux-actions'
//TODO:  npm 的时候必须加上版本号 4.0.0-rc.9  要不然 getIn() 用不了
import {fromJS} from 'immutable';
import {request} from '../../utils'

const initialState = fromJS({
    /**用户个人信息*/
    personal:{
        adminUrl:null,
        email:null,
        enabled:null,
        fax:null,
        phoneNumber:null,
        realname:null,
        roleType:null,
        roles:null,
        sex:null,
        userId:null,
        userType:null,
        username:null,
    },
    /**组织代码*/
    orgId:null,

    /**登录凭证*/
    token:null,

    /**是否登录成功*/
    isAuthed:false,
});

export const {personal, token, isAuthed, orgId} = createActions({
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
    ORG_ID:{
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
    [orgId.increment] : (state, {payload})=>{
        return state.set('orgId', payload)
    }
}, initialState)

export const login = dispatch => async ({userName,password,success,fail})=>{
    try {

        await request.post('/oauth/login',{
            userName,
            password
        }).then(res=>{
            request.testSuccess(res.data,data=>{
               // console.log(data)
                dispatch(token.increment(data.token))
                //获取组织信息
                dispatch(orgId.increment(data.orgId))
                //获取用户信息
                dispatch(personal.increment(data.secUserBasicBO))
                //用户信息获取成功的话
                //所需信息全部加载完毕，完成登录
                dispatch(isAuthed.login())
                //执行登录成功回调
                success && success()
            },err=>{
                fail && fail(err)
            })
        }).catch(err=>{
            fail && fail(err.message)
        })

    }catch(err) {
        console.log(err)
    }
}

export const logout = dispatch => async () =>{
    //登出
    dispatch(isAuthed.logout())
}

export const saveOrgId = dispatch => async (id) =>{
    try {
        dispatch(orgId.increment(id))
    }catch (err){
        console.log(err)
    }
}

export const saveToken = dispatch => async (data) =>{
    try {
        dispatch(token.increment(data))
    }catch (err){
        console.log(err)
    }
}