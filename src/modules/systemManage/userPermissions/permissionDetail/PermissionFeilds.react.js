/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-09 14:10:18 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-10 17:41:36
 */
import React from "react";
import { Form, Row, Col, Checkbox, Spin } from "antd";
const FormItem = Form.Item;
class PermissionFeilds extends React.Component {
    static defaultProps = {
        editAble: true,
        checkedPermission: [],
        disabledPermission: [],
        allPermission: [],
        permissionLoading: false
    };
    /*不要在这里获取数据，父组件更新一次，这里从新创建一次，没创建一次这个数据从新获取一次，可能原因：Form.create */
    // state = {
    //     allPermission: [],
    //     allPermissionLoading: false
    // };
    // fetchAllPermission() {
    //     this.setState({ allPermissionLoading: true });
    //     request
    //         .get("/permissions")
    //         .then(({ data }) => {
    //             if (data.code === 200) {
    //                 this.setState({
    //                     allPermission: data.data,
    //                     allPermissionLoading: false
    //                 });
    //             } else {
    //                 message.error(data.msg, 4);
    //                 this.setState({ allPermissionLoading: false });
    //             }
    //         })
    //         .catch(err => {
    //             message.error(err.message, 4);
    //             this.setState({ allPermissionLoading: false });
    //         });
    // }
    onCheckAllChange = item => e => {
        const { setFieldsValue } = this.props.form;

        let newItems = [...item.permissionVOs];
        if (e.target.checked) {
            newItems.forEach(item => {
                setFieldsValue({
                    [item.permissionId]: true
                });
                return item;
            });
        } else {
            // 如果时禁用的checkbox不要改变
            newItems.forEach(item => {
                this.checkDisabled(item.permissionId) ||
                setFieldsValue({
                    [item.permissionId]: false
                });
                return item;
            });
        }
    };
    checkAllChecked = (allCode, code) => e => {
        const { allPermission=[] } = this.props;
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({
            [code]: e.target.checked
        });
        for (let i = 0; i < allPermission.length; i++) {
            if (`allCode${i}` === allCode) {
                let arr = [];
                allPermission[i].permissionVOs.forEach(item => {
                    arr.push(getFieldValue(item.permissionId));
                });
                setFieldsValue({
                    [allCode]: arr.filter(item => !item).length === 0
                });
                break;
            }
        }
    };
    checkDisabled = permissionId => {
        return this.props.disabledPermission.indexOf(permissionId) > -1;
    };
    initCheckboxAll = data => {
        return data.every(item => {
            return this.props.checkedPermission.indexOf(item.permissionId) > -1;
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form,
            { editAble, checkedPermission, allPermission:data,permissionLoading } = this.props;

        return (
            <Row>
                <div
                    style={{
                        width: "100%"
                    }}
                >
                    <Spin spinning={permissionLoading}>
                        {data.map((item, i) => {
                            return (
                                <Row key={i}>
                                    <Col
                                        style={{
                                            textAlign: "right",
                                            lineHeight: "32px",
                                            paddingRight: 15
                                        }}
                                        span={4}
                                    >
                                        {item.moduleName}:
                                    </Col>
                                    <Col span={20}>
                                        {editAble && (
                                            <FormItem>
                                                {getFieldDecorator(`allCode${i}`,{
                                                    initialValue: this.initCheckboxAll(
                                                        item.permissionVOs
                                                    )
                                                })(
                                                    <Checkbox
                                                        defaultChecked={this.initCheckboxAll(
                                                            item.permissionVOs
                                                        )}
                                                        onChange={this.onCheckAllChange(
                                                            item
                                                        )}
                                                    >
                                                        全选
                                                    </Checkbox>)}
                                            </FormItem>
                                        )}
                                        {item.permissionVOs.map(
                                            (fieldItem, j) => {
                                                return (
                                                    <FormItem key={j}>
                                                        {getFieldDecorator(
                                                            fieldItem.permissionId,
                                                            {
                                                                initialValue:
                                                                checkedPermission.indexOf(
                                                                    fieldItem.permissionId
                                                                ) > -1,
                                                                valuePropName:
                                                                    "checked",
                                                                onChange: this.checkAllChecked(
                                                                    `allCode${i}`,
                                                                    fieldItem.permissionId
                                                                )
                                                            }
                                                        )(
                                                            <Checkbox
                                                                disabled={
                                                                    !editAble ||
                                                                    this.checkDisabled(
                                                                        fieldItem.permissionId
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    fieldItem.actionName
                                                                }
                                                            </Checkbox>
                                                        )}
                                                    </FormItem>
                                                );
                                            }
                                        )}
                                    </Col>
                                </Row>
                            );
                        })}
                    </Spin>
                </div>
            </Row>
        );
    }
}

export default PermissionFeilds;
