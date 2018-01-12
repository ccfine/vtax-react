/**
 * Created by liurunbin on 2018/1/11.
 */
import React, { Component } from 'react'
import {fMoney} from '../../../../../utils'
import {SearchTable,FileExport} from '../../../../../compoments'
import ManualMatchRoomModal from './manualMatchRoomModal.r'
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
const getColumns = context =>[
    {
        title: '操作',
        key: 'actions',
        fixed:true,
        width:'60px',
        render: (text, record) => (
            <span style={{
                color:'#1890ff',
                cursor:'pointer'
            }} onClick={()=>{
                context.setState({
                    visible:true,
                    selectedData:record
                })
            }}>
                手工匹配
            </span>
        )
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
        dataIndex:'taxAmount'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount'
    },
    {
        title:'规格型号',
        dataIndex:'specificationModel'
    },
    {
        title:'匹配时间',
        dataIndex:'marryTime'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别码',
        dataIndex:'taxIdentificationCode'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName'
    },
    {
        title:'单元',
        dataIndex:'element'
    },
    {
        title:'房号',
        dataIndex:'roomNumber'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode'
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice'
    },
    {
        title:'匹配方式',
        dataIndex:'matchingWay',
        render:text=>{
            text = parseInt(text,0);//0:手动匹配,1:自动匹配
            if(text === 0){
                return '手动匹配';
            }else if(text ===1){
                return '自动匹配';
            }else{
                return ''
            }
        }
    },
];

const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class UnmatchedData extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedData:{}
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
    render(){
        const {visible,tableKey,searchFieldsValues,selectedData} = this.state;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
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
                    columns:getColumns(this),
                    url:'/output/invoice/marry/unmatched/list',
                    extra:<div>
                        <FileExport
                            url={`/output/invoice/marry/unmatched/export?${parseJsonToParams(searchFieldsValues)}`}
                            title="导出未匹配发票"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
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
                    }
                }}
            >
                <ManualMatchRoomModal title="手工匹配房间" selectedData={selectedData} refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}