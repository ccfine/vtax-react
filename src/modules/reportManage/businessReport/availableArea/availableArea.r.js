/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:24:51 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-06 11:30:51
 */
import React, { Component } from "react";
import { SearchTable} from "compoments";
import {composeBotton,request} from 'utils';
import {Modal,message} from 'antd';
const searchFields = (getFieldValue)=>[
    {
        label: "纳税主体",
        type: "taxMain",
        span:8,
        fieldName: "mainId"
    },{
        label: "项目名称",
        fieldName: "projectId",
        type: "asyncSelect",
        span:8,
        componentProps: {
            fieldTextName: "itemName",
            fieldValueName: "id",
            doNotFetchDidMount: true,
            fetchAble: getFieldValue("mainId"),
            url: `/project/list/${getFieldValue("mainId")}`
        }
    },
    {
        label: "项目分期",
        fieldName: "stageId",
        type: "asyncSelect",
        span:8,
        componentProps: {
            fieldTextName: "itemName",
            fieldValueName: "id",
            doNotFetchDidMount: true,
            fetchAble: getFieldValue("projectId"),
            url: `/project/stages/${getFieldValue("projectId") || ""}`
        }
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
    }
];

const getColumns = context => [{
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:['1531008'],
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
        dataIndex: "mainName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.mainId}</p>
            </div>
        )
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">NC公司名称</p>
                <p className="apply-form-list-p2">NC公司代码</p>
            </div>
        ),
        dataIndex: "companyName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.companyNum}</p>
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
    },{
        title: "土地总可售面积（总数）",
        dataIndex: "builtArea"
    },{
        title: "分期总可售面积",
        dataIndex: "totalArea"
    },{
        title: "分期地上可售面积",
        dataIndex: "groundArea"
    },{
        title: "分期地下可售面积",
        dataIndex: "undergroundArea"
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">SAP法人公司名称</p>
                <p className="apply-form-list-p2">SAP法人公司代码</p>
            </div>
        ),
        dataIndex: "sapCompanyName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.sapCompanyNo}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">SAP利润中心名称</p>
                <p className="apply-form-list-p2">SAP利润中心代码</p>
            </div>
        ),
        dataIndex: "profitCenterName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.profitCenterNo}</p>
            </div>
        )
    },
];

export default class AvailableArea extends Component {
    state = {
        updateKey: Date.now()
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    deleteRecord(record){
        request.delete(`/interAvailableBuildingAreaInformation/delete/${record.id}`).then(({data}) => {
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
                    url: "/interAvailableBuildingAreaInformation/inter/list",
                    key: updateKey,
                    cardProps: {
                        title: "可售面积"
                    },
                    scroll: {
                        x: "140%"
                    },
                    onSuccess:filters=>{
                        this.setState({filters})
                    },
                    extra:(
                        <span>
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type: 'fileExport',
                                    url: 'interAvailableBuildingAreaInformation/download',
                                },{
                                    type:'fileImport',
                                    url:'/interAvailableBuildingAreaInformation/upload',
                                    onSuccess:this.update,
                                    userPermissions:['1531005'],
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
