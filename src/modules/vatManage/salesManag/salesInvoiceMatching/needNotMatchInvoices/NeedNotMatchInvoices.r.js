/**
 * Created by liurunbin on 2018/1/11.
 */
import React, { Component } from 'react'
import {fMoney,request} from '../../../../../utils'
import {SearchTable} from '../../../../../compoments'
import {Button,Icon,message,Modal} from 'antd'
import ManualMatchRoomModal from './addDataModal'
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    },
    {
        label:'开票时间',
        type:'rangePicker',
        fieldName:'billingDate',
        fieldDecoratorOptions:{},
        componentProps:{}
    },
    {
        label:'货物名称',
        type:'input',
        fieldName:'commodityName',
        fieldDecoratorOptions:{}
    },
    {
        label:'购货单位名称',
        type:'input',
        fieldName:'purchaseName',
        fieldDecoratorOptions:{}
    },
    {
        label:'发票号码',
        type:'input',
        fieldName:'invoiceNum',
        fieldDecoratorOptions:{}
    },
    {
        label:'税率',
        type:'input',
        fieldName:'taxRate',
    }
]
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum'
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票类型',
        dataIndex:'invoiceType',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },
    {
        title:'货物名称',
        dataIndex:'commodityName'
    },
    {
        title:'开票日期',
        dataIndex:'billingDate',
        width:'70px'
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'税率',
        dataIndex:'taxRate'
    },
    {
        title:'税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

export default class NeedNotMatchInvoices extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedRowKeys:[],

        searchTableLoading:false,
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    backOutData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要撤销选中的数据？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.put('/output/invoice/marry/unwanted/revoke',this.state.selectedRowKeys).then(({data})=>{
                    this.toggleSearchTableLoading(false)
                    if(data.code===200){
                        message.success('撤销成功！');
                        this.refreshTable();
                    }else{
                        message.error(`撤销失败:${data.msg}`)
                    }
                }).catch(err=>{
                    this.toggleSearchTableLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    render(){
        const {visible,tableKey,selectedRowKeys,searchTableLoading} = this.state;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                spinning={searchTableLoading}
                searchOption={{
                    fields:searchFields,
                    getFieldsValues:values=>{
                        this.setState({
                            searchFieldsValues:values
                        })
                    },
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    url:'/output/invoice/marry/unwanted/list',
                    extra:<div>
                        <Button size="small" style={{marginRight:5}} onClick={()=>this.toggleModalVisible(true)}><Icon type="plus-circle" />添加</Button>
                        <Button size="small" onClick={this.backOutData} disabled={selectedRowKeys.length === 0}><Icon type="minus-circle" />撤销</Button>
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                    本页金额：<span className="amount-code">{data.pageAmount}</span>
                                    本页税额：<span className="amount-code">{data.pageTaxAmount}</span>
                                    本页价税：<span className="amount-code">{data.pageTotalAmount}</span>
                                    本页总价：<span className="amount-code">{data.pageTotalPrice}</span>
                                </div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>总计：</span>
                                    总金额：<span className="amount-code">{data.allAmount}</span>
                                    总税额：<span className="amount-code">{data.allTaxAmount}</span>
                                    总价税：<span className="amount-code">{data.allTotalAmount}</span>
                                    全部总价：<span className="amount-code">{data.allTotalPrice}</span>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'180%'
                    },
                }}
            >
                <ManualMatchRoomModal title="添加信息" refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}