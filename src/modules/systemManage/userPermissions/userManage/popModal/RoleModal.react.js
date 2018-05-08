/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-08 11:41:20 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-08 18:57:46
 */
import React from "react";
import { Form, Spin, message, Modal, Checkbox, Row, Col } from "antd";
import { request } from "utils";
class RoleModal extends React.Component {
    state = {
        charAllList: [],
        charLoaded: false,
        indeterminate: true,
        checkAll: false,
    };
    fetchCharList() {
        request.get("/roles").then(({ data }) => {
            if (data.code === 200) {
                this.mounted &&
                    this.setState({
                        charAllList: [...data.data.records],
                        charLoaded: true
                    });
            } else {
                message.error(data.msg);
            }
        });
    }
    handleSubmit = () => {}
    handleCancel = () => {
        this.props.toggleModalVisible(false);
    }
    onCheckAllChange=(e)=>{
        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
          });
        this.props.form.setFieldsValue({'roleIds':e.target.checked ? this.state.charAllList.map(item=>item.roleId) : []})
    }
    componentDidMount() {
        this.fetchCharList();
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        const { getFieldDecorator } = this.props.form,
        { charAllList } = this.state,
        {defaultFields=[]} = this.props;
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="角色分配"
                key={this.props.key || "RoleModal"}
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={
                    this.state.charLoaded && this.state.submitLoading
                }
                width="700px"
            >
                <Spin spinning={!this.state.charLoaded}>
                    <Form onSubmit={this.handleSubmit}>
                        <div style={{ borderBottom: "1px solid #E9E9E9",padding:'5px 0' }}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                全选
                            </Checkbox>
                        </div>
                        <br />
                        {getFieldDecorator("roleIds", {
                            initialValue: defaultFields.map(item=>item.roleId),
                            rules: [
                                {
                                    required: true,
                                    message: "请选择角色"
                                }
                            ]
                        })(
                            <Checkbox.Group
                                style={{ width: "100%" }}
                                // onChange={onChange}
                            >
                                <Row>
                                    {charAllList.map((item, index) => {
                                        return (
                                            <Col
                                                span={4}
                                                key={item.roleId}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Checkbox value={item.roleId}>
                                                    {item.roleName}
                                                </Checkbox>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Checkbox.Group>
                        )}
                        {/* {getFields(this.props.form, [
                            {
                                fieldName: "roleIds",
                                type: "checkboxGroup",
                                span: 24,
                                formItemStyle,
                                fieldDecoratorOptions: {
                                    initialValue: [],
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择角色"
                                        }
                                    ]
                                },
                                options: this.state.charList
                            }
                        ])} */}
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(RoleModal);
