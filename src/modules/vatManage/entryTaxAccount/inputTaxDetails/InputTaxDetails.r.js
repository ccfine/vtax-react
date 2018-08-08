/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import PopInvoiceInformationModal from './popModal'
import VoucherPopModal from './voucherPopModal'
import AddPopModal from './addPopModal'
import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const searchFields =(disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
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
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
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
const getColumns = (context,hasOperate) => {
    let operates = hasOperate?[{
        title:'操作',
        render:(text, record)=>(
            (record.voucherType === '前期认证相符且本期申报抵扣' || record.voucherType === '前期入账本期申报抵扣')
            &&  composeBotton([{
                type:'action',
                title:'编辑',
                icon:'edit',
                userPermissions:['1381004'],
                onSuccess:()=>context.setState({
                    addVisible:true,
                    action:'edit',
                    record:record
                })
            }])
        ),
        fixed:'left',
        width:'50px',
        dataIndex:'action',
        className:'text-center',
    }]:[];
    return [
        ...operates
    ,{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '抵扣凭据类型',
        dataIndex: 'voucherType',
    },{
        title: '凭据份数',
        dataIndex: 'num',
        render:(text,record)=>{
            if(record.voucherType === '前期认证相符且本期申报抵扣' || record.voucherType === '前期入账本期申报抵扣'){
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
}

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
    render(){
        const {searchTableLoading,tableKey,visible,voucherVisible,addVisible,params,statusParam={},filters,totalSource,record,action} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            notSubmit = parseInt(statusParam.status,10)===1;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        className:'',
                        style:{
                            borderTop:0,
                        },
                    },
                }}
                doNotFetchDidMount={!disabled}
                spinning={searchTableLoading}
                backCondition={(filters)=>{
                    this.setState({
                        filters,
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    cardProps: {
                        title: "进项税额明细台账",
                    },
                    pagination:false,
                    columns:getColumns(this,disabled && declare.decAction==='edit' && notSubmit),
                    url:'/account/income/taxDetail/taxDetailList',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'account/income/taxDetail/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1381007'],
                            }],statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'add',
                                icon:'plus',
                                userPermissions:['1381003'],
                                onClick:()=>{
                                    this.setState({
                                        addVisible:true,
                                        action:'add',
                                        record:filters,
                                    })
                                }
                            },{
                                type:'submit',
                                url:'/account/income/taxDetail/submit',
                                params:filters,
                                userPermissions:['1381010'],
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/income/taxDetail/revoke',
                                params:filters,
                                userPermissions:['1381011'],
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '金额', dataIndex: 'allAmount'},
                                        {title: '税额', dataIndex: 'allTaxAmount'},
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
                    filters={{mainId:filters.mainId,authMonth:filters.authMonth}}
                    toggleModalVisible={this.toggleModalVisible}
                />
                <VoucherPopModal
                    title="凭证信息"
                    visible={voucherVisible}
                    params={params}
                    filters={{mainId:filters.mainId,authMonth:filters.authMonth}}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                />
            </SearchTable>
        )
    }
}

export default InputTaxDetails;
