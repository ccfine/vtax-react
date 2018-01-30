/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import { Icon, Divider, Card } from 'antd'
import { FileImportModal, FileExport, CardSearch, FetchTable } from '../../../../compoments'
import FeildModal from './popModal'
import { request, fMoney } from '../../../../utils'
import moment from 'moment'
const buttonStyle = {
    marginLeft: 5
}

const getFields = (title, span, formItemStyle, record = {}) => [
    {
        label: '纳税主体',
        type: 'taxMain',
        span,
        fieldName: 'mainId',
        formItemStyle,
        fieldDecoratorOptions: {
            initialValue: record.mainId,
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
            format: 'YYYY-MM'
        },
        fieldDecoratorOptions: {
            initialValue: moment(record.authMonth),
            rules: [{
                required: true,
                message: `请选择${title}月份`
            }]
        }
    }
]
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

export default class LandPriceManage extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        filters: undefined,
        status: undefined,
        statusParam: undefined
    }
    hideModal() {
        this.setState({ visible: false });
    }
    updateStatus = (values = this.state.statusParam) => {
        request.get('/account/income/taxout/listMain', { params: values }).then(({ data }) => {
            if (data.code === 200) {
                let status = {};
                if (data.data) {
                    if (data.data.status === 1) {
                        status.text = '暂存'
                    } else if (data.data.status === 2) {
                        status.text = (<span style={{ color: 'green' }}>提交</span>)
                    }
                    status.submitDate = data.data.lastModifiedDate
                    this.setState({ status: status, statusParam: values });
                }else{
                    this.setState({ status: undefined, statusParam: undefined });
                }
            }
        })
    }
    filterChange = (values) => {
        values.authMonth = moment(values.authMonth).format('YYYY-MM');
        this.setState({ updateKey: Date.now(), filters: values });
        this.updateStatus(values);
    }
    render() {
        return (<div>
            <CardSearch feilds={getFields('查询', 8)} buttonSpan={8} filterChange={this.filterChange} />
            <Card title='其他业务进项税额转出台账' extra={(<div>
                {this.state.status &&
                    <span>
                        <span style={buttonStyle}>
                            <label>状态：</label>
                            <span>{this.state.status.text}</span>
                        </span>
                        <Divider type="vertical" />
                        <span style={buttonStyle}>
                            <label>提交时间：</label>
                            <span>{this.state.status.submitDate}</span>
                        </span>
                    </span>
                }
                <FeildModal
                    style={buttonStyle}
                    title='提交'
                    buttonIcon={<Icon type="check" />}
                    url='/account/income/taxout/submit'
                    feilds={getFields('提交', 24, {
                        labelCol: {
                            span: 6
                        },
                        wrapperCol: {
                            span: 11
                        }
                    }, this.state.statusParam)}
                    onSuccess={this.updateStatus}
                ></FeildModal>
                <FeildModal
                    style={buttonStyle}
                    title='撤回提交'
                    buttonIcon={<Icon type="rollback" />}
                    url='/account/income/taxout/revoke'
                    feilds={getFields('撤回', 24, {
                        labelCol: {
                            span: 6
                        },
                        wrapperCol: {
                            span: 11
                        }
                    }, this.state.statusParam)}
                    onSuccess={this.updateStatus}
                ></FeildModal>
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
            </div>)}>
                <FetchTable
                    doNotFetchDidMount={true}
                    url='/account/income/taxout/list'
                    updateKey={this.state.updateKey}
                    tableProps={{
                        pagination: true,
                        columns: getColumns(this),
                        rowKey: 'id'
                    }}
                    filters={this.state.filters} />
            </Card>
        </div>
        )
    }
}