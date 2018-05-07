/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-16 14:07:17 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-04-16 18:22:41
 */
import React, { Component } from "react";
import {Link} from 'react-router-dom';
import { Button, Icon } from "antd";
import { SearchTable } from "compoments";
import PopModal from "./popModal";
import { connect } from "react-redux";
const searchFields = [
    {
        label: "用户名",
        type: "input",
        span: 8,
        fieldName: "username "
    },
    {
        label: "姓名",
        type: "input",
        span: 8,
        fieldName: "realname"
    }
];
const columns = [
    {
        title: "操作",
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=> <Link to={{
            pathname:`/web/systemManage/userPermissions/userManage/${record.username}`
        }}>详情</Link>
    }, {
        title: "用户名",
        dataIndex: "username"
    }, {
        title: "姓名",
        dataIndex: "realname"
    }, {
        title: "手机",
        dataIndex: "phoneNumber"
    }, {
        title: "邮箱",
        dataIndex: "email"
        /* }, {
        title: "角色",
       render: (text, record) => (
            <div>
                {record.roles.map((item, i) => (
                    <span key={i} style={{ color: "#108ee9" }}>
            {item.roleName}
                        、
          </span>
                ))}
            </div>
        )*/
    },
    {
        title: "状态",
        dataIndex: "isEnabled",
        render:text=>{
            //1:启用;2:停用;3:删除; ,
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color: '#008000'}}>启用</span>;
                    break;
                case 2:
                    t=<span style={{color: "#FF0000"}}>停用</span>;
                    break;
                case 3:
                    t=<span style={{color: "#f5222d"}}>删除</span>;
                    break;
                default:
                //no default
            }
            return t
        },
    }
];

class UserManage extends Component {
    state = {
        updateKey: Date.now(),
        createUserKey:Date.now(),
        createUserVisible: false,
        action: "",
    };

    hideModal = () => {
        this.setState({ createUserVisible: false });
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };

    render() {
        return (
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                doNotFetchDidMount={false}
                tableOption={{
                    key: this.state.updateKey,
                    pageSize: 10,
                    columns: columns,
                    url: '/sysUser/list',
                    cardProps: {
                        title: "用户列表",
                        extra: <div>
                            <Button size="small" style={{marginRight: 5}} onClick={() => {
                                this.setState({
                                    createUserVisible: true,
                                    action: "add",
                                });
                            }}>
                                <Icon type="plus"/>新增
                            </Button>
                        </div>,
                    }
                }}
            >

                <PopModal
                    key={this.state.createUserKey}
                    toggleModalVisible={ visible =>{
                        this.setState({
                            createUserVisible:visible,
                            createUserKey:Date.now()
                        })
                    }}
                    refreshTable={this.refreshTable}
                    visible={this.state.createUserVisible} />
            </SearchTable>
        )
    }
}

export default connect(state => ({
    orgId: state.user.get("orgId")
}))(UserManage);
