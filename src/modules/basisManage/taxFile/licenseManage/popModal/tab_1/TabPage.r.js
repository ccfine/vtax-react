/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Popconfirm,message,Icon} from 'antd'
import SearchTable from '../SearchTableTansform.react'
import PopModal from './popModal'
import {request,fMoney} from '../../../../../../utils'
const getColumns = context=>[
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
    },{
        title: '合同编号',
        dataIndex: 'contractNum',
    }, {
        title: '宗地编号',
        dataIndex: 'parcelNum',
    },{
        title: '出让人',
        dataIndex: 'transferor',
    },{
        title: '受让人',
        dataIndex: 'assignee',
    },{
        title: '取得方式',
        dataIndex: 'acquireWay',
    },{
        title: '项目类型',
        dataIndex: 'projectType',
    },{
        title: '宗地位置',
        dataIndex: 'position',
    },{
        title: '土地年限',
        dataIndex: 'landAgeLimit',
    },{
        title: '土地价款',
        dataIndex: 'landPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '建筑面积',
        dataIndex: 'coveredArea',
    },{
        title: '土地面积',
        dataIndex: 'landArea',
    },{
        title: '容积率',
        dataIndex: 'plotRatio',
    },{
        title: '合同签订日期',
        dataIndex: 'signingDate',
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
    deleteRecord(record){
        request.post(`/contract/land/delete/${record.id}`).then(({data}) => {
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
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const props = this.props;
        return(
            <div style={{padding:"0 15px"}}>
            <SearchTable
                actionOption={{
                    body:(<Button size='small' onClick={()=>{
                        this.setState({visible:true,action:'add',opid:undefined});
                    }}><Icon type="plus" />新增</Button>)
                }}
                searchOption={undefined}
                tableOption={{
                    columns:getColumns(this),
                    url:`/contract/land/list/${props.projectId}`,
                    scroll:{x:'200%'},
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