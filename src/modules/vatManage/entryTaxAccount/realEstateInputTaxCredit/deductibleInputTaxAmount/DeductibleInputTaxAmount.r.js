/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {message} from 'antd'
import { withRouter } from 'react-router'
import {SearchTable} from 'compoments'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,listMainResultStatus} from 'utils'
import ViewDocumentDetails from '../../../entryManag/otherDeductibleInputTaxDetails/viewDocumentDetailsPopModal'

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
class DeductibleInputTaxAmount extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherNum:undefined,
        searchFieldsValues:{

        },
        dataSource:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }
    fetchResultStatus = ()=>{
        request.get('/account/income/estate/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam: data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
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
        const {tableKey,visibleView,voucherNum,searchFieldsValues,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = searchFieldsValues;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = statusParam && parseInt(statusParam.status, 0) === 2;
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
                        pageSize:20,
                        columns:columns(this),
                        url:'/account/income/estate/stayDedList',
                        onSuccess:(params)=>{
                            this.setState({
                                searchFieldsValues:params,
                            },()=>{
                                this.fetchResultStatus()
                            })
                        },
                        cardProps: {
                            title: "待抵扣进项税额",
                            extra:<div>
                                {
                                    dataSource.length>0 && listMainResultStatus(statusParam)
                                }
                                <SubmitOrRecall disabled={disabled2} type={1} url="/account/income/estate/submit" onSuccess={this.refreshTable} />
                                <SubmitOrRecall disabled={!disabled1} type={2} url="/account/income/estate/revoke" onSuccess={this.refreshTable} />

                            </div>,
                        },
                        /*scroll:{
                         x:'180%'
                         },*/
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        },
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

export default withRouter(DeductibleInputTaxAmount)