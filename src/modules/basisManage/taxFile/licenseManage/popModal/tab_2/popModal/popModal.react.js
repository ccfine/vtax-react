import React, { Component } from 'react'
import { Modal, Form, message, Row } from 'antd'
import { getFields, request } from '../../../../../../../utils'
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
    },
};
const setComItem = (initialValue) => ({
    span: '24',
    type: 'asyncSelect',
    formItemStyle: formItemLayout,
    fieldDecoratorOptions: {
        initialValue,
        rules: [
            {
                required: true,
                message: '请选择合同编号'
            }
        ]
    }
});
class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        submited: false,
        updateSelectKey: Date.now()
    }
    hideModal() {
        this.props.hideModal();
        // 回归初始状态
        this.props.form.resetFields();
        this.setState({ loading: false });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible && nextProps.visible) {
            this.setState({
                updateSelectKey: Date.now()
            })
        }
    }
    handleOk() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                if (values.contract) {
                    values['leaseContractId'] = values.contract.key;
                    values['contractNum'] = values.contract.label;
                    values.contract = undefined;
                }
                let obj = Object.assign({}, this.props.record, values);
                this.setState({ loading: true });
                request.put('/project/stage/update', obj).then(({ data }) => {
                    if (data.code === 200) {
                        message.success('修改成功', 4);
                        this.hideModal();
                        this.props.update();
                    } else {
                        this.setState({ loading: false });
                        message.error(data.msg, 4);
                    }
                })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ loading: false });
                    })
            }
        });
    }
    render() {
        const { record = {}, form } = this.props;
        return (
            <Modal
                title='分期 - 土地出让合同 - 修改'
                visible={this.props.visible}
                width='400px'
                onCancel={() => { this.hideModal() }}
                onOk={() => { this.handleOk() }}
                confirmLoading={this.state.loading}
                maskClosable={false}
            >
                <Form>
                    <Row>
                        {
                            getFields(form, [{
                                label: '合同编号',
                                fieldName: 'contract',
                                ...setComItem(record.leaseContractId?{ key: record.leaseContractId, label: record.contractNum }:undefined),
                                componentProps: {
                                    fieldTextName: 'contractNum',
                                    fieldValueName: 'id',
                                    fetchAble: true,
                                    url: `/contract/land/list/all/${record.projectId}?${this.state.updateSelectKey}`,
                                    selectOptions: {
                                        labelInValue: true
                                    }
                                }
                            }
                            ])
                        }
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);