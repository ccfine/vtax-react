/**
 * Created by liurunbin on 2018/1/29.
 * 售房预缴台账
 */
import React,{Component} from 'react'
import {SearchTable} from '../../../../compoments'
import {fMoney} from '../../../../utils'
const searchFields = (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
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
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'过滤期间',
            fieldName:'receiveMonth',
            type:'monthPicker',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择过滤期间'
                    }
                ]
            },
            componentProps:{
                format:'YYYY-MM'
            }
        },
        {
            label:'楼栋名称',
            type:'input',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldName:'buildingName'
        },
        {
            label:'房号',
            type:'input',
            fieldName:'roomNumber',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
        },
        {
            label:'收款时房屋状态',
            fieldName:'housingStatus',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房',
                    value:'2'
                },
                {
                    text:'期房',
                    value:'1'
                }
            ]
        },
        {
            label:'现房缴费',
            fieldName:'roomState',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房需要预缴',
                    value:'1'
                },
                {
                    text:'现房且结转收入不预缴',
                    value:'2'
                },
                {
                    text:'现房不预缴',
                    value:'3'
                }
            ]
        }
    ]
}
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName',
        width:'150px'
    },
    {
        title:'项目',
        dataIndex:'projectName',
        width:'120px'
    },
    {
        title:'分期',
        dataIndex:'stagesName',
        width:'100px'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'100px'
    },
    {
        title:'单元',
        dataIndex:'element',
        width:'60px'
    },
    {
        title:'房号',
        dataIndex:'roomNumber',
        width:'60px'
    },
    {
        title:'交付时间',
        dataIndex:'deliveryTime',
        width:'75px',
        className:'text-center',
    },
    {
        title:'收款日期',
        dataIndex:'receiveMonth',
        width:'70px',
        className:'text-center',
    },
    {
        title:'收款时房屋状态',
        dataIndex:'housingStatus',
        width:'100px',
        className:'text-center',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '期房'
            }
            if(text===2){
                return '现房'
            }
            return text;
        }
    },
    {
        title:'累计预售价款',
        dataIndex:'cumulativePrepaidPayment',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'当期结转收入金额',
        dataIndex:'currentIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'累计结转收入金额',
        dataIndex:'cumulativeIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'预缴销售额',
        dataIndex:'prepaidSales',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'110px',
    }
];

export default class PrePaidHousingSales extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        className:''
                    }
                }}
                doNotFetchDidMount={true}
                tableOption={{
                    pageSize:100,
                    columns:columns,
                    url:'/account/salehouse/list',
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div className="footer-total-meta">
                                    <div className="footer-total-meta-title">
                                        <label>本页合计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        累计结转收入金额：<span className="amount-code">{fMoney(data.pageCumulativeIncomeAmount)}</span>
                                        累计预收价款：<span className="amount-code">{fMoney(data.pageCumulativePrepaidPayment)}</span>
                                        当期结转收入金额：<span className="amount-code">{fMoney(data.pageCurrentIncomeAmount)}</span>
                                        当期预收价款：<span className="amount-code">{fMoney(data.pageCurrentPrepaidPayment)}</span>
                                        预缴销售额：<span className="amount-code">{fMoney(data.pagePrepaidSales)}</span>
                                        <div className="footer-total-meta-title">
                                            <label>总计：</label>
                                        </div>
                                        <div className="footer-total-meta-detail">
                                            累计结转收入金额：<span className="amount-code">{fMoney(data.totalCumulativeIncomeAmount)}</span>
                                            累计预收价款：<span className="amount-code">{fMoney(data.totalCumulativePrepaidPayment)}</span>
                                            当期结转收入金额：<span className="amount-code">{fMoney(data.totalCurrentIncomeAmount)}</span>
                                            当期预收价款：<span className="amount-code">{fMoney(data.totalCurrentPrepaidPayment)}</span>
                                            预缴销售额：<span className="amount-code">{fMoney(data.totalPrepaidSales)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'1430px',
                        y:'400px'
                    }
                }}
            >
            </SearchTable>
        )
    }
}