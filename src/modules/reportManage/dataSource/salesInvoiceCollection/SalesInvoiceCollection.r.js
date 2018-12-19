/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import { composeBotton,fMoney } from 'utils'
import TableTitle from "compoments/tableTitleWithTime"
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
            span:6,
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: undefined,
                rules:[{
                    required:true,
                    message:'请选择纳税主体',
                }]
            }
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:6,
            componentProps:{
                format:'YYYY-MM',
            },
            fieldDecoratorOptions:{
                initialValue: undefined,
            },
        },
        {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
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
            label: "发票状态",
            fieldName: "status",
            span: 6,
            formItemStyle,
            type: "select",
            options: [
                {
                    text: "正常",
                    value: "1"
                },
                {
                    text: "作废",
                    value: "-1"
                },
                {
                    text: "红冲",
                    value: "2"
                }
            ]
        },
    ]
const status = [
    {
        text: "正常",
        value: "1"
    },
    {
        text: "作废",
        value: "-1"
    },
    {
        text: "红冲",
        value: "2"
    }
]
const apiFields = getFieldValue => [
    {
        label: "纳税主体",
        fieldName: "mainId",
        type: "taxMain",
        span: 20,
        fieldDecoratorOptions: {
            rules: [{
                required: true,
                message: "请选择纳税主体"
            }]
        }
    }
]
const columns=[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'100px',
    },
    {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'100px',
    },
    {
        title: '发票状态',
        dataIndex: "status",
        width:'150px',
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },
    {
        title: '发票类型',
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
    },
    {
        title: '项目名称',
        dataIndex: 'projectName',
        width:'150px',
    },
    {
        title: '项目编码',
        dataIndex: 'projectNum',
        width:'100px',
    },
    {
        title: '商品名称',
        dataIndex: 'commodityName',
        width:'100px',
    },
    {
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },{
        title: '购货单位名称',
        dataIndex: 'purchaseName',
        width:'150px',
    },
    {
        title: '购方税号',
        dataIndex: 'purchaseTaxNum',
        width:'100px',
    },{
        title: '开户行',
        dataIndex: 'bank',
        width:'150px',
    },
    {
        title: '地址',
        dataIndex: 'address',
        width:'100px',
    },{
        title: '账号',
        dataIndex: 'account',
        width:'100px',
    },
    {
        title: '电话',
        dataIndex: 'phone',
        width:'100px',
    },{
        title: '收款人',
        dataIndex: 'payee',
        width:'100px',
    },
    {
        title: '开票人',
        dataIndex: 'drawer',
        width:'100px',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'100px',
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            let res = "";
            switch (parseInt(text, 10)) {
                case 1:
                    res = "一般计税方法";
                    break;
                case 2:
                    res = "简易计税方法";
                    break;
                default:
            }
            return res;
        },
        width:'100px',
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>text? `${text}%`: text,
        className:'text-right',
        width:'100px',
    },{
        title: '应税项目名称',
        dataIndex: 'taxableProjectName',
        width:'100px',
    },
    {
        title: '应税项目编码',
        dataIndex: 'taxableProjectNum',
        width:'100px',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },{
        title: '复核',
        dataIndex: 'checker',
        width:'100px',
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'100px',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return text
        }
    },{
        title: '备注',
        dataIndex: 'remark',
    }
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
                        title:<TableTitle time={ totalSource && totalSource.extractTime }>喜盈佳-销项发票采集</TableTitle>
                    },
                    url:'/output/invoice/collection/report/list',
                    extra:<div>
                        {
                            composeBotton([{
                                type: "modal",
                                url: "/output/invoice/collection/report/sendApi",
                                title: "抽数",
                                icon: "usb",
                                fields: apiFields,
                                userPermissions: ['1905001'],
                            }])
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '发票金额', dataIndex: 'allAmount'},
                                        {title: '发票税额', dataIndex: 'allTaxAmount'},
                                        {title: '价税合计', dataIndex: 'allTotalAmount'},
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
                    scroll:{ x: 3500,y:window.screen.availHeight-360, },
                }}
            />
        )
    }
}