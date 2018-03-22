/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Button,Popconfirm,message,Icon} from 'antd'
import PopModal from './popModal'
import {request,fMoney} from '../../../../../../utils'
const getColumns = context=> [
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                <a style={{margin:"0 5px"}} onClick={()=>{
                    context.setState({visible:true,action:'modify',opid:record.id});
                }}>修改</a>
                <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="确认" cancelText="取消">
                    <a>删除</a>
                </Popconfirm>
                <a style={{margin:"0 5px"}} onClick={()=>{
                    context.setState({visible:true,action:'look',opid:record.id});
                }}>查看</a>
                </span>
            );
        },
        fixed:'left',
        width:'100px',
        dataIndex:'action'
    },
    {
        title: '批复文号',
        dataIndex: 'reply',
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
            <div style={{padding:"0 15px"}}>
            <SearchTable
                searchOption={undefined}
                actionOption={{
                    body:(<Button size='small' onClick={()=>{
                        this.setState({visible:true,action:'add',opid:undefined});
                    }}><Icon type="plus" />新增</Button>)
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:`/project/approval/list/${props.projectId}`,
                    scroll:{x:'100%'},
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false
                    }
                }}
            >
            </SearchTable>
             <PopModal 
                projectid={props.projectId}
                id={this.state.opid}
                action={this.state.action} 
                visible={this.state.visible} 
                hideModal={()=>{this.hideModal()}}
                update={()=>{this.update()}}
                ></PopModal> 
            </div>
        )
    }
}