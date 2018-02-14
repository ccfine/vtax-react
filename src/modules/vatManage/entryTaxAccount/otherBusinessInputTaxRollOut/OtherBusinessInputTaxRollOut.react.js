/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import { Icon, message,Button,Card,Spin } from 'antd'
import { FileImportModal, FileExport,CardSearch,FetchTable } from '../../../../compoments'
import { request, fMoney, getUrlParam } from '../../../../utils'
import moment from 'moment'
import { withRouter } from 'react-router'
const buttonStyle = {
    marginLeft: 5
}

const getColumns = (context) => [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '应税项目',
        dataIndex: 'taxableItem',
    }, {
        title: '计税方法',
        dataIndex: 'taxMethod',
        render(text, record, index) {
            switch (text) {
                case '1':
                    return '一般计税方法';
                case '2':
                    return '简易计税方法';
                default:
                    return text;
            }
        }
    }, {
        title: '转出项目',
        dataIndex: 'outProjectItem',
    }, {
        title: '凭证号',
        dataIndex: 'voucherNum',
    }, {
        title: '日期',
        dataIndex: 'taxDate',
    }, {
        title: '转出税额',
        dataIndex: 'outTaxAmount',
        render: text => fMoney(text),
        className: 'table-money'
    }
];

class OtherBusinessInputTaxRollOut extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        statusLoading: false,
        status: undefined,
        filter: undefined,
        // buttonDisabled:true,
        submitLoading:false,
        revokeLoading:false,
    }
    hideModal() {
        this.setState({ visible: false });
    }
    updateStatus = (values = this.state.filter) => {
        this.setState({ statusLoading: true,filter:values});
        request.get('/account/income/taxout/listMain', { params: values }).then(({ data }) => {
            if (data.code === 200) {
                let status = {};
                if (data.data) {
                    if (data.data.status === 1) {
                        status.text = '暂存'
                    } else if (data.data.status === 2) {
                        status.text = (<span style={{ color: 'green' }}>提交</span>)
                    }
                    status.submitDate = data.data.lastModifiedDate?moment(data.data.lastModifiedDate).format('YYYY-MM-DD HH:mm'):'';
                    this.setState({ statusLoading: false, status: status, filter: values });
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
                    this.setState({ [`${action}Loading`]: false});
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
        this.commonSubmit('/account/income/taxout/submit', params, 'submit', '提交成功');
    }
    revoke = () => {
        let params = { ...this.state.filter };
        this.commonSubmit('/account/income/taxout/revoke', params, 'revoke', '撤回提交成功');
    }
    filterChange = (values) => {
        values.authMonth = moment(values.authMonth).format('YYYY-MM');
        this.setState({ updateKey: Date.now(), filters: values });
        this.updateStatus(values);
    }
    render() {
        const { search } = this.props.location;
        let disabled = !!search;
        const getFields = (title, span, formItemStyle, record = {}) => [
            {
                label: '纳税主体',
                type: 'taxMain',
                span,
                fieldName: 'mainId',
                formItemStyle,
                componentProps: {
                    disabled,
                },
                fieldDecoratorOptions: {
                    initialValue: (disabled && getUrlParam('mainId')) || undefined,
                    rules: [{
                        required: true,
                        message: '请选择纳税主体'
                    }]
                }
            },
            {
                label: `${title}月份`,
                fieldName: 'authMonth',
                type: 'monthPicker',
                span,
                formItemStyle,
                componentProps: {
                    format: 'YYYY-MM',
                    disabled,
                },
                fieldDecoratorOptions: {
                    initialValue: (disabled && (!!search && moment(getUrlParam('authMonthStart'), 'YYYY-MM'))) || undefined,
                    rules: [{
                        required: true,
                        message: `请选择${title}月份`
                    }]
                }
            }
        ]

        let {filter,status} = this.state,
        buttonDisabled = !filter;
        return (
            <div>
            <CardSearch doNotSubmitDidMount={!search} feilds={getFields('查询', 8)} buttonSpan={8} filterChange={this.filterChange} />
            <Card title='其他业务进项税额转出台账' extra={(<div>
                {
                    status && (this.state.statusLoading?<Spin size="small" />:<div style={{ marginRight: 30, display: 'inline-block' }}>
                        <span style={{ marginRight: 20 }}>状态：<label style={{ color: 'red' }}>{status.text}</label></span>
                        <span>提交时间：{status.submitDate}</span>
                    </div>)
                }
                <Button size='small' style={{ marginRight: 5 }} disabled={buttonDisabled} onClick={this.submit} loading={this.state.submitLoading}>
                    <Icon type="check" />
                    提交
                </Button>
                <Button size='small' style={{ marginRight: 5 }} disabled={buttonDisabled} onClick={this.revoke} loading={this.state.revokeLoading}>
                    <Icon type="rollback" />
                    撤回提交
                </Button>
                <FileExport url={`/account/income/taxout/download`} title='下载模板' size='small' setButtonStyle={buttonStyle} />
                <FileImportModal
                    style={buttonStyle}
                    url="/account/income/taxout/upload"
                    title="导入"
                    fields={getFields('导入', 24, {
                        labelCol: {
                            span: 6
                        },
                        wrapperCol: {
                            span: 11
                        }
                    })}
                    onSuccess={() => {

                        this.setState({ updateKey: Date.now() })
                    }}
                />
            </div>)}
                style={{marginTop:10}} >
                <FetchTable
                    doNotFetchDidMount={true}
                    url='/account/income/taxout/list'
                    updateKey={this.state.updateKey}
                    tableProps={{
                        pagination: true,
                        columns: getColumns(this),
                        rowKey: 'id',
                        onDataChange:(data)=>{
                            let hasData =data && data.length>0;
                            this.setState({buttonDisabled:!hasData})  
                        },
                        renderCount:(data)=>{
                            if(data.page && data.page.records && data.page.records.length>0){
                                return [{mainName:'本页合计：',outTaxAmount:fMoney(data.pageOutTaxAmount),id:-1}];
                            }
                        }
                    }}
                    filters={this.state.filters} />
            </Card>
        </div>
        )
    }
}
export default withRouter(OtherBusinessInputTaxRollOut)