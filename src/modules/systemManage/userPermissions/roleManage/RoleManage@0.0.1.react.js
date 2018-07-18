/**
 * author       : liuliyuan
 * createTime   : 2018/04/16
 * description  :
 */
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {SearchTable} from 'compoments'
import RoleModal from './popModal'

const searchFields = [
    {
        label: "角色名称",
        type: "input",
        span: 8,
        fieldName: "roleName"
    }
];
const columns = [
    {
        title: '操作',
        width:'10%',
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=>(
            <Link to={{
                pathname:`/web/systemManage/userPermissions/roleManage/${record.id}`,
                state:{
                    roleName:record.roleName,
                    isEnabled:record.isEnabled,
                    remark:record.remark
                }
            }}>详情</Link>
        )
    },{
        title: '角色',
        dataIndex:'roleName',
        width:'15%'
    },{
        title: '状态',
        dataIndex:'isEnabled',
        width:'15%',
        render:(text)=> parseInt(text,0) ===0 ?<span style={{color:'#FF0000'}}>停用</span> :<span style={{color:'#008000'}}>启用</span>
    },{
        title:'备注',
        dataIndex:'remark',
    }];


class RoleManage extends Component{
    state={
        modalKey:Date.now(),
        tableUpDateKey:Date.now(),
        userInfo:{},
        list:[],
    }

    render(){
        const {tableUpDateKey} = this.state
        return (
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                doNotFetchDidMount={false}
                tableOption={{
                    rowKey:'id',
                    key: tableUpDateKey,
                    pageSize: 100,
                    columns: columns,
                    url: '/sysRole/list',
                    cardProps: {
                        title: "角色列表",
                        extra: <RoleModal
                            buttonTxt="添加"
                            title="添加角色"
                            key={this.state.modalKey}
                            refreshTable={()=>{
                                this.setState({
                                    tableUpDateKey:Date.now()
                                })
                            }}
                            refresh={()=>{
                                this.setState({
                                    modalKey:Date.now()
                                })
                            }} />,
                    }
                }}
            />
        )
    }
}
export default RoleManage
