/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, {Component} from 'react';
import {requestResultStatus, fMoney, requestDict, listMainResultStatus, composeBotton, setFormat} from 'utils';
import {SearchTable} from 'compoments';
import PopInvoiceInformationModal from './popModal';
import ViewDocumentDetails from './viewDocumentDetailsPopModal';

import moment from 'moment';

const pointerStyle = {
    cursor: 'pointer',
    color: '#1890ff'
};
const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const searchFields = (context, disabled, declare) => (getFieldValue) => {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'main',
            span: 8,
            componentProps: {
                labelInValue: true,
                disabled
            },
            formItemStyle,
            fieldDecoratorOptions: {
                initialValue: (disabled && {key: declare.mainId, label: declare.mainName}) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税主体'
                    }
                ]
            }

        }, {
            label: '凭证月份',
            type: 'monthPicker',
            formItemStyle,
            span: 8,
            fieldName: 'authMonth',
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择凭证月份'
                    }
                ]
            }
        }, {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        }
    ];
};

const columns = context => {
    let lastStegesId = '';
    const {dataSource} = context.state;
    return [
        {
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width: '200px',
            render: (text, row, index) => {
                let rowSpan = 0;
                if (lastStegesId !== row.profitCenterId) {
                    lastStegesId = row.profitCenterId;
                    rowSpan = dataSource.filter(ele => ele.profitCenterId === row.profitCenterId).length;
                }
                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan
                    }
                };
            }
        },
        {
            title: '其他扣税凭证',
            dataIndex: 'voucherType'
        },
        {
            title: '凭据数量',
            className: 'text-center',
            dataIndex: 'voucherCount',
            width: '150px',
            render: (text, record) => {
                if (record.voucherType === '代扣代缴税收缴款凭证') {
                    //凭证
                    return <span title="查看凭证信息详情" onClick={() => {
                        context.setState({
                            paramsId: record.id
                        }, () => {
                            context.toggleViewModalVisible(true);
                        });
                    }} style={pointerStyle}>{text}</span>;
                } else if (record.voucherType) {
                    //发票
                    return <span title="查看发票信息详情" onClick={() => {
                        context.setState({
                            paramsId: record.id
                        }, () => {
                            context.toggleModalVisible(true);
                        });
                    }} style={pointerStyle}>{text}</span>;
                } else {
                    return text;
                }
            }

        },
        {
            title: '金额',
            dataIndex: 'amount',
            className: 'table-money',
            width: '150px',
            render: text => fMoney(text)
        },
        {
            title: '税额',
            dataIndex: 'taxAmount',
            width: '150px',
            className: 'table-money',
            render: text => fMoney(text)
        }
    ];
};

export default class OtherDeductionVoucher extends Component {
    state = {

        tableKey: Date.now(),
        visible: false,
        voucherVisible: false,
        voucherInfo: {},
        filters: {},
        dataSource: [],
        selectedRowKeys: [],
        paramsId: '', //点击的item id
        /**
         *修改状态和时间
         * */
        statusParam: {},
        //他可抵扣进项税明细标记: 取数据字典JXFPLX 无ID则无标记
        sysDictIdList: []
    };
    fetchResultStatus = () => {
        requestResultStatus('/other/tax/deduction/vouchers/listMain', this.state.filters, result => {
            this.setState({
                statusParam: result
            });
        });
    };

    toggleModalVisible = visible => {
        this.setState({
            visible
        });
    };
    toggleViewModalVisible = voucherVisible => {
        this.setState({
            voucherVisible
        });
    };

    refreshTable = () => {
        this.setState({
            tableKey: Date.now(),
            selectedRowKeys: []
        });
    };

    componentDidMount() {
        //纳税申报
        requestDict('JXFPLX', result => {
            this.setState({
                sysDictIdList: setFormat(result)
            });
        });
    }

    render() {
        const {visible, tableKey, filters, voucherVisible, statusParam, paramsId} = this.state;
        const {declare} = this.props;
        let disabled = !!declare;
        return (
            <div className='oneLine'>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields: searchFields(this, disabled, declare),
                        cardProps: {
                            style: {borderTop: 0}
                        }
                    }}
                    backCondition={(filters) => {
                        this.setState({
                            filters,
                            selectedRowKeys: []
                        }, () => {
                            this.fetchResultStatus();
                        });
                    }}
                    tableOption={{
                        key: tableKey,
                        pageSize: 100,
                        columns: columns(this),
                        url: '/other/tax/deduction/vouchers/list',
                        onDataChange: (dataSource) => {
                            this.setState({
                                dataSource
                            });
                        },
                        cardProps: {
                            title: "其他扣税凭证",
                            extra: <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters) !== '{}' && composeBotton([{
                                        type: 'fileExport',
                                        url: '/other/tax/deduction/vouchers/export',
                                        params: filters,
                                        title: '导出',
                                        userPermissions: ['1521007']
                                    }], statusParam)
                                }
                                {
                                    (disabled && declare.decAction === 'edit') && composeBotton([{

                                        type:'reset',
                                        url:'/other/tax/deduction/vouchers/reset',
                                        params:filters,
                                        userPermissions:['1525000'],
                                        onSuccess:this.refreshTable,

                                    }, {
                                        type: 'submit',
                                        url: '/other/tax/deduction/vouchers/submit',
                                        params: filters,
                                        onSuccess: this.refreshTable,
                                        userPermissions: ['1521010']
                                    }, {
                                        type: 'revoke',
                                        url: '/other/tax/deduction/vouchers/revoke',
                                        params: filters,
                                        onSuccess: this.refreshTable,
                                        userPermissions: ['1521011']
                                    }], statusParam)
                                }
                            </div>
                        },
                        scroll: {
                            // x:2400,
                            y: window.screen.availHeight - 390 - (disabled ? 50 : 0)
                        }
                    }}
                >
                    <PopInvoiceInformationModal
                        title="发票信息"
                        visible={visible}
                        id={paramsId}
                        toggleModalVisible={this.toggleModalVisible}
                    />
                    <ViewDocumentDetails
                        title="凭证信息"
                        visible={voucherVisible}
                        id={paramsId}
                        toggleViewModalVisible={this.toggleViewModalVisible}
                    />
                </SearchTable>
            </div>
        );
    }
}