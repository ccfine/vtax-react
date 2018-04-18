/**
 * author       : xiaminghua
 * createTime   : 2018/04/16
 * description  :
 */
import React, { Component } from 'react'
import {Card,message} from 'antd'
import {Link} from 'react-router-dom'
import {AsyncTable} from '../../../../compoments'
import {request} from '../../../../utils'
import RolePopModal from './popModal'


const columns = (context)=>[
    {
        title: '角色',
        dataIndex: 'roleName',
        width:'15%'
    },{
        title: '状态',
        dataIndex:'enabled',
        width:'15%',
        render:(text)=> parseInt(text,0) ===0 ?<span style={{color:'#FF0000'}}>停用</span> :<span style={{color:'#008000'}}>启用</span>
    },{
        title:'备注',
        dataIndex:'remark',
    },{
        title: '操作',
        width:'10%',
        className:'text-center',
        render:(text,record)=> (
            <Link to={{
                pathname:`/web/systemManage/userPermissions/roleManage/${record.roleId}`,
                state:{
                    roleName:record.roleName,
                    enabled:record.enabled,
                    remark:record.remark
                }
            }}>详情</Link>
        )
    }];

class RoleManage extends Component{
    state={
        tableUpDateKey:Date.now(),
        visible:false,
        modalConfig:{
            type:''
        },
        roleInfo:{},
        permissionsData:null
    }
    updateTable = () =>{
        this.setState({
            tableUpDateKey:Date.now(),
        })
    }

    changeModel=visible=>{
        this.setState({visible})
    }

    fetchPermissions=(roleId)=>{
        request.get(`/roles/${roleId}/permissions`)
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        permissionsData:data.data
                    },()=>this.changeModel(true))
                }else{
                    message.error(data.msg)
                }
            })
    }
    componentDidMount(){
        this.updateTable()
    }
    render(){
        const {tableUpDateKey} = this.state
        return (
            <div>
                <Card
                    extra={<div>
                        <RolePopModal
                            buttonTxt="新增"
                            title="新增角色"
                            key={this.state.modalKey} refresh={()=>{
                            this.fetchList.bind(this)();
                            this.setState({
                                modalKey:Date.now()
                            })
                        }} />
                    </div>}
                    title='角色列表'
                    style={{marginTop:10}}>
                    <AsyncTable url="/roles"
                                updateKey={tableUpDateKey}
                                tableProps={{
                                    rowKey:record=>`${record.roleId}`,
                                    pagination:true,
                                    size:'small',
                                    columns:columns(this)
                                }} />
                </Card>
            </div>
        )
    }
}
export default RoleManage
