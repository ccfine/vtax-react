/*
 * @Author: zhouzhe 
 * @Date: 2018-10-26 16:40:18 
 * @Description: '不动产进项税额抵扣表' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-26 17:45:52
 */

import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney} from 'utils'
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = getFieldValue => [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: undefined,
                rules:[{
                    required:true,
                    message:'请选择纳税主体',
                }]
            }
        },
        {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:getFieldValue('mainId') || false,
                url:`/taxsubject/profitCenterList/${getFieldValue('mainId')}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:8,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
            }
        },
        {
            label:'入账期间',
            fieldName:'authMonth2',
            type:'rangePicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM-DD',
            },
            fieldDecoratorOptions:{
                initialValue: undefined,
            },
        },
        {
            label:'待抵扣期间',
            fieldName:'authMonth3',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
            },
            fieldDecoratorOptions:{
                initialValue: undefined,
            },
        },
    ]

const columns=[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },{
        title: '项目分期名称',
        dataIndex: 'invoiceNum',
        width:'100px',
    },{
        title: '产品编码',
        dataIndex: 'invoiceCode',
        width:'100px',
    },{
        title: '产品名称',
        dataIndex: 'invoiceType',
        render: (text,record) => {
            let invoiceTypeText ='';
            if(text==='s'){
                invoiceTypeText = '专票'
            }
            if(text==='c'){
                invoiceTypeText = '普票'
            }
            return invoiceTypeText;
        },
        width:'100px',
    },{
        title: '入账日期',
        dataIndex: 'projectName',
        width:'150px',
    },{
        title: '税额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },{
        title: "期初待抵扣进项税额",
        dataIndex: "initialTaxAmount",
        width:'100px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "当期抵扣进项税额",
        dataIndex: "taxAmount",
        width:'150px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "期末待抵扣进项税额",
        dataIndex: "deductedTaxAmount",
        width:'100px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod",
        width:'100px',
    },
];

export default class SalesInvoiceCollection extends Component{
    state={
        updateKey:Date.now(),
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    render(){
        const {updateKey,totalSource} = this.state;
        return(
            <div className="oneLine">
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    cardProps:{
                        title:'不动产进项税额抵扣表'
                    },
                    url:'/output/invoice/collection/report/list',
                    extra:<div>
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '期末待抵扣进项税额', dataIndex: 'allAmount'},
                                        {title: '当期抵扣进项税额', dataIndex: 'allTaxAmount'},
                                        {title: '期初待抵扣进项税额', dataIndex: 'allTotalAmount'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{ x: 2800,y:window.screen.availHeight-360, },
                }}
            />
            </div>
        )
    }
}