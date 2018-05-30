/*
 * @Author: liuchunxiu
 * @Date: 2018-05-09 14:10:18
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-29 09:46:46
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
    checkAllChecked = (allCode, code, index) => e => {
        //所有的查看后四位数字都是1002
        const { allPermission=[] } = this.props;
        const { setFieldsValue, getFieldValue } = this.props.form;
        setFieldsValue({
            [code]: e.target.checked
        });

        if (`allCode${index}` === allCode) {
            let arr = [];
            allPermission[index].permissionVOs.forEach(item=>{
                arr.push(getFieldValue(item.permissionId));
            })
            setFieldsValue({
                [allCode]: arr.filter(item => !item).length === 0
            });
        }

        //后期优化 - 实现只要选择了查看以外的权限就必须给查看权限
        /*let arr = [];
        allPermission[index].permissionVOs.forEach(item=>{
            arr.push(getFieldValue(item.permissionId));
            if(e.target.checked && parseInt(item.permissionId.slice(-4), 0) === 1002){
                setFieldsValue({
                    [item.permissionId]: e.target.checked
                });
            }
        })
        if (`allCode${index}` === allCode) {
            setFieldsValue({
                [allCode]: arr.filter(item => !item).length === 0
            });
        }*/
    };
    initCheckAllDisabled=(data)=>{
        return data.every(item => {
            return this.props.disabledPermission.indexOf(item.permissionId) > -1;
        });
    }
    checkDisabled = permissionId => {
        return this.props.disabledPermission.indexOf(permissionId) > -1;
    };
    initCheckboxAll = (data) => {
        return data.length>0 && data.every(item => {
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
                        width: "100%",
                        minHeight:200
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
                                            paddingRight: 15,
                                            color: 'rgba(0, 0, 0, 0.85)',
                                        }}
                                        span={6}
                                    >
                                        {item.moduleName}:
                                    </Col>
                                    <Col span={18}>
                                        {editAble && (
                                            <FormItem>
                                                {getFieldDecorator(`allCode${i}`,{
                                                    valuePropName: 'checked',
                                                    initialValue: this.initCheckboxAll(item.permissionVOs),
                                                    onChange:this.onCheckAllChange(item)
                                                })(
                                                    <Checkbox
                                                        disabled={this.initCheckAllDisabled(item.permissionVOs)}>
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
                                                                    fieldItem.permissionId,
                                                                    i
                                                                )
                                                            }
                                                        )(
                                                            <Checkbox
                                                                disabled={
                                                                    !editAble ||
                                                                    this.checkDisabled(fieldItem.permissionId)
                                                                }>
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
