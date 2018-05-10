/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import {message} from 'antd'
import {request} from 'utils'
import UserDetail from './UserDetail.react'

class UserManagementDetail extends Component {
    state={
        userInfo:{

        },
        loaded:false
    }

    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    componentDidMount(){
        this.fetchUserInfo(this.props.match.params.userName)
    }
    fetchUserInfo(username){
        this.setState({
            loaded:false,
        })
        request.get(`/users/${username}`)
            .then(({data})=>{
                if(data.code===200){
                    const newUserInfo = data.data;
                    this.mounted && this.setState({
                        userInfo:newUserInfo,
                        loaded:true
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {userInfo} = this.state;
        return(
            <div>
                <h2 style={{marginBottom:20}}>{userInfo['realname']}</h2>
                {
                    userInfo.userId ? <UserDetail fetchUserInfo={this.fetchUserInfo.bind(this)} userInfo={userInfo} /> : null
                }
            </div>
        )
    }
}

export default UserManagementDetail
