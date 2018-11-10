/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react'
import { Layout,Form, Icon, Input, Button, Alert,Row,Col} from 'antd'
import { Base64 } from 'js-base64';
import md5 from 'blueimp-md5'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {regRules} from 'utils'
import {login} from '../../redux/ducks/user'
import logo from './images/logo.png'
import loginIcon from './images/login.png'
import './styles.less'
const FormItem = Form.Item;

class LoginWithNormal extends Component {
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
                //console.log(EncryptAES(values.userName))
                //console.log(DecryptAES(EncryptAES(values.userName)))
                this.toggleLoading(true)
                login({
                    userName:Base64.encode(values.userName),
                    password:Base64.encode(md5(values.password)),
                    type:1,//1表示正常通过登录页面登录,
                    success:()=>{

                    },
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
        const {isAuthed,history,personal} = props;
        if(isAuthed && personal && personal.id && personal.username){
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
                        <span>增值税纳税申报系统</span>
                    </div>
                </header>
                <Layout className='login-content'>
                    <Row>
                        <Col span={12}>
                            <img src={loginIcon} alt="login"/>
                        </Col>
                        <Col span={12}>
                            <Form onSubmit={this.handleSubmit}  className="loginForm">
                                <h2 className="welcome">增值税纳税申报系统</h2>
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
                                            /*},{
                                             pattern:regRules.password.pattern, message: regRules.password.message,*/
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
                                {/* <p className="loginFormFooter">如需帮助，请拨打4000 888 600</p> */}
                            </Form>
                        </Col>
                    </Row>
                </Layout>
                <footer className="login-footer">
                    Copyright <Icon type="copyright" /> 2018 碧桂园增值税纳税申报系统
                </footer>
            </div>
        )
    }
}

const LoginWithNormalWithForm = Form.create()(LoginWithNormal);

export default connect(state=>({
    isAuthed:state.user.get('isAuthed'),
    personal:state.user.get('personal'),
}),dispatch=>({
    login:login(dispatch),
}))(LoginWithNormalWithForm)