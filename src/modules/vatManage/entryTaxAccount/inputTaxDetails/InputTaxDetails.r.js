/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {Icon,Tooltip} from 'antd'
import {SearchTable,TableTotal} from 'compoments'
import {requestResultStatus,fMoney,getUrlParam,listMainResultStatus,composeBotton} from 'utils'
import PopInvoiceInformationModal from './popModal'
import VoucherPopModal from './voucherPopModal'
import AddPopModal from './addPopModal'
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
        title:'操作',
        render:(text, record)=>(
            record.voucherType === '前期认证相符且本期申报抵扣' &&  <span onClick={()=>{
                    context.setState({
                        addVisible:true,
                        action:'edit',
                        record:record
                    })
                }} style={pointerStyle}>
                    <Tooltip placement="top" title="编辑">
                           <Icon type="edit" />
                    </Tooltip>
                </span>
        ),
        fixed:'left',
        width:'50px',
        dataIndex:'action',
        className:'text-center',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '抵扣凭据类型',
        dataIndex: 'voucherType',
    },{
        title: '凭据份数',
        dataIndex: 'num',
        render:(text,record)=>{
            if(record.voucherType === '前期认证相符且本期申报抵扣'){
                return text
            }
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
        addVisible:false,
        isAdd:false,
        params:{},
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalAddVisible=addVisible=>{
        this.setState({
            addVisible
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
    formatData=data=>{
        return data.filter(d=>d.voucherType === '前期认证相符且本期申报抵扣')
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey,visible,voucherVisible,addVisible,params,statusParam,filters,totalSource,record,action,isAdd} = this.state;
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
                    onSuccess:(params,data)=>{
                        this.setState({
                            filters:params,
                            isAdd:this.formatData(data).length>0
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
                            JSON.stringify(filters) !== "{}" && !isAdd &&  composeBotton([{
                                type:'add',
                                onClick:()=>{
                                    this.setState({
                                        addVisible:true,
                                        action:'add',
                                        record:filters,
                                    })
                                }
                            }],statusParam)
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

                <AddPopModal
                    title="新增"
                    visible={addVisible}
                    record={record}
                    action={action}
                    refreshTable={this.refreshTable}
                    toggleModalAddVisible={this.toggleModalAddVisible}
                />
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