/**
 * Created by liurunbin on 2018/1/11.
 */
import React, { Component } from 'react'
import {fMoney,} from '../../../../../utils'
import {SearchTable,FileExport} from '../../../../../compoments'
import {Button,Icon} from 'antd'
import ManualMatchRoomModal from './SummarySheetModal'
const searchFields = (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            fieldDecoratorOptions:{

            },
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'查询期间',
            fieldName:'month',
            type:'monthPicker',
            span:6,
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
            componentProps:{
                format:'YYYY-MM'
            }
        }
    ]
}
const columns = [
    {
        title:'房间交易档案',
        children:[
            {
                title:'分期',
                dataIndex:'itemName'
            },
            {
                title:'楼栋',
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
                title:'税率',
                dataIndex:'taxRate',
            },
            {
                title:'交易日期',
                dataIndex:'1'
            },
        ]
    },
    {
        title:'上期末合计金额',
        children:[
            {
                title:'增值税收入确认金额',
                dataIndex:'sumTotalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'sumTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售金额',
                dataIndex:'sumNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
        ]
    },
    {
        title:'本期发生额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'endTotalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'endTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'totalAm231ount',
                render:text=>fMoney(text),
                className:'endNoInvoiceSales'
            },
        ]
    },
    {
        title:'本期末合计金额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'totalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'totalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'noInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'totalNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            }
        ]
    }
];
export default class NeedNotMatchingPage extends Component{
    state={
        visible:false,
        searchFieldsValues:{

        },
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    render(){
        const {visible,searchFieldsValues} = this.state;
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
                    pageSize:10,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/list',
                    extra:<div>
                        <Button size="small" style={{marginRight:5}} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />汇总表</Button>
                        <FileExport
                            url={`/account/output/notInvoiceSale/export?month=${searchFieldsValues.yearMonth}`}
                            title="导出"
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
                        x:'200%'
                    },
                }}
            >
                <ManualMatchRoomModal title="添加信息"  visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}