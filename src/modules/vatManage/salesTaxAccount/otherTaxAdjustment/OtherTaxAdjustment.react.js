/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import { Button, Popconfirm, message, Icon } from 'antd'
import { SearchTable } from '../../../../compoments'
import PopModal from './popModal'
import { request, fMoney, getUrlParam, listMainResultStatus } from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment';

const buttonStyle = {
    margin: '0 5px'
}

const searchFields = (disabled) => {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            span: 8,
            fieldName: 'mainId',
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税主体'
                    }
                ]
            },
        },
        {
            label: '调整日期',
            fieldName: 'adjustDate',
            type: 'monthPicker',
            span: 8,
            componentProps: {
                format: 'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择调整日期'
                    }
                ]
            },
        }
    ]
}
const getColumns = (context) => [{
    title: '操作',
    render(text, record, index) {
        return (
            <span>
                <a style={{ marginRight: "5px" }} onClick={() => {
                    context.setState({ visible: true, action: 'modify', opid: record.id });
                }}>修改</a>
                <Popconfirm title="确定要删除吗?" onConfirm={() => { context.deleteRecord(record) }} onCancel={() => { }} okText="确认" cancelText="取消">
                    <a style={{ marginRight: "5px" }}>删除</a>
                </Popconfirm>
            </span>
        );
    },
    fixed: 'left',
    width: '70px',
    dataIndex: 'action'
}, {
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '调整日期',
    dataIndex: 'adjustDate',
}, {
    title: '项目',
    dataIndex: 'project',
    render(text, record, index) {
        switch (text) {
            case '1':
                return '涉税调整';
            case '2':
                return '纳税检查调整';
            default:
                return text;
        }
    }
}, {
    title: '应税项目',
    dataIndex: 'taxableProjectName',
}, {
    title: '业务类型',
    dataIndex: 'taxRateName',
}, {
    title: '税率',
    dataIndex: 'taxRate',
    render: (text) => (text ? `${text}%` : text),
    width: '50px',
}, {
    title: '销售额（不含税）',
    dataIndex: 'amountWithoutTax',
    render: text => fMoney(text),
    className: 'table-money'
}, {
    title: '销项（应纳）税额',
    dataIndex: 'taxAmountWithTax',
    render: text => fMoney(text),
    className: 'table-money'
}, {
    title: '服务、不动产和无形资产扣除项目本期实际扣除金额（含税）',
    dataIndex: 'deductionAmount',
    render: text => fMoney(text),
    className: 'table-money',
    width: '100px',
}, {
    title: '调整原因',
    dataIndex: 'adjustReason',
    render(text, record, index) {
        switch (text) {
            case '1':
                return '尾款调整';
            case '2':
                return '非地产业务（租金，水电费等）相关调整';
            case '3':
                return '未开票收入差异调整';
            default:
                return text;
        }
    }
}, {
    title: '具体调整说明',
    dataIndex: 'adjustDescription',
}
];

class OtherTaxAdjustment extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        action: 'add',
        updateKey: Date.now(),
        filters: undefined,
        status: undefined,
        submitLoading: false,
        revokeLoading: false,
        dataSource:[],
    }
    hideModal() {
        this.setState({ visible: false });
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    deleteRecord = (record) => {
        request.delete(`/account/output/othertax/delete/${record.id}`).then(({ data }) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.setState({ updateKey: Date.now() });
            } else {
                message.error(data.msg, 4);
            }
        })
            .catch(err => {
                message.error(err.message);
            })
    }
    updateStatus = (values = this.state.filter) => {
        this.setState({ filter: values });
        request.get('/account/output/othertax/main/listMain', { params: values }).then(({ data }) => {
            if (data.code === 200) {
                let status = {};
                if (data.data) {
                    status.status = data.data.status;
                    status.lastModifiedDate = data.data.lastModifiedDate;
                    this.setState({ status: status, filter: values });
                }
            }
        })
    }
    commonSubmit = (url, params, action, messageInfo) => {
        this.setState({ [`${action}Loading`]: true });
        request.post(url, params)
            .then(({ data }) => {
                if (data.code === 200) {
                    message.success(messageInfo, 4)
                    this.setState({ [`${action}Loading`]: false });
                    this.updateStatus(params);
                } else {
                    message.error(data.msg, 4)
                    this.setState({ [`${action}Loading`]: false });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({ [`${action}Loading`]: false });
            })
    }
    submit = () => {
        let params = { ...this.state.filter };
        this.commonSubmit('/account/output/othertax/main/submit', params, 'submit', '提交成功');
    }
    revoke = () => {
        let params = { ...this.state.filter };
        this.commonSubmit('/account/output/othertax/main/restore', params, 'revoke', '撤回提交成功');
    }
    componentDidMount() {
        const { search } = this.props.location;
        if (!!search) {
            this.update()
        }
    }
    render() {
        const { search } = this.props.location;
        let disabled = !!search;
        let { filters, status,dataSource } = this.state,
            buttonDisabled = !filters || !(dataSource && dataSource.length && dataSource.length>0),
            isSubmit =(status && status.status === 2);
        return (
            <div>
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields: searchFields(disabled)
                    }}
                    backCondition={(values) => {
                        let params = { mainId: values.mainId, taxMonth: values.adjustDate };
                        this.setState({ filters: params })
                        this.updateStatus(params)
                    }}
                    tableOption={{
                        scroll: { x: '150%' },
                        pageSize: 10,
                        columns: getColumns(this),
                        key: this.state.updateKey,
                        url: '/account/output/othertax/list',
                        cardProps: {
                            title: '其他涉税调整台账',
                            extra: (<div>
                                {
                                    dataSource.length>0 && listMainResultStatus(status)
                                }
                                <Button size='small' style={{ marginRight: 5 }} disabled={buttonDisabled || isSubmit} onClick={this.submit} loading={this.state.submitLoading}>
                                    <Icon type="check" />
                                    提交
                                </Button>
                                <Button size='small' style={{ marginRight: 5 }} disabled={buttonDisabled || !isSubmit} onClick={this.revoke} loading={this.state.revokeLoading}>
                                    <Icon type="rollback" />
                                    撤回提交
                                </Button>
                                <Button size='small' style={buttonStyle} onClick={() => { this.setState({ visible: true, action: 'add', opid: undefined }) }}><Icon type="plus" />新增</Button>
                            </div>)
                        },
                        onDataChange: (data) => {
                            this.setState({
                                buttonDisabled: false,
                                dataSource:data
                            });
                        }
                    }}
                >
                </SearchTable>
                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => { this.hideModal() }}
                    id={this.state.opid}
                    update={this.update} />
            </div>
        )
    }
}
export default withRouter(OtherTaxAdjustment)