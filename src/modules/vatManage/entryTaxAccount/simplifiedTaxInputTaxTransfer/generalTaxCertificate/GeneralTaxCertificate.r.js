/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import {SearchTable} from 'compoments'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const markFieldsData = [
    {
        label:'简易计税标记',
        fieldName:'commonlyFlag',
        type:'select',
        notShowAll:true,
        span:'22',
        options:[  //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
            {
                text:'标记',
                value:'1'
            },{
                text:'不标记',
                value:'0'
            }
        ],
    }
]
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
    },{
        title: '简易计税',
        dataIndex: 'commonlyFlag',
        sorter: true,
        render: text => {
            //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
            let res = "";
            switch (parseInt(text, 0)) {
                case 1:
                    res = "标记";
                    break;
                case 0:
                    res = ""; //不标记
                    break;
                default:
            }
            return res;
        }
    }
];
class GeneralTaxCertificate extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        voucherNum:undefined,
        filters:{},
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    toggleViewModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/incomeSimpleOut/controller/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {visible,voucherNum,tableKey,filters,selectedRowKeys,statusParam} = this.state;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={true}
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
                    url:'/account/incomeSimpleOut/controller/commonlyTaxList',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                            selectedRowKeys:[],
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    cardProps: {
                        title: "一般计税列表",
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/account/incomeSimpleOut/controller/commonlyFlag",
                                        fields: markFieldsData,
                                        onSuccess: this.refreshTable,
                                    }
                                },{
                                    type:'submit',
                                    url:'/account/incomeSimpleOut/controller/submit',
                                    params:filters,
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/account/incomeSimpleOut/controller/revoke',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                        </div>,
                    },
                    /*scroll:{
                     x:'180%'
                     },*/
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    voucherNum={voucherNum}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(GeneralTaxCertificate)