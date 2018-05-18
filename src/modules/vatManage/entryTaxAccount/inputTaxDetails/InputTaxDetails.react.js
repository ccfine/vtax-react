/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {message} from 'antd'
import { withRouter } from 'react-router'
import {SearchTable,TableTotal} from 'compoments'
import {request,fMoney,getUrlParam,listMainResultStatus} from 'utils'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
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
        render:(text,record)=>(
            <span>
                {
                    record.invoiceType
                        ?
                        <span title="查看发票信息详情" onClick={()=>{
                                const params= {
                                    mainId:record.mainId,
                                    invoiceType:record.sysDictId,
                                }
                                context.setState({
                                    params:params
                                },()=>{
                                    context.toggleModalVisible(true)
                                })
                            }} style={pointerStyle}>
                                {text}
                        </span>
                        :
                        <span title="查看凭证信息详情" onClick={()=>{
                                const params= {
                                    mainId:record.mainId,
                                    flag :record.flag,
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
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),

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
        request.get('/account/income/taxDetail/listMain',{
            params:this.state.filters
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey,visible,voucherVisible,params,statusParam,filters,totalSource} = this.state;
        const disabled1 = statusParam && parseInt(statusParam.status, 0) === 2;
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
                            JSON.stringify(filters) !== "{}" && <span>
                                <SubmitOrRecall disabled={disabled1} type={1} url="/account/income/taxDetail/submit" monthFieldName='authMonth' onSuccess={this.refreshTable} />
                                <SubmitOrRecall disabled={!disabled1} type={2} url="/account/income/taxDetail/revoke" monthFieldName='authMonth' onSuccess={this.refreshTable} />
                            </span>
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
                    /*scroll:{
                     x:'1400px',
                     },*/
                }}
            >
                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    params={params}
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
