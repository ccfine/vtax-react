/**
 * Created by liuliyuan on 2018/5/13.
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
const searchFields = [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            fieldDecoratorOptions:{
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
        }
    ]
const columns = [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
        width:'150px',
    },{
        title: '纳税人识别号',
        dataIndex: 'sellerTaxNum',
        width:'100px',
    },{
        title: '项目名称',
        dataIndex: 'projectName',
        width:'150px',
    },{
        title: '项目编码',
        dataIndex: 'projectNum',
        width:'100px',
    },{
        title: '是否需要认证',
        dataIndex: 'authFlag',
        render:(text,record)=>{
            let txt = '';
            switch (text) {
                case "1":
                    txt = "需要";
                    break;
                case "0":
                    txt = "不需要";
                    break;
                default:
                    txt = text;
                    break;
            }
            return txt;
        },
        width:'100px',
    },{
        title: '认证标记',
        dataIndex: 'authStatus',
        render:(text,record)=>{
            //认证标记:认证结果1:认证成功;2:认证失败;0:无需认证';
            let res2 = "";
            switch (parseInt(text, 0)) {
                case 1:
                    res2 = "认证成功";
                    break;
                case 2:
                    res2 = "认证失败";
                    break;
                case 0:
                    res2 = "无需认证";
                    break;
                default:
            }
            return res2;
        },
        width:'100px',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'100px',
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'100px',
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
        width:'100px',
    },{
        title: '发票明细号',
        dataIndex: 'invoiceDetailNum',
        width:'100px',
    },{
        title: '认证月份',
        dataIndex: 'authMonth',
        width:'100px',
    },{
        title: '认证时间',
        dataIndex: 'authDate',
        width:'100px',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'100px',
    },{
        title: '购货单位名称',
        dataIndex: 'purchaseName',
        width:'100px',
    },{
        title: '销货单位名称',
        dataIndex: 'sellerName',
        width:'100px',
    },{
        title: '金额',
        dataIndex: 'amount',
        className: "table-money",
        render: text => fMoney(text),
        width:'100px',
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        className: "table-money",
        render: text => fMoney(text),
        width:'100px',
    },{
        title: '开户行',
        dataIndex: 'bank',
        width:'100px',
    },{
        title: '地址',
        dataIndex: 'address',
        width:'100px',
    },{
        title: '账号',
        dataIndex: 'account',
        width:'100px',
    },{
        title: '电话',
        dataIndex: 'phone',
        width:'100px',
    },{
        title: '进项结构分类名称',
        dataIndex: 'incomeStructureTypeName',
        width:'100px',
    },{
        title: '应税项目',
        dataIndex: 'taxableProject',
        width:'100px',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        className: "table-money",
        render:text=>fMoney(text),
        width:'100px',
    },{

        title: '匹配状态',
        dataIndex: 'matchingStatus',
        width:'100px',
        render:text=>{
            let txt = '';
            switch (parseInt(text,0)) {
                case 0:
                    txt = "未匹配";
                    break;
                case 1:
                    txt = "已经匹配";
                    break;
                case 2:
                    txt = "无需匹配";
                    break;
                default:
                    txt = text;
                    break;
            }
            return txt
        },
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
        width:'100px',
    }
];
export default class IncomingInvoiceCollection extends Component{
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
                        title:'进项发票采集'
                    },
                    url:'/income/invoice/collection/report/list',
                    extra:<div>
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
                    scroll:{ x: 2900,y:window.screen.availHeight-360,},
                }}
            />
            </div>
        )
    }
}