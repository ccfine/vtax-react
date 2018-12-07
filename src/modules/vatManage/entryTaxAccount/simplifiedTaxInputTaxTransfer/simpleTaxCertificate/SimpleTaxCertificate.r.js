/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton} from 'utils'
import ViewDocumentDetails from 'compoments/viewDocumentDetails'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'150px',
    },
    {
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'100px',
    },
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'150px',
    },
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    /*{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'6%',

    },*/
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherInfo:{
                        voucherId:record.voucherId,
                        mainId:record.mainId,
                    }
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        ),
        sorter: true,
        width:'100px',
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:'300px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'200px',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    }
];
class SimpleTaxCertificate extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherInfo:{},
        filters:{},
        totalSource:undefined,
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
        const {tableKey,visibleView,voucherInfo,filters,totalSource} = this.state;
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
                    pageSize:100,
                    columns:columns(this),
                    url:'/account/incomeSimpleOut/controller/simpleTaxList',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        })
                    },
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">简易计税进项税额转出台账 / </label>简易计税列表</span>,
                        extra:<div>
                                {
                                    JSON.stringify(filters) !=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'account/incomeSimpleOut/controller/simple/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1391007'],
                                    }])
                                }
                                <TableTotal type={3} totalSource={totalSource} data={
                                    [
                                        {
                                            title:'合计',
                                            total:[
                                                {title: '借方金额', dataIndex: 'debitAmount'},
                                            ],
                                        }
                                    ]
                                } />
                            </div>
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:1300,
                        y:window.screen.availHeight-400-(disabled?50:0),
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visibleView}
                    filters={voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}

export default SimpleTaxCertificate;