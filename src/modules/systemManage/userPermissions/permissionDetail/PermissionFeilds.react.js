/*
 * @Author: liuchunxiu
 * @Date: 2018-05-09 14:10:18
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-01 18:37:07
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
        const { allPermission=[] } = this.props, // 所有的权限
              { setFieldsValue,getFieldsValue } = this.props.form, // Form方法
              currentPermissionIds = allPermission[index].permissionVOs.map(ele=>ele.permissionId), //当前权限组
              prefix = currentPermissionIds.length===0 ?'':currentPermissionIds[0].slice(0,-4); // 当前权限组前缀
        
        // 一次性获取当前组checkbox所有状态值，并将当前事件值赋给它，保持最新
        let currentValues = getFieldsValue(currentPermissionIds);
        currentValues[code] = e.target.checked;

        // 检测是否有任何被选中的，如果有，查看必选 
        let isAnyCheck = currentPermissionIds.some(ele=>currentValues[ele])
        currentValues[`${prefix}1002`] = isAnyCheck;
        
        // 只有检测了查看是否选择后，才能检测是否所有值都被选中
        let isAllCheck = currentPermissionIds.every(ele=>currentValues[ele]);

        // 确定需要被设置的值
        let setValues = {
            [`allCode${index}`]:isAllCheck,
            [code]:e.target.checked,
            [`${prefix}1002`]:isAnyCheck,
        }
        setFieldsValue(setValues)

        // 注意getValueFromEvent，如果是查看，有其它被选中，不能选择
        if(code === `${prefix}1002`){
            return isAnyCheck;
        }
        else{
            return e.target.checked;
        }
    };
    initCheckAllDisabled=(data)=>{
        return data.every(item => {
            return this.props.disabledPermission.indexOf(item.permissionId) > -1;
        });
    }
    checkDisabled = permissionId => {
        //TODO: 角色里面分配出来的不能选
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
                <div style={{
                        width: "100%",
                        minHeight:200
                    }}>
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
                                                                /*onChange: this.checkAllChecked(
                                                                    `allCode${i}`,
                                                                    fieldItem.permissionId,
                                                                    i
                                                                ),*/
                                                                getValueFromEvent:this.checkAllChecked(
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
