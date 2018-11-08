/**
 * Created by liuliyuan on 2018/11/5.
 */
import React, { Component } from "react"
import { SearchTable } from "compoments"
import moment from 'moment'

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const apiList = [
    {value: 'YxRoomTransactionFile', text: '营销售楼-房间交易档案接口', system: '营销售楼系统'},
    {value: 'YxRoomInvoice', text: '营销售楼-房间对应发票接口', system: '营销售楼系统'},
    {value: 'MySellFloorAreaInfo', text: '明源成本-可售建筑面积信息接口', system: '明源成本系统'},
    {value: 'MyProductList', text: '明源成本-自持产品清单接口', system: '明源成本系统'},
    {value: 'MyReceiptsInvoice', text: '明源成本-进项发票接口', system: '明源成本系统'},
    {value: 'XyjOutputInvoiceMain', text: '喜盈佳-销项发票信息接口', system: '喜盈佳发票平台'},
    {value: 'XyjIncomeInvoiceMain', text: '喜盈佳-进项发票信息接口', system: '喜盈佳发票平台'},
    {value: 'MdgLegalPersonCompany', text: 'MDG-法人公司信息接口', system: '主数据平台'},
    {value: 'MdgProfitCenter', text: 'MDG-利润中心信息接口', system: '主数据平台'},
    {value: 'MdgProject', text: 'MDG-项目信息接口', system: '主数据平台'},
    {value: 'MdgProjectStage', text: ' MDG-项目分期信息接口', system: '主数据平台'},
    {value: 'SapAccountBalance', text: 'SAP-科目余额表接口', system: 'SAP'},
    {value: 'SapVoucher', text: 'SAP-财务凭证接口', system: 'SAP'},
    {value: 'SapFixedAssetCard', text: 'SAP-固定资产卡片接口', system: 'SAP'},
    {value: 'SapNotesPool', text: 'SAP-票据池接口', system: 'SAP'},
    {value: 'SapRent', text: 'SAP-预收账款租金接口', system: 'SAP'},
];

const searchFields =(disabled,declare)=> getFieldValue => {
    return [
        {
            label: "接口",
            fieldName: "apiKey",
            type: "select",
            options: apiList,
            span: 8,
            formItemStyle,
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请输入接口'
                    }
                ]
            },
        },
        {
            label: "创建期间",
            fieldName: "createTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format:"YYYY-MM-DD"
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择创建期间'
                    }
                ]
            },
        },
        {
            label: "修改期间",
            fieldName: "lastModifiedTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format:"YYYY-MM-DD"
            }
        },
        {
            label: "流水号",
            fieldName: "id",
            span: 8,
            formItemStyle
        },
        {
            label: "任务流水号",
            fieldName: "jobId",
            span: 8,
            formItemStyle
        },
        {

            label: "状态",
            fieldName: "status",
            type: "select",
            span: 8,
            options:[
                {text:'待处理',value:'10'},
                {text:'处理中',value:'20'},
                {text:'处理成功',value:'30'},
                {text:'异常',value:'40'},
            ],
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: getFieldValue('status'),
                rules:[
                    {
                        // required:true,
                        message:'请选择状态'
                    }
                ]
            },
            componentProps:{
                disabled
            }
        }
    ]
}


const getColumns = () => {
    
    return [
        {
            title: "接口",
            dataIndex: "apiKey",
            width: "200px"
        },
        {
            title: "流水号",
            dataIndex: "id",
            width: "200px"
        },
        {
            title: "任务流水号",
            dataIndex: "jobId",
            width: "200px"
        },
        {
            title: "数据来源",
            dataIndex: "content",
            width: "200px",
            render(text, record){
                apiList.map(o=>{
                    if(o.value === record.apiKey){
                        text = o.system;
                    }
                    return null;
                });
                return text;
            }
        },
        {
            title: "状态",
            dataIndex: "baseStatus",
            className:'text-center',
            width: "100px"
        },
        {
            title: "描述",
            dataIndex: "baseMsg",
            width: "300px",
        },
        {
            title: "接口字段报文",
            dataIndex: "apiData",
            render(obj){
                if(obj.constructor === Object || obj.constructor === Array){
                    return JSON.stringify(obj);
                }else{
                    return obj;
                }
            }
        },
        {
            title: "创建时间",
            dataIndex: "baseCreateTime",
            className:'text-center',
            width: "200px",
            render(text){
                return moment(text-'').format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: "任务结束时间",
            dataIndex: "baseLastModifiedTime",
            className:'text-center',
            width: "200px",
            render(text){
                return moment(text - '').format('YYYY-MM-DD HH:mm:ss');
            }
        }
    ]
}

export default class DataResume extends Component {
    constructor () {
        super()
        this.state = {
            updateKey: Date.now()
        }
    }

    render () {
        return (
            <div className="oneline">
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields: searchFields()
                    }}
                    tableOption={{
                        key: this.state.updateKey,
                        pageSize: 100,
                        columns: getColumns(),
                        url: "/api/queryDataRecord",
                        scroll:{ y:window.screen.availHeight-350, x: 2000},
                        cardProps: {
                            title: "数据履历"
                        },
                    }}
                />
            </div>
        )
    }
}