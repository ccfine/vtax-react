/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:24:51 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-26 11:57:36
 */
import React, { Component } from "react";
import { SearchTable} from "compoments";
import {request,composeBotton} from 'utils';
import {message,Form,Modal} from 'antd';
import { NumericInputCell } from 'compoments/EditableCell'
const searchFields = (getFieldValue)=>[
    {
        label: "纳税主体",
        type: "taxMain",
        span:8,
        fieldName: "mainId",
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        }
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
            // userPermissions:['1531008'],
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
        width:'50px',
        dataIndex:'action',
        className:'text-center',
    },{
        title: "纳税主体名称",
        dataIndex: "mainName",
        width:'150px',
    },{
        title: "纳税主体代码",
        dataIndex: "mainId",
        width:'150px',
    },{
        title: "NC公司名称",
        dataIndex: "companyName",
        width:'150px',
    },{
        title: "NC公司代码",
        dataIndex: "companyNum",
        width:'100px',
    },{
        title: "项目分期名称",
        dataIndex: "stageName",
        width:'150px',
    },{
        title: "项目分期代码",
        dataIndex: "stageNum",
        width:'100px',
    },{
        title: "土地总可售面积（总数）",
        dataIndex: "builtArea",
        width:'150px',
    },{
        title: "分期总可售面积",
        dataIndex: "totalArea",
        width:'100px',
    },{
        title: "分期地上可售面积",
        dataIndex: "groundArea",
        width:'150px',
    },{
        title: "修改后分期地上可售面积",
        dataIndex: "editGroundArea",
        render:(text,record,index)=>{
            return <NumericInputCell
            fieldName={`editGroundArea[${index}]`}
            initialValue={text}
            componentProps={{decimalPlaces:4}}
            getFieldDecorator={context.props.form.getFieldDecorator} />
        },
        width:'150px',
    },{
        title: "分期地下可售面积",
        dataIndex: "undergroundArea",
        width:'150px',
    },{
        title: "SAP法人公司名称",
        dataIndex: "sapCompanyName",
        width:'150px',
    },{
        title: "SAP法人公司代码",
        dataIndex: "sapCompanyNo",
        width:'150px',
    },{
        title: "SAP利润中心名称",
        dataIndex: "profitCenterName",
        width:'150px',
    },{
        title: "SAP利润中心代码",
        dataIndex: "profitCenterNo",
        width:'150px',
    }
];

class AvailableArea extends Component {
    state = {
        updateKey: Date.now(),
        filters:{},
        dataSource:[],
        saveLoding:false,
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(!values.editGroundArea){return}
                const {dataSource} = this.state;
                let params = dataSource.map((ele,index)=>{
                    return {
                        id:ele.id,
                        editGroundArea:values.editGroundArea[index],
                    }
                })
                this.setState({saveLoding:true})
                request.put('/interAvailableBuildingAreaInformation/update',params)
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.props.form.resetFields(this.state.dataSource.map((ele,index)=>`editGroundArea[${index}]`))
                            this.update()
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({saveLoding:false})
                    })
            }
        })
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
        let { updateKey,saveLoding,filters } = this.state;
        return (
            <div className="oneLine">
            <SearchTable
                doNotFetchDidMount={true}
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
                        x: 2150,
                        y:window.screen.availHeight-430,
                    },
                    onSuccess:(filters,dataSource)=>{
                        this.setState({filters,dataSource})
                    },
                    extra:(
                        <span>
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type:'fileImport',
                                    url:'/interAvailableBuildingAreaInformation/upload',
                                    onSuccess:this.update,
                                    // userPermissions:['1531005'],
                                    fields:importFeilds
                                }])
                            }
                            {
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'interAvailableBuildingAreaInformation/download',
                                }])
                            }
                            {
                                composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    userPermissions:['1531004'],
                                    onClick:this.save,
                                    loading:saveLoding
                                }])
                            }
                        </span>
                    )
                }}
            />
            </div>
        );
    }
}

export default Form.create()(AvailableArea);