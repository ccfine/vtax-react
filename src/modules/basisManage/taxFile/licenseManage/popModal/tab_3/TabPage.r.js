/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Modal,message} from 'antd'
import PopModal from './popModal'
import {request,fMoney,composeBotton} from 'utils'
const getColumns = context=> [
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:[],
            onSuccess:()=>context.setState({visible:true,action:'modify',opid:record.id})
        },{
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
        width:'100px',
        dataIndex:'action',
        className:'text-center',
    },
    {
        title: '批复文号',
        dataIndex: 'reply',
        render:(text,record)=>(
            <a title="查看详情"
                onClick={() => {
                    context.setState({visible:true,action:'look',opid:record.id});
                }}
            >
                {text}
            </a>
        )
    }, {
        title: '占地面积(m²)',
        dataIndex: 'coveredArea',
    },{
        title: '总建筑面积(m²)',
        dataIndex: 'totalBuildingArea',
    },{
        title: '业态',
        dataIndex: 'type',
    },{
        title: '投资总额',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '开发商',
        dataIndex: 'developers',
    },{
        title: '有效期',
        dataIndex: 'validityDate',
    },{
        title: '批复日期',
        dataIndex: 'approvalDate',
    },{
        title: '批复部门',
        dataIndex: 'approvalDepartment',
    }
];

export default class TabPage extends Component{
    state={
        action:undefined,
        opid:undefined,
        visible:false,
        updateKey:Date.now()
    }
    hideModal(){
        this.setState({visible:false});
    }
    update(){
        this.setState({updateKey:Date.now()})
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    deleteRecord(record){
        request.delete(`/project/approval/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.setState({updateKey:Date.now()});
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(err => {
            message.error(err.message);
            this.setState({loading:false});
            this.hideModal();
        })
    }
    render(){
        const props = this.props;
        return(
            <SearchTable
                searchOption={undefined}
                actionOption={{
                    body:(
                        <span>
                            {
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    userPermissions:[],
                                    onClick:()=>{
                                        this.setState({visible:true,action:'add',opid:undefined});
                                    }
                                }])
                            }
                        </span>
                    )
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:`/project/approval/list/${props.projectId}`,
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    }
                }}
            >
                <PopModal
                    projectid={props.projectId}
                    id={this.state.opid}
                    action={this.state.action}
                    visible={this.state.visible}
                    hideModal={()=>{this.hideModal()}}
                    update={()=>{this.update()}}
                />
            </SearchTable>
        )
    }
}