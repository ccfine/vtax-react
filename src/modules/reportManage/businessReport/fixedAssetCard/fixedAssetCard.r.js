/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:25:07 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-28 14:41:45
 */
import React, { Component } from "react";
import {Modal,message} from 'antd';
import { SearchTable} from "compoments";
import { fMoney,composeBotton,request } from "utils";
const searchFields = [
    {
        label: "纳税主体",
        type: "taxMain",
        fieldName: "taxSubjectId"
    },
    {
        label: "入账月份",
        type: "monthPicker",
        fieldName: "taxMonth"
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
    {
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
];

const getColumns = context => [
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:[],
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
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">纳税主体名称</p>
                <p className="apply-form-list-p2">纳税主体代码</p>
            </div>
        ),
        dataIndex: "taxSubjectName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.taxSubjectNum}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目分期名称</p>
                <p className="apply-form-list-p2">项目分期代码</p>
            </div>
        ),
        dataIndex: "stageName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.stageNum}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">固定资产名称</p>
                <p className="apply-form-list-p2">固定资产编号</p>
            </div>
        ),
        dataIndex: "assetName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.assetNo}</p>
            </div>
        )
    },
    {
        title: "入账日期",
        dataIndex: "accountDate"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">取得方式</p>
                <p className="apply-form-list-p2">取得价值</p>
            </div>
        ),
        dataIndex: "acquisitionMode",
        render: (text, record) => {
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
            return (
                <div>
                    <p className="apply-form-list-p1">{res}</p>
                    <p className="apply-form-list-p2">
                        {fMoney(record.gainValue)}
                    </p>
                </div>
            );
        }
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">资产类别</p>
                <p className="apply-form-list-p2">资产状态</p>
            </div>
        ),
        dataIndex: "assetType",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.assetsState}</p>
            </div>
        )
    },
    {
        title: "占地面积",
        dataIndex: "areaCovered"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">购进税额</p>
                <p className="apply-form-list-p2">购进税率</p>
            </div>
        ),
        dataIndex: "inTax",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">
                    {parseInt(record.intaxRate,10) && record.intaxRate + "%"}
                </p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">当期抵扣的进项税额</p>
                <p className="apply-form-list-p2">待抵扣的进项税额</p>
            </div>
        ),
        dataIndex: "taxAmount",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">
                    {fMoney(record.deductedTaxAmount)}
                </p>
            </div>
        )
    },
    {
        title: "待抵扣期间",
        dataIndex: "deductedPeriod"
    },
    /*{
        title: "扩展字段1",
        dataIndex: "ext1"
    },
    {
        title: "扩展字段2",
        dataIndex: "ext2"
    },
    {
        title: "扩展字段3",
        dataIndex: "ext3"
    }*/
];

export default class fixedAssetCard extends Component {
    state = {
        updateKey: Date.now(),
        filters:undefined,
    };
    update = () => {
        this.setState({ updateKey: Date.now() });
    };
    
    deleteRecord(record){
        request.delete(`/fixedAssetCard/delete/${record.id}`).then(({data}) => {
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
                searchOption={{
                    fields: searchFields
                }}
                tableOption={{
                    columns: getColumns(this),
                    url: "/fixedAssetCard/list",
                    key: updateKey,
                    cardProps: {
                        title: "固定资产卡片"
                    },
                    onSuccess:(filters)=>{
                        this.setState(filters)
                    },
                    extra: (
                        <span>
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type: 'fileExport',
                                    url: 'fixedAssetCard/download',
                                },{
                                    type:'fileImport',
                                    url:'/fixedAssetCard/upload',
                                    onSuccess:this.update,
                                    userPermissions:[],
                                    fields:importFeilds
                                }])
                            }
                        </span>
                    )
                }}
            />
        );
    }
}
