/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherNum:text,
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        )
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money"
    }
];
export default class DeductibleInputTaxAmount extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherNum:undefined,
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }

    render(){
        const {tableKey,visibleView,voucherNum} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
                <SearchTable
                    style={{
                        marginTop:-16
                    }}
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    tableOption={{
                        key:tableKey,
                        pageSize:20,
                        columns:columns(this),
                        url:'/account/income/estate/stayDedList',
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>待抵扣进项税额</span>,
                        },
                        /*scroll:{
                         x:'180%'
                         },*/
                    }}
                >
                    <ViewDocumentDetails
                        title="查看凭证详情"
                        visible={visibleView}
                        voucherNum={voucherNum}
                        toggleViewModalVisible={this.toggleViewModalVisible} />
                </SearchTable>
        )
    }
}