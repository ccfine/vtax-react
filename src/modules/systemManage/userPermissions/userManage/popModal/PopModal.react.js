/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-16 15:11:26 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-04-16 18:17:50
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row,Alert } from "antd";
import { getFields, request, regRules } from "../../../../../utils";
import { connect } from "react-redux";

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 16 }
  }
};
const setComItem = (
  initialValue,
  readonly = false,
  required = true,
  message
) => ({
  span: "12",
  type: "input",
  formItemStyle: formItemLayout,
  fieldDecoratorOptions: {
    initialValue,
    rules: [
      {
        required: required,
        message: message
      }
    ]
  },
  componentProps: {
    disabled: readonly
  }
});
class PopModal extends Component {
  state = {
    loading: false,
    formLoading: false,
    record: {},
    roleList: [
      { label: "业务员", value: "123" },
      { label: "管理员", value: "1" }
    ]
  };
  componentDidMount() {
    //-------暂时注释调，角色还没数据
    //this.fetchAllRoles();
  }
  componentWillReceiveProps(props) {
    if (props.visible && this.props.visible !== props.visible) {
      if (props.userName) {
        this.setState({ formLoading: true });
        request.get(`/users/${props.userName}`).then(({ data }) => {
          if (data.code === 200) {
            this.setState({ formLoading: false, record: data.data });
          }
        });
      } else {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {} });
      }
    }
  }
  fetchAllRoles() {
    request.get(`/roleAll`).then(({ data }) => {
      if (data.code === 200) {
        this.setState({
          roleList: data.data.map(ele => ({
            label: ele.roleName,
            value: ele.roleId
          }))
        });
      }
    });
  }
  hideSelfModal = () => {
    this.props.form.resetFields();
    this.setState({ formLoading: false, record: {} });
    this.props.hideModal();
  };
  handleOk() {
    if (
      (this.props.action !== "modify" && this.props.action !== "add") ||
      this.state.formLoading
    ) {
      this.hideSelfModal();
      return;
    }

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 提交数据
        //处理启用数据 状态，1：启用，2：禁用
        values.enabled = values.enabled ? 1 : 2;
        let obj = Object.assign({}, this.state.record, values);

        let result, sucessMsg;
        if (this.props.action === "modify") {
          result = request.put(`/users/${this.state.record.userId}`, obj);
          sucessMsg = "修改成功";
        } else if (this.props.action === "add") {
          obj.password = '888888'; 
          result = request.post(
            `/organizations/${this.props.orgId}/users`,
            obj
          );
          sucessMsg = "添加成功";
        }

        this.setState({ loading: true });
        result &&
          result
            .then(({ data }) => {
              if (data.code === 200) {
                message.success(sucessMsg, 4);
                this.setState({ loading: false });
                this.props.update && this.props.update();
                this.props.hideModal();
              } else {
                this.setState({ loading: false });
                message.error(data.msg, 4);
              }
            })
            .catch(err => {
              message.error(err.message);
              this.setState({ loading: false });
            });
      }
    });
  }
  render() {
    const readonly = this.props.action === "look",
      form = this.props.form;
    let { record = {} } = this.state,
      title = "查看";
    if (this.props.action === "add") {
      title = "添加";
    } else if (this.props.action === "modify") {
      title = "修改";
    }
    return (
      <Modal
        title={title}
        visible={this.props.visible}
        width="700px"
        style={{ top: "10%" }}
        bodyStyle={{ maxHeight: "450px", overflow: "auto" }}
        onCancel={this.hideSelfModal}
        footer={[
          <Button key="back" onClick={this.hideSelfModal}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={() => {
              this.handleOk();
            }}
          >
            确认
          </Button>
        ]}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Spin spinning={this.state.formLoading}>
          <Form>
            <Row>
              {getFields(form, [
                {
                  ...setComItem(record.realname, readonly, true, "请填写姓名"),
                  label: "姓名",
                  fieldName: "realname",
                  type: "input"
                },
                {
                  ...setComItem(record.username, readonly, true, "请填写帐号"),
                  label: "帐号",
                  fieldName: "username",
                  type: "input",
                  fieldDecoratorOptions: {
                    initialValue: record.username,
                    rules: [
                      {
                        required: true,
                        message: "请填写帐号"
                      },
                      regRules.userName
                    ]
                  }
                }
              ])}
            </Row>
            <Row>
              {getFields(form, [
                {
                  ...setComItem(
                    record.phoneNumber,
                    readonly,
                    true,
                    "请填写手机号码"
                  ),
                  label: "手机",
                  fieldName: "phoneNumber",
                  type: "input",
                  fieldDecoratorOptions: {
                    initialValue: record.phoneNumber,
                    rules: [
                      {
                        required: true,
                        message: "请填写手机号码"
                      },
                      regRules.mobile_phone
                    ]
                  }
                },
                {
                  ...setComItem(record.email, readonly, true, "请填写邮箱"),
                  label: "邮箱",
                  fieldName: "email",
                  type: "input",
                  span: 12,
                  fieldDecoratorOptions: {
                    initialValue: record.email,
                    rules: [
                      {
                        required: true,
                        message: "请填写邮箱"
                      },
                      regRules.email
                    ]
                  }
                }
              ])}
            </Row>
            <Row>
              {getFields(form, [
                {
                  ...setComItem(record.fax, readonly, false),
                  span: 12,
                  label: "传真",
                  fieldName: "fax",
                  type: "input"
                }
              ])}
            </Row>
            <Row>
              {getFields(form, [
                {
                  ...setComItem(record.roleIds, readonly, true, "请选择角色"),
                  label: "角色",
                  fieldName: "roleIds",
                  type: "checkboxGroup",
                  span: 16,
                  formItemStyle: {
                    labelCol: {
                      xs: { span: 12 },
                      sm: { span: 6 }
                    },
                    wrapperCol: {
                      xs: { span: 12 },
                      sm: { span: 18 }
                    }
                  },
                  options: this.state.roleList
                }
              ])}
              <span>目前还是静态数据，角色还没数据 L55 注释取消便可以</span>
            </Row>
            <Row>
              {getFields(form, [
                {
                  ...setComItem(record.enabled===1, readonly, false),
                  label: "状态",
                  fieldName: "enabled",
                  type: "switch",
                  span: 16,
                  formItemStyle: {
                    labelCol: {
                      xs: { span: 12 },
                      sm: { span: 6 }
                    },
                    wrapperCol: {
                      xs: { span: 12 },
                      sm: { span: 18 }
                    }
                  },
                  componentProps: {
                    disabled: readonly,
                    checkedChildren: "启用",
                    unCheckedChildren: "禁用",
                    defaultChecked:record.enabled===1
                  }
                }
              ])}
              <span>还需要修改getFeild文件</span>
            </Row>
          </Form>
        </Spin>
        {this.props.action === "add" && <Alert message="新添加的帐号的初始密码为：888888" type="info" showIcon />}
      </Modal>
    );
  }
}

export default connect(state => ({
  orgId: state.user.get("orgId")
}))(Form.create()(PopModal));
