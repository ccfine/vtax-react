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
    fieldName: "username"
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
    title: "用户名",
    dataIndex: "username"
  },
  {
    title: "姓名",
    dataIndex: "realname"
  },
  {
    title: "手机",
    dataIndex: "phoneNumber"
  },
  {
    title: "邮箱",
    dataIndex: "email"
  },
  {
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
    )
  },
  {
    title: "状态",
    dataIndex: "enabled",
    render: text =>
      parseInt(text, 0) === 1 ? (
        <span style={{ color: "#008000" }}>启用</span>
      ) : (
        <span style={{ color: "#FF0000" }}>停用</span>
      )
  },
  {
    title: "操作",
    render: (text, record) => (
      <Link
        to={{
          pathname: `/web/systemManage/userPermissions/userManage/${record.username}`,
        //   state: {
        //     single
        //   }
        }}
      >
        详情
      </Link>
    )
  }
];

class UserManage extends Component {
  state = {
    updateKey: Date.now(),
    visible: false,
    action: "",
    opid: undefined
  };
  hideModal = () => {
    this.setState({ visible: false });
  };
  update = () => {
    this.setState({ updateKey: Date.now() });
  };
  /** @待修改 SearchTable rowKey需要修改，这个列表中没有id*/
  /**index.js:2177 Warning: Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key. */
  render() {
    return (
      <div>
        <SearchTable
          doNotFetchDidMount={false}
          searchOption={{
            fields: searchFields
          }}
          tableOption={{
            scroll: { x: "100%" },
            pageSize: 10,
            columns: columns,
            key: this.state.updateKey,
            url: `/organizations/${this.props.orgId}/users`,
            cardProps: {
              title: "用户列表",
              extra: (
                <div>
                  <Button
                    size="small"
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      this.setState({
                        visible: true,
                        action: "add",
                        opid: undefined
                      });
                    }}
                  >
                    <Icon type="plus" />新增
                  </Button>
                </div>
              )
            }
          }}
        />

        <PopModal
          visible={this.state.visible}
          action={this.state.action}
          hideModal={this.hideModal}
          userName={this.state.opid} 
          update={this.update}
        />
      </div>
    );
  }
}

export default connect(state => ({
  orgId: state.user.get("orgId")
}))(UserManage);
