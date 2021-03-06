/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-17 10:24:51 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-06 13:44:52
 */
import React, { Component } from "react";
import { SearchTable} from "compoments";
import {request,composeBotton} from 'utils';
import {message,Form} from 'antd';
import { NumericInputCell } from 'compoments/EditableCell'
import {connect} from 'react-redux'
import TableTitle from 'compoments/tableTitleWithTime'
const formItemStyle = {
    labelCol:{
        sm:{
            span:12,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields = (getFieldValue)=>[
    {
        label: "纳税主体",
        fieldName: "mainId",
        type: "taxMain",
        span:8,
        formItemStyle,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        }
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        formItemStyle,
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
        formItemStyle,
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
            url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
        }
    },
];

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
const getColumns = context => [/*{
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
    },*/{
        title: "纳税主体名称",
        dataIndex: "mainName",
        width:'150px',
    },{
        title: "纳税主体编码",
        dataIndex: "mainNum",
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
            initialValue={text==='0' ? '0.00' : text}
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
        totalSource:{},
    }
    update(){
        this.setState({updateKey:Date.now()})
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
                            this.props.form.resetFields()
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
        let { updateKey,saveLoding ,totalSource} = this.state;
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
                        title:  <TableTitle time={totalSource && totalSource.extractTime}>明源-可售面积数据采集</TableTitle>
                    },
                    scroll: {
                        x: 2150,
                        y:window.screen.availHeight-430,
                    },
                    onSuccess:(filters,dataSource)=>{
                        this.setState({filters,dataSource})
                    },
                    onTotalSource: totalSource => {
                        this.setState({
                            totalSource
                        });
                    },
                    extra:(
                        <span>
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
                            {
                                composeBotton([{
                                    type:'modal',
                                    url:'/interAvailableBuildingAreaInformation/sendApi',
                                    title:'抽数',
                                    icon:'usb',
                                    fields:apiFields,
                                    userPermissions:['1535001'],
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


export default connect(state=>({
    userid:state.user.getIn(['personal','id'])
}))(Form.create()(AvailableArea));