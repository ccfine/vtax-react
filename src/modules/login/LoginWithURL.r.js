/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {getUrlParam} from 'utils'
import {connect} from 'react-redux'
import {login} from '../../redux/ducks/user'
class LoginWithURL extends Component{
    static propTypes={
        login:PropTypes.func.isRequired
    }
    //url通过token登录  /loginA?userName=&token=
    loginWithToken(loginToken,userName){
        const {login} = this.props;
        login({
            type:2,
            loginToken,
            userName
        })
    }
    componentWillMount(){
        const userName=getUrlParam('userName'),
            loginToken=getUrlParam('token');

        if(this.props.isAuthed){
            this.props.history.push('/web')
            return;
        }
        if(userName && loginToken){
            this.loginWithToken(loginToken,userName)
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isAuthed){
            nextProps.history.push('/web')
        }
    }
    render(){
        return(
            <div>
                loginWithUrl-跳转登录
            </div>
        )
    }
}

export default connect(state=>({
    isAuthed:state.user.get('isAuthed')
}),dispatch=>({
    login:login(dispatch),
}))(LoginWithURL)
