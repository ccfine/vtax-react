/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:25:07 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-23 16:00:04
 */
import React, { Component } from "react";
import {message,Modal} from 'antd';
import { SearchTable} from "compoments";
import { fMoney,composeBotton,request } from "utils";
const searchFields = [
    {
        label: "纳税主体",
        type: "taxMain",
        fieldName: "taxSubjectId",
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label: "入账月份",
        type: "monthPicker",
        fieldName: "taxMonth"
    },
    {
        label: "取得方式",
        fieldName: "acquisitionMode",
        span: 8,
        type: "select",
        options: [ //0-外部获取,1-单独新建，2-自建转自用
            {
                text: "外部获取",
                value: "0"
            },
            {
                text: "单独新建",
                value: "1"
            },
            {
                text: "自建转自用",
                value: "2"
            }
        ]

    }
];

const importFeilds = [
    {
        label: "纳税主体",
        type: "taxMain",
        fieldName: "mainId",
        span: 24,
        formItemStyle: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 17
            }
        },
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: "请选择纳税主体"
                }
            ]
        }
    },
    /*{
        label: "入账月份",
        type: "monthPicker",
        fieldName: "accountDate",
        span: 24,
        formItemStyle: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 17
            }
        },
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: "请选择入账月份"
                }
            ]
        }
    }*/
];

const getColumns = context => [
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            // userPermissions:['1871008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    },
    {
        title: "纳税主体名称",
        dataIndex: "taxSubjectName",
        width:'200px',
    },
    {
        title: "纳税主体代码",
        dataIndex: "taxSubjectNum",
        width:'100px',
    },
    {
        title: "项目分期名称",
        dataIndex: "stageName",
        width:'200px',
    },
    {
        title: "项目分期代码",
        dataIndex: "stageNum",
        width:'100px',
    },
    {
        title: "固定资产名称",
        dataIndex: "assetName",
        width:'200px',
    },
    {
        title: "固定资产编号",
        dataIndex: "assetNo",
        width:'100px',
    },
    {
        title: "入账日期",
        dataIndex: "accountDate",
        width:'100px',
    },
    {
        title: "取得方式",
        dataIndex: "acquisitionMode",
        width:'100px',
        render: (text) => {
            // 0-外部获取
            // 1-单独新建
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
                    break;
                case 1:
                    res = "单独新建";
                    break;
                case 2:
                    res = "自建转自用";
                    break;
                default:
                    break;
            }
            return res
        },
    },
    {
        title: "取得价值",
        dataIndex: "gainValue",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "资产类别",
        dataIndex: "assetType",
        width:'200px',
    },
    {
        title: "资产状态",
        dataIndex: "assetsState",
        width:'100px',
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered",
        width:'100px',
    },
    {
        title: "购进税额",
        dataIndex: "inTax",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "购进税率",
        dataIndex: "intaxRate",
        width:'100px',
        render: (text) => text ? `${text}%`: text
    },
    {
        title: "当期抵扣的进项税额",
        dataIndex: "taxAmount",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "待抵扣的进项税额",
        dataIndex: "deductedTaxAmount",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "待抵扣期间",
        dataIndex: "deductedPeriod",
        width:'100px',
    }
];

export default class fixedAssetCard extends Component {
    state = {
        updateKey: Date.now(),
        filters:{},
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    deleteRecord(record){
        request.delete(`/fixedAssetCard/report/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.update();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
                message.error(err.message);
            })
    }
    render() {
        let { updateKey,filters } = this.state;
        return (
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields: searchFields
                }}
                tableOption={{
                    columns: getColumns(this),
                    url: "/fixedAssetCard/report/list",
                    key: updateKey,
                    cardProps: {
                        title: "固定资产卡片"
                    },
                    onSuccess:(filters)=>{
                        this.setState({filters})
                    },
                    scroll:{ x: 2170,y:window.screen.availHeight-360,},
                    extra: (
                        <span>
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    /*type:'fileExport',
                                    url:'fixedAssetCard/report/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1871007'],
                                },{*/
                                    type:'fileImport',
                                    url:'/fixedAssetCard/report/upload',
                                    onSuccess:this.update,
                                    // userPermissions:['1875002'],
                                    fields:importFeilds
                                }])
                            }
                            {
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'fixedAssetCard/report/download',
                                }])
                            }
                        </span>
                    )
                }}
            />
        );
    }
}
