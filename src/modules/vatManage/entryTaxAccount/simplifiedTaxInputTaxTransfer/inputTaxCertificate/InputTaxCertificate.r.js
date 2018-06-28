/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
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
        width:'12%',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'8%',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'12%',
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:75,
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'6%',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherInfo:{
                        voucherNum:text,
                        mainId:record.mainId,
                        voucherDate:record.voucherDate,
                        stagesId:record.stagesId,
                    }
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        ),
        width:'5%',
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'5%',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'16%',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'5%',
    }
];
class InputTaxCertificate extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherInfo:{},
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
        const {tableKey,visibleView,voucherInfo} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
                <SearchTable
                    style={{
                        marginTop:-16
                    }}
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:this.props.searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    tableOption={{
                        key:tableKey,
                        pageSize:10,
                        columns:columns(this),
                        url:'/account/incomeSimpleOut/controller/incomeTaxList',
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">简易计税进项税额转出台账 / </label>进项税额列表</span>,
                        },
                        scroll:{
                            x:1600,
                            y:230,
                        },
                    }}
                >
                    <ViewDocumentDetails
                        title="查看凭证详情"
                        visible={visibleView}
                        {...voucherInfo}
                        toggleViewModalVisible={this.toggleViewModalVisible} />
                </SearchTable>
        )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
  }))(InputTaxCertificate);