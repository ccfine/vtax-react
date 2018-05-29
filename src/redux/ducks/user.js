/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 15:53
 * description  :
 */

import { createActions, handleActions } from 'redux-actions'
//TODO:  npm 的时候必须加上版本号 4.0.0-rc.9  要不然 getIn() 用不了
import {fromJS} from 'immutable';
import {request} from 'utils'

const initialState = fromJS({
    /**用户个人信息*/
    personal:{
        email:null ,// 邮箱
        options: null,// 用户所有权限(查询详情时才加载数据)
        phoneNumber:null ,// 手机号码
        realname:null ,// 真实姓名
        type:null ,// [类型]；8192为管理员；8189为组织管理员类型 ；1为普通员工；
        username:null ,// 用户名
    },

       /*
        { //非必须参数
        id:'' ,// 主键
        isEnabled:'' ,// 是否可用,1:可用 2:禁用 3:删除
        lastModifiedBy:'' ,// 修改人
        lastModifiedDate:'' ,// 修改时间
        orgId:'' ,// 所属组织列表（登录帐号类型为系统管理员时必填否则不填，后台会默认当前组织）
        orgIds:'' ,// 所属组织列表（登录帐号类型为系统管理员时必填否则不填，后台会默认当前组织）
        password:'' ,// 用户密码
        remark:'' ,// 备注
        token:'' ,// 用户身份令牌
        wechat:'' ,// 微信号

        email:null ,// 邮箱
        options: null,// 用户所有权限(查询详情时才加载数据)
        phoneNumber:null ,// 手机号码
        realname:null ,// 真实姓名
        type:null ,// [类型]；8192为管理员；8189为组织管理员类型 ；1为普通员工；
        username:null ,// 用户名
    },*/
    /**组织代码 - 当前组织列表（登录帐号类型为系统管理员时必填否则不填，后台会默认当前组织）*/
    orgId:null,

    /**
     * 登录方式
     * 1：通过登录页登录
     * 2：通过url登录*/
    loginType:null,

    /**登录凭证 - 用户身份令牌*/
    token:null,

    /**是否登录成功*/
    isAuthed:false,

    //给纳税申报用的对象
    declare:null,
});

export const {personal, token, isAuthed, orgId, loginType, declare} = createActions({
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
    },
    LOGIN_TYPE:{
        /**增加*/
        INCREMENT:type => type,
    },
    DECLARE:{
        /**增加*/
        INCREMENT:info => info,
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
    },
    [loginType.increment]:(state,{payload})=>{
        return state.set('loginType',payload)
    },
    [declare.increment]:(state,{payload})=>{
        return state.set('declare',payload)
    },
}, initialState)

export const login = dispatch => async ({userName,password,success,fail,type,loginToken})=>{
    try {
        //正常登录获取token
        type === 1 && await request.post('/oauth/login',{
            userName,
            password
        }).then(res=>{
            request.testSuccess(res.data,data=>{
                dispatch(token.increment(data.token))
                //获取组织信息
                dispatch(orgId.increment(data.orgId))
                //获取用户信息
                dispatch(personal.increment(data))
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

        //url登录直接获得token
        if(type===2){
            dispatch(token.increment(loginToken))
            //获取用户信息
            await request.post('/oauth/loginName',{userName:userName})
                .then(res=>{
                    request.testSuccess(res.data,data=>{
                        dispatch(token.increment(data.token))
                        //获取组织信息
                        dispatch(orgId.increment(data.orgId))
                        //获取用户信息
                        dispatch(personal.increment(data))

                    },err=>{
                        fail && fail(err)
                        console.log(`用户信息获取失败:${err}`)
                    })
                }).catch(err=>{
                    fail && fail(err.message)
                })

            //所有信息获取完毕后，设置登录方式
            dispatch(loginType.increment(type))
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
//给纳税申报用的
export const saveDeclare = dispatch => async (data) =>{
    try {
        dispatch(declare.increment(data))
    }catch (err){
        console.log(err)
    }
}


