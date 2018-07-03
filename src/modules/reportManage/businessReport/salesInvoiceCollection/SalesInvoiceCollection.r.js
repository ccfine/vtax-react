/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney} from 'utils'
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = [
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
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
            },
            fieldDecoratorOptions:{
                initialValue: undefined,
            },
        }
    ]
const columns=[
    {
        title: '纳税主体',
        dataIndex: 'mainName',
        width:'10%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票号码</p>
            <p className="apply-form-list-p2">发票代码</p>
        </div>,
        dataIndex: 'invoiceNum',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        ),
        width:'6%',
    },{
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
        width:60,
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">项目名称</p>
            <p className="apply-form-list-p2">项目编码 </p>
        </div>,
        dataIndex: 'projectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.projectNum}</p>
            </div>
        ),
        width:'8%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">商品名称</p>
            <p className="apply-form-list-p2">金额</p>
        </div>,
        dataIndex: 'commodityName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{fMoney(record.amount)}</p>
            </div>
        ),
        width:'6%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">购货单位名称</p>
            <p className="apply-form-list-p2">购方税号</p>
        </div>,
        dataIndex: 'purchaseName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.purchaseTaxNum}</p>
            </div>
        ),
        width:'8%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">开户行</p>
            <p className="apply-form-list-p2">地址</p>
        </div>,
        dataIndex: 'bank',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.address}</p>
            </div>
        ),
        width:'8%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">账号</p>
            <p className="apply-form-list-p2">电话</p>
        </div>,
        dataIndex: 'account',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.phone}</p>
            </div>
        ),
        width:'6%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">收款人</p>
            <p className="apply-form-list-p2">开票人</p>
        </div>,
        dataIndex: 'payee',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.drawer}</p>
            </div>
        ),
        width:'4%',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:75,
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            text = parseInt(text,0);
            if(text===1){
                return '一般计税方法'
            }
            if(text ===2){
                return '简易计税方法'
            }
            return text;
        },
        width:80,
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'5%',
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>text? `${text}%`: text,
        width:40,
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">应税项目名称</p>
            <p className="apply-form-list-p2">应税项目编码</p>
        </div>,
        dataIndex: 'taxableProjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.taxableProjectNum}</p>
            </div>
        ),
        width:'6%',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'6%',
    },{
        title: '复核',
        dataIndex: 'checker',
        width:40,
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        width:60,
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
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    render(){
        const {updateKey} = this.state;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:10,
                    columns:columns,
                    cardProps:{
                        title:'销项发票采集'
                    },
                    url:'/output/invoice/collection/report/list',
                    scroll:{ x: 1800,y:window.screen.availHeight-360, },
                }}
            />

        )
    }
}