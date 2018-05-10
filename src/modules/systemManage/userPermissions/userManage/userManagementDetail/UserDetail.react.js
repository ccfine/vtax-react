/**
 * Created by liuliyuan on 2018/4/17.
 */
import React,{Component} from 'react';
import {Form,Row,Button,Col,message,Card,Icon} from 'antd'
import PopModal from '../../userManage/popModal'
import UpdateAccount from './UpdateAccount.react'
import {request} from 'utils'

class UserDetail extends Component{

    constructor(props){
        super(props);
        this.refreshCurdTable=this.refreshCurdTable.bind(this)
        this.state={
            editAble:false,
            submitLoading:false,
            showEditButton:false,

            editUserModalKey:Date.now()+'1',
            editUserVisible: false,
            curdTableKey:Date.now(),
            editUserKey:Date.now()+'1',

            updateAccountModalKey:Date.now()+'2',
            updateAccountVisible: false,
            updateAccountKey:Date.now()+'2',

            userData:{
                ...props.userInfo,
                char:[]
            }
        }
    }



    showModal = modalName => e =>{
        this.mounted && this.setState({
            [`${modalName}Visible`]:true
        })
    }

    refreshCurdTable = ()=>{
        this.mounted && this.setState({
            curdTableKey:Date.now()
        })
    }

    fetchOwnCharList(){
        request.get(`/users/${this.props.userInfo.userId}/roles`)
            .then(({data})=>{
                if(data.code===200){

                    this.mounted && this.setState(prevState=>({
                        userData:{
                            ...prevState.userData,
                            char:data.data
                        }
                    }))


                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }


    componentDidMount(){
        this.fetchOwnCharList()
    }
    componentWillReceiveProps(nextProps){
        //更新了用户信息之后，也要更新已分配角色列表
        this.setState(prevState=>({
            userData:{
                ...prevState.userData,
                ...nextProps.userInfo
            }
        }),()=>{
            this.fetchOwnCharList()
        })
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    render(){
        const {userData} = this.state;
        return(
            <Card title='用户信息'
                  extra={<Button size="small"    onClick={this.showModal('editUser')} ><Icon type='edit' />编辑</Button>}
                  style={{...this.props.style}}>
                <div style={{padding: '30px',color: '#999' }}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <p>账号：<span style={{color:'#333'}}>{userData.username}</span></p>
                            <p>角色：
                                {
                                    userData.char.map((item,i)=>(
                                        <span style={{paddingLeft:5}} key={i}>{item.roleName}</span>
                                    ))
                                }
                            </p>
                        </Col>
                        <Col span={6}>
                            <p>手机：<span style={{color:'#333'}}>{userData.phoneNumber}</span></p>
                            <p>状态：<span style={{color:parseInt(userData.enabled,0)=== 1 ? '#009E4A':'#FF0000'}}>{
                                parseInt(userData.enabled,0)=== 1 ? '启用' :'停用'
                            }</span></p>
                        </Col>
                        <Col span={8}>
                            <p>邮箱：<span style={{color:'#333'}}>{userData.email}</span></p>
                            <p>密码：
                                <span style={{color:'#0F83E6',cursor: 'pointer',marginLeft:'20px'}}  onClick={this.showModal('updateAccount')}>修改密码</span>
                            </p>
                        </Col>
                        <Col span={4}>
                            <p>传真：<span style={{color:'#333'}}>{userData.fax}</span></p>
                        </Col>
                    </Row>
                </div>

                <PopModal
                    key={this.state.editUserKey}
                    toggleModalVisible={ visible =>{
                        this.setState({
                            editUserVisible:visible,
                            editUserKey:Date.now()
                        })
                    }}
                    modalType="edit"
                    defaultFields={this.state.userData}
                    defaultCharValues={this.state.userData.char.map(item=>{
                        return item.roleId
                    })}
                    fetchUserInfo={this.props.fetchUserInfo}
                    visible={this.state.editUserVisible} />

                <UpdateAccount
                    key={this.state.updateAccountKey}
                    refreshCurdTable={this.refreshCurdTable}
                    changeVisable={ status =>{
                        this.setState({
                            updateAccountVisible:status,
                            updateAccountKey:Date.now()
                        })
                    }}
                    userId={userData.userId}
                    visible={this.state.updateAccountVisible} />

            </Card>
        )
    }
}

export default  Form.create()(UserDetail)