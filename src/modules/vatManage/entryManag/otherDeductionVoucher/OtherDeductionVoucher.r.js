/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {requestResultStatus,fMoney,requestDict,listMainResultStatus,composeBotton,setFormat} from 'utils'
import {SearchTable} from 'compoments'
import ViewDocumentDetails from './viewDocumentDetailsPopModal'
import PopInvoiceInformationModal from 'modules/vatManage/entryTaxAccount/inputTaxDetails/popModal'

import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(context,disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'main',
            span:8,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },

        }, {
            label:'凭证月份',
            type:'monthPicker',
            formItemStyle,
            span:8,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择凭证月份'
                    }
                ]
            }
        }, {
            label:'标记类型',
            fieldName:'sysDictId',
            span:8,
            formItemStyle,
            type:'select',
            options:context.state.sysDictIdList.concat({value:'0', text:'无'})
        },{
            label:'凭证摘要',
            type:'input',
            fieldName:'voucherAbstract',
            span:8,
            formItemStyle,

        }
    ]
}
const markFieldsData = context => [
    {
        label: '标记类型',
        fieldName: 'sysDictId',
        type: 'select',
        notShowAll: true,
        span: '22',
        options: context.state.sysDictIdList.concat({value:'0', text:'无'}),
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择标记类型'
                }
            ]
        }
    }
]
const columns = context => {
    let lastStegesId = '';
    const {dataSource} = context.state;
    return [
        {
            title: '利润中心',
            dataIndex: 'mainNum',
            width:'200px',
            render:(text, row, index) => {
                let rowSpan = 0;
                if(lastStegesId !== row.stagesId){
                    lastStegesId = row.stagesId;
                    rowSpan = dataSource.filter(ele=>ele.stagesId === row.stagesId).length;
                }
                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan,
                    },
                };
            },
        },
        {
            title: '其他扣税凭证',
            dataIndex: 'mainName',
            width:'200px',
        },
        {
            title: '凭据数量',
            className:'text-center',
            dataIndex: 'sort',
            width:'100px',
            render:(text,record)=>{
                // if(parseInt(record.invoiceType, 0) !== 1 || parseInt(text, 0) === 0){
                //     return text
                // }
                // if(parseInt(record.invoiceType, 0) === 1 ){
                if(true){
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

        },
        {
            title: '金额',
            dataIndex: 'prepayAmount',
            className:'table-money',
            render: text=>fMoney(text)
        },
        {
            title: '税额',
            dataIndex: 'withOutAmount',
            className:'table-money',
            render: text=>fMoney(text)
        }
    ];
};
export default class OtherDeductionVoucher extends Component{
    state={

        tableKey:Date.now(),
        visible:false,
        voucherVisible:false,
        voucherInfo:{},
        filters:{},
        dataSource:[],
        selectedRowKeys:[],
        params: {},
        /**
         *修改状态和时间
         * */
        statusParam:{},
        //他可抵扣进项税明细标记: 取数据字典JXFPLX 无ID则无标记
        sysDictIdList:[],
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/income/financeDetails/controller/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
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

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now(),
            selectedRowKeys:[],
        })
    }

    componentDidMount(){
        //纳税申报
        requestDict('JXFPLX',result=>{
            this.setState({
                sysDictIdList : setFormat(result)
            })
        });
    }
    render(){
        const {visible,tableKey,filters,selectedRowKeys,voucherVisible,statusParam, params} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(this,disabled,declare),
                    cardProps:{
                        style:{borderTop:0}
                    }
                }}
                backCondition={(filters)=>{
                    this.setState({
                        filters,
                        selectedRowKeys:[],
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns(this),
                    url:'/account/prepaytax/prepayTaxList',
                    onRowSelect:(disabled && declare.decAction==='edit')?(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    }:undefined,
                    onDataChange:(dataSource)=>{
                        this.setState({
                            dataSource
                        })
                    },
                    cardProps: {
                        title: "其他扣税凭证",
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'income/financeDetails/controller/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1521007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/income/financeDetails/controller/upFlag",
                                        fields: markFieldsData(this),
                                        onSuccess: this.refreshTable,
                                        userPermissions:['1525000'],
                                    }
                                },{
                                    type:'submit',
                                    url:'/income/financeDetails/controller/submit',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1521010'],
                                },{
                                    type:'revoke',
                                    url:'/income/financeDetails/controller/revoke',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1521011'],
                                }],statusParam)
                            }
                        </div>,
                    },
                    scroll:{
                     // x:2400,
                     y:window.screen.availHeight-390-(disabled?50:0),
                     },
                }}
            >
                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    filters={{mainId:filters.mainId,authMonth:filters.authMonth}}
                    toggleModalVisible={this.toggleModalVisible}
                />
                <ViewDocumentDetails
                    title="凭证信息"
                    visible={voucherVisible}
                    params={params}
                    filters={{mainId:filters.mainId,authMonth:filters.authMonth}}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                />
            </SearchTable>
            </div>
        )
    }
}