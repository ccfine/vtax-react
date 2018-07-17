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
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">纳税主体</p>
            <p className="apply-form-list-p2">纳税人识别号</p>
        </div>,
        dataIndex: 'mainName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.sellerTaxNum}</p>
            </div>
        ),
        width:'8%',
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
            <p className="apply-form-list-p1">是否需要认证</p>
            <p className="apply-form-list-p2">认证标记</p>
        </div>,
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

            //认证标记:认证结果1:认证成功;2:认证失败;0:无需认证';
            let res2 = "";
            switch (parseInt(record.authStatus, 0)) {
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

            return(
                <div>
                    <p className="apply-form-list-p1">{txt}</p>
                    <p className="apply-form-list-p2">{res2}</p>
                </div>
            )
        },
        width:80,
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
        width:'4%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票类型</p>
            <p className="apply-form-list-p2">发票明细号</p>
        </div>,
        dataIndex: 'invoiceType',
        render: (text,record) => {
            let invoiceTypeText ='';
            if(text==='s'){
                invoiceTypeText = '专票'
            }
            if(text==='c'){
                invoiceTypeText = '普票'
            }
            return (
                <div>
                    <p className="apply-form-list-p1">{invoiceTypeText}</p>
                    <p className="apply-form-list-p2">{record.invoiceDetailNum}</p>
                </div>
            )
        },
        width:'4%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">认证月份</p>
            <p className="apply-form-list-p2">认证时间</p>
        </div>,
        dataIndex: 'authMonth',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.authDate}</p>
            </div>
        ),
        width:75,
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票代码</p>
            <p className="apply-form-list-p2">发票号码</p>
        </div>,
        dataIndex: 'invoiceCode',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceNum}</p>
            </div>
        ),
        width:'4%',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:75,
    },{
        title: '购货单位名称',
        dataIndex: 'purchaseName',
        width:'6%',
    },{
        title: '销货单位名称',
        dataIndex: 'sellerName',
        width:'10%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">金额</p>
            <p className="apply-form-list-p2">税额</p>
        </div>,
        dataIndex: 'amount',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">{fMoney(record.taxAmount)}</p>
            </div>
        ),
        width:'4%',
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
        width:'10%',
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
        title: '进项结构分类名称',
        dataIndex: 'incomeStructureTypeName',
        width:'6%',
    },{
        title: '应税项目',
        dataIndex: 'taxableProject',
        width:'6%',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        width:'4%',
    },{

        title: '匹配状态',
        dataIndex: 'matchingStatus',
        width:60,
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
        dataIndex: 'remark'
    }
];
export default class IncomingInvoiceCollection extends Component{
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
                    pageSize:100,
                    columns:columns,
                    cardProps:{
                        title:'进项发票采集'
                    },
                    url:'/income/invoice/collection/report/list',
                    scroll:{ x: 2400,y:window.screen.availHeight-360,},
                }}
            />

        )
    }
}