/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:25:07 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 10:48:46
 */
import React, { Component } from "react";
import {message} from 'antd';
import { SearchTable, TableTotal } from "compoments";
import { fMoney,composeBotton,request } from "utils";
import TableTitle from 'compoments/tableTitleWithTime'

const searchFields = (getFieldValue) => [
    {
        label: "纳税主体",
        type: "taxMain",
        fieldName: "mainId",
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
        fieldName: "authMonth"
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
                text: "自建转自用",
                value: "2"
            }
        ]

    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
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
        label:'转固单号',
        fieldName:'rotaryNum',
        span:8,
    },
];
/*
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
    }
];*/

const apiFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    }
]
const getColumns = context => [
    /*{
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
    },*/
    {
        title: "利润中心",
        dataIndex: "profitCenterName",
        width: '200px'
    },
    {
        title: "项目分期名称",
        dataIndex: "stageName",
        // width:'200px',
    },
    {
        title: "不动产名称",
        dataIndex: "assetName",
        width:'200px',
    },
    {
        title: "不动产编号",
        dataIndex: "assetNo",
        width:'150px',
    },
    {
        title: "转固单号",
        dataIndex: "rotaryNum",
        width:'150px',
    },
    {
        title: "入账日期",
        dataIndex: "accountDate",
        width:'100px',
    },
    {
        title: "取得方式",
        dataIndex: "acquisitionMode",
        width:'150px',
        render: (text) => {
            // 0-外部获取
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
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
        width:'250px',
    },
    {
        title: "资产状态",
        dataIndex: "assetsState",
        width:'150px',
    },
    {
        title: "处置日期",
        dataIndex: "inactiveDate",
        width:'100px',
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered",
        width:'100px',
    },
    {
        title: "税率",
        dataIndex: "intaxRate",
        width:'100px',
        render: (text) => text ? `${text}%`: text,
        className:'text-right',
    },
    {
        title: "税额",
        dataIndex: "inTax",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
];

export default class fixedAssetCard extends Component {
    state = {
        updateKey: Date.now(),
        filters:{},
        totalSource:{},
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
        let { updateKey,totalSource } = this.state;
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
                        title: <TableTitle time={totalSource && totalSource.extractTime}>SAP-不动产卡片采集</TableTitle>
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    onSuccess:(filters)=>{
                        this.setState({filters})
                    },
                    scroll:{ x: 2200,y:window.screen.availHeight-360,},
                    extra: (
                        <span>
                            {/*
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'fixedAssetCard/report/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1871007'],
                                },{
                                    type:'fileImport',
                                    url:'/fixedAssetCard/report/upload',
                                    onSuccess:this.update,
                                    // userPermissions:['1875002'],
                                    fields:importFeilds
                                }])
                            */}
                            {/*
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'fixedAssetCard/report/download',
                                }])
                            */}
                            {
                                composeBotton([{
                                    type:'modal',
                                    url:'/fixedAssetCard/report/sendApi',
                                    title:'抽数',
                                    icon:'usb',
                                    fields:apiFields,
                                    userPermissions:['1875001'],
                                }])
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '税额', dataIndex: 'inTax'},
                                            {title: '取得价值', dataIndex: 'gainValue'},
                                        ],
                                    }
                                ]
                            } />
                        </span>
                    )
                }}
            />
        );
    }
}