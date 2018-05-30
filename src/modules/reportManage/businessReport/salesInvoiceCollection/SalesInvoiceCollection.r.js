/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,getUrlParam} from 'utils'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = (disabled) => {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
            }
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
            },
        }
    ]
}
const columns=[
    {
        title: '纳税主体',
        dataIndex: 'mainName',
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
        )
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
        }
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
        )
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
        )
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
        )
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
        )
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
        )
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
        )
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'75px'
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
        }
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>text? `${text}%`: text,
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
        )
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '复核',
        dataIndex: 'checker'
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'60px',
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
        dataIndex: 'remark'
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {updateKey} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled)
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:20,
                    columns:columns,
                    cardProps:{
                        title:'销项发票采集'
                    },
                    url:'/output/invoice/collection/inter/list',
                    scroll:{ x: '120%' },
                }}
            />

        )
    }
}