/**
 * Created by liurunbin on 2018/1/11.
 * 确认结转收入
 */
import React, { Component } from 'react'
import {Button,Icon} from 'antd'
import {SearchTable,FileExport} from '../../../../../compoments'
import {fMoney,getUrlParam} from '../../../../../utils'
import ManualMatchRoomModal from './SummarySheetModal'
import { withRouter } from 'react-router'
import moment from 'moment';

const searchFields =(disabled)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
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
class ConfirmCarryOver extends Component{
    state={
        tableKey:Date.now(),
        visible:false,
        doNotFetchDidMount:true,
        searchFieldsValues:{

        },
        hasData:false
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                doNotFetchDidMount:false
            })
        }else{
            this.setState({
                doNotFetchDidMount:true
            })
        }
    }
    render(){
        const {tableKey,visible,searchFieldsValues,hasData,doNotFetchDidMount} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={doNotFetchDidMount}
                searchOption={{
                    fields:searchFields(disabled),
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
                    url:'/account/output/notInvoiceSale/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0
                        })
                    },
                    extra:<div>
                        <Button size="small" style={{marginRight:5}} disabled={!searchFieldsValues.month} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />汇总表</Button>
                        <FileExport
                            url={`/account/output/notInvoiceSale/export`}
                            title="导出"
                            size="small"
                            disabled={!hasData}
                            params={
                                searchFieldsValues
                            }
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
export default withRouter(ConfirmCarryOver)