/**
 * Created by liurunbin on 2018/1/11.
 * 确认结转收入
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
                dataIndex:'endNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
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
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class ConfirmCarryOver extends Component{
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
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields,
                    getFieldsValues:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                month:undefined,
                                projectId:undefined,
                                stagesId:undefined
                            })
                        }else{
                            if(values.month){
                                values.month = values.month.format('YYYY-MM')
                            }
                            this.setState(prevState=>({
                                searchFieldsValues:{
                                    ...prevState.searchFieldsValues,
                                    ...values
                                }
                            }))
                        }
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
                        <Button size="small" style={{marginRight:5}} disabled={!searchFieldsValues.month} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />汇总表</Button>
                        <FileExport
                            url={`/account/output/notInvoiceSale/export?${parseJsonToParams(searchFieldsValues)}`}
                            title="导出"
                            size="small"
                            disabled={!searchFieldsValues.month}
                            setButtonStyle={{marginRight:5}}
                        />
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <div>
                                        <div style={{width:100,display:'inline-block',textAlign: 'right',paddingRight:20}}>本页合计：</div>
                                        <div style={{display:'inline-block'}}>
                                            上期-增值税开票金额：<span className="amount-code">{fMoney(data.pageSumTotalAmount)}</span>
                                            上期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageSumTotalPrice)}</span>
                                            上期末合计金额-未开具发票销售额：<span className="amount-code">{fMoney(data.pageSumNoInvoiceSales)}</span>
                                        </div>
                                    </div>
                                    <p style={{paddingLeft:100,marginTop:5,marginBottom:0}}>
                                        本期-增值税开票金额：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                        本期-未开具发票销售额 ：<span className="amount-code">{fMoney(data.pageNoInvoiceSales)}</span>
                                        本期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageTotalPrice)}</span>
                                    </p>
                                    <p style={{paddingLeft:100,marginTop:5}}>
                                        本期末合计-未开具发票销售额 ：<span className="amount-code">{fMoney(data.pageEndNoInvoiceSales)}</span>
                                        本期末合计-增值税开票金额 ：<span className="amount-code">{fMoney(data.pageEndTotalAmount)}</span>
                                        本期末合计-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageEndTotalPrice)}</span>
                                    </p>
                                </div>
                                <div style={{marginBottom:10}}>
                                    <div>
                                        <div style={{width:100,display:'inline-block',textAlign: 'right',paddingRight:20}}>总计：</div>
                                        <div style={{display:'inline-block'}}>
                                            上期-增值税开票金额：<span className="amount-code">{fMoney(data.allSumTotalAmount)}</span>
                                            上期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allSumTotalPrice)}</span>
                                            上期末合计金额-未开具发票销售额：<span className="amount-code">{fMoney(data.allSumNoInvoiceSales)}</span>
                                        </div>
                                    </div>
                                    <p style={{paddingLeft:100,marginTop:5,marginBottom:0}}>
                                        本期-增值税开票金额：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                        本期-未开具发票销售额 ：<span className="amount-code">{fMoney(data.allNoInvoiceSales)}</span>
                                        本期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allTotalPrice)}</span>
                                    </p>
                                    <p style={{paddingLeft:100,marginTop:5}}>
                                        本期末合计-未开具发票销售额 ：<span className="amount-code">{fMoney(data.allEndNoInvoiceSales)}</span>
                                        本期末合计-增值税开票金额 ：<span className="amount-code">{fMoney(data.allEndTotalAmount)}</span>
                                        本期末合计-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allEndTotalPrice)}</span>
                                    </p>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'200%'
                    },
                }}
            >
                <ManualMatchRoomModal title="添加信息" month={searchFieldsValues.month} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}