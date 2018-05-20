/**
 * Created by liuliyuan on 2018/5/14.
 */
import React, { Component } from 'react';
import {Icon,message,Modal} from 'antd'
import {SearchTable} from 'compoments';
import {request} from 'utils'
const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
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
        type:'taxMain',
        fieldName:'mainId',
        formItemStyle,
        span:6,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
        formItemStyle,
        span:6,
        options:[  //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            {
                text:'申报办理',
                value:'1'
            },{
                text:'申报完成',
                value:'4'
            }
        ],
    },{
        label:'所属期',
        type:'monthPicker',
        fieldName:'partTerm',
        formItemStyle,
        span:6,
    },{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
        formItemStyle,
        span:6,
        options:[
            {
                text:'增值税',
                value:'1'
            },{
                text:'企业所得税',
                value:'2'
            }
        ],
    }
]
const getColumns =(context)=>[
    {
        title: "操作",
        className:'text-center',
        render:(text,record)=>{
            let status = parseInt(record.status,0);
            console.log(record.status)
            if( status < 5  && status !== -1){
                return (
                    <span
                        title="完成"
                        style={{
                            ...pointerStyle,
                            marginLeft: 5
                        }}
                        onClick={() => context.handelComplete()}
                    >
                        <Icon title="完成" type="check" />
                    </span>
                )
            }
            if(status < 6 && status !== -1){
                return (
                    <span
                        title="归档"
                        style={{
                            ...pointerStyle,
                            marginLeft: 5
                        }}
                        onClick={() => context.handelArchiving()}
                    >
                        <Icon title="归档" type="check" />
                    </span>
                )
            }
            if(status < 6  && status !== -1){
                return (
                    <span
                        title="流程终止"
                        style={{
                            ...pointerStyle,
                            marginLeft: 5
                        }}
                        onClick={() => context.handelProcessStop()}
                    >
                        <Icon title="流程终止" type="exception" />
                    </span>
                )
            }
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },{
        title: '申报状态',
        dataIndex: 'status',
        className:'text-center',
        render:text=>{
            //1:免抵退税;2:免税;3:减税;4:即征即退;5:财政返还;6:其他税收优惠;
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{ color: '#44b973' }}>申报办理</span>;
                    break;
                case 2:
                    t=<span style={{ color: '#2783d8' }}>申报审核</span>;
                    break;
                case 3:
                    t=<span style={{ color: '#373ac6' }}>申报审批</span>;
                    break;
                case 4:
                    t=<span style={{ color: '#1795f6' }}>申报完成</span>;
                    break;
                case 5:
                    t=<span style={{ color: '#7a7e91' }}>归档</span>;
                    break;
                case -1:
                    t=<span style={{ color: '#ed2550' }}>流程终止</span>;
                    break;
                default:
                //no default
            }
            return t;
        }
    }, {
        title: '上一步完成时间',
        dataIndex: 'lastModifiedDate',
    },{
        title: '大区',
        dataIndex: 'region',
    },{
        title: '组织架构',
        dataIndex: 'orgName',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '所属期',
        dataIndex: 'partTerm',
    },{
        title: '税（费）种',
        dataIndex: 'taxType',
        render:text=>{
            //1:增值税;2:企业所得税;
            text = parseInt(text,0);
            if(text===1){
                return '增值税'
            }
            if(text ===2){
                return '企业所得税'
            }
            return text;
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    },{
        title: '所属流程',
        dataIndex: 'isProcess',
    },{
        title: '申报人',
        dataIndex: 'declareBy',
    },{
        title: '申报日期',
        dataIndex: 'month',
    }
];

export default class DeclareHandle extends Component{
    state={
        updateKey:Date.now(),
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    handelComplete=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否确定流程已完成？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`/tax/decConduct/finish/${this.state.selectedRowKeys}`)
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success('流程完成成功!');
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    handelArchiving=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否确定要归档？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`/tax/decConduct/record/${this.state.selectedRowKeys}`,{
                    mainId: this.state.selectedRows[0].mainId,
                    authMonth:this.state.selectedRows[0].month
                })
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success('流程归档成功!');
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    handelProcessStop=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否确定要流程终止？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put('/tax/declaration/stop',{
                    mainId: this.state.selectedRows[0].mainId,
                    authMonth:this.state.selectedRows[0].month
                })
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success('流程终止成功!');
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }

    render(){
        const {updateKey} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:10,
                    columns:getColumns(this),
                    cardProps:{
                        title:'列表信息'
                    },
                    url:'/tax/decConduct/decList',
                }}
            >
            </SearchTable>
        )
    }
}