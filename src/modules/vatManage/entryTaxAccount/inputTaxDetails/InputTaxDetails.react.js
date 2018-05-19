/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {SearchTable,TableTotal} from 'compoments'
import {requestResultStatus,fMoney,getUrlParam,listMainResultStatus,composeBotton} from 'utils'
import PopInvoiceInformationModal from './popModal'
import VoucherPopModal from './voucherPopModal'
import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const searchFields =(disabled)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'认证月份',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择认证月份'
                    }
                ]
            },
        },
    ]
}
const getColumns = context => [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '抵扣凭据类型',
        dataIndex: 'voucherType',
    },{
        title: '凭据份数',
        dataIndex: 'num',
        render:(text,record)=>{
            if(parseInt(text,0) > 0 ){
                return (
                    <span>
                        {
                            record.invoiceType
                                ?
                                <span title="查看发票信息详情" onClick={()=>{
                                    context.toggleModalVisible(true)
                                }} style={pointerStyle}>
                                    {text}
                                </span>
                                :
                                <span title="查看凭证信息详情" onClick={()=>{
                                    const params= {
                                        sysDictId:record.sysDictId,
                                    }
                                    context.setState({
                                        params:params
                                    },()=>{
                                        context.toggleModalVoucherVisible(true)
                                    })
                                }} style={pointerStyle}>
                                    {text}
                                </span>
                        }
                    </span>
                )
            }else{
                return text
            }
        }

    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className: "table-money"

    }
];

class InputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
        visible:false,
        voucherVisible:false,
        params:{},
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    toggleModalVoucherVisible=voucherVisible=>{
        this.setState({
            voucherVisible
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/taxDetail/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey,visible,voucherVisible,params,statusParam,filters,totalSource} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    cardProps: {
                        title: "进项税额明细台账",
                    },
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/account/income/taxDetail/taxDetailList',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                type:'submit',
                                url:'/account/income/taxDetail/submit',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/income/taxDetail/revoke',
                                params:filters,
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '金额', dataIndex: 'pageAmount'},
                                        {title: '税额', dataIndex: 'pageTaxAmount'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                }}
            >
                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    filters={filters}
                    toggleModalVisible={this.toggleModalVisible}
                />
                <VoucherPopModal
                    title="凭证信息"
                    visible={voucherVisible}
                    params={params}
                    filters={filters}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                />
            </SearchTable>
        )
    }
}
export default withRouter(InputTaxDetails)
