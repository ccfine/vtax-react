
/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:10
 * description  :
 */
import React,{Component} from 'react'
import { Layout,Form, Icon, Input, Button, Alert,Row,Col} from 'antd'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {regRules} from 'utils'
import {login} from '../../redux/ducks/user'
import logo from './images/logo.png'
import loginIcon from './images/login.png'
import './styles.less'

const FormItem = Form.Item;

class Login extends Component {
    static propTypes={
        login:PropTypes.func.isRequired
    }

    state={
        error:{
            visible:false,
            msg:'出错了！'
        },
        loading:false
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        const {login} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoading(true)
                login({
                    userName:values.userName,
                    password:values.password,
                    fail:err=>{
                        this.setError(err)
                        this.toggleLoading(false)
                    },
                })

            }
        });
    }

    toggleLoading=b=>{
        this.setState({
            loading:b
        })
    }
    setError=msg=>{
        this.setState({
            error:{
                visible:true,
                msg
            }
        },()=>{
            setTimeout(()=>{
                this.mount && this.setState(prevState=>({
                    error:{
                        ...prevState.error,
                        visible:false
                    }
                }))
            },4000)
        })
    }

    checkLoggedIn= props =>{
        const {isAuthed,history} = props;
        if(isAuthed){
            history.replace('/web');
        }
    }
    componentWillMount(){
        this.checkLoggedIn(this.props)
    }
    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="login-container">
                <header className='login-header'>
                    <div className="login-header-content">
                        <img src={logo} alt="logo" style={{float:'left',marginRight:15}}/>
                        <span>碧桂园增值税管理系统</span>
                    </div>
                </header>
                <Layout className='login-content'>
                    <Row>
                        <Col span={12}>
                            <img src={loginIcon} alt="login"/>
                        </Col>
                        <Col span={12}>
                            <Form onSubmit={this.handleSubmit}  className="loginForm">
                                <h2 className="welcome">碧桂园增值税管理系统</h2>
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                        rules: [{
                                            required: true,message: '请输入用户名!'
                                        },{
                                            pattern:regRules.userName.pattern, message: regRules.userName.message,
                                        }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ fontSize: 14 }} />} placeholder="用户名" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true, message: '请输入密码!'
                                        },{
                                            pattern:regRules.password.pattern, message: regRules.password.message,
                                        }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ fontSize: 14 }} />} type="password" placeholder="密码" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {/*{getFieldDecorator('remember', {
                                     valuePropName: 'checked',
                                     initialValue: true,
                                     })(
                                     <Checkbox>记住密码</Checkbox>
                                     )}*/}
                                    <Button type="primary" htmlType="submit" className="loginFormButton">
                                        登录
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    {
                                        this.state.error.visible ? <Alert key='errorMsg' message={this.state.error.msg} type="error" /> : null
                                    }
                                </FormItem>
                                <p className="loginFormFooter">如需帮助，请拨打4000 888 600</p>
                            </Form>
                        </Col>
                    </Row>
                </Layout>
                <footer className="login-footer">
                    ©Copyright 喜盈佳企业云服务有限公司 粤ICP备16030834号 粤公网安备 44030502000290号
                </footer>
            </div>
        )
    }
}

const FormLogin = Form.create()(Login);

export default connect(state=>({
    isAuthed:state.user.get('isAuthed')
}),dispatch=>({
    login:login(dispatch),
}))(FormLogin)