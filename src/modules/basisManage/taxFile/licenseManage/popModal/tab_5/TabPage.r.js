/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Button,Popconfirm,message,Icon} from 'antd'
import PopModal from './popModal'
import {request} from '../../../../../../utils'
const getSearchFields = projectId => [
    {
        label:'项目分期',
        type:'asyncSelect',
        fieldName:'stagesId',
        componentProps:{
            url:`/project/stages/${projectId}`,
            fieldTextName:"itemName",
            fieldValueName:"id"
        }
    }
]
const getColumns = context=> [
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                <a style={{marginRight:"5px"}} onClick={()=>{
                    context.setState({visible:true,action:'modify',opid:record.id});
                }}>修改</a>
                <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                    <a style={{marginRight:"5px"}}>删除</a>
                </Popconfirm>
                <a onClick={()=>{
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
        title: '土地证编号 ',
        dataIndex: 'licenseKey',
    }, {
        title: '用地单位',
        dataIndex: 'organization',
    },{
        title: '地块位置',
        dataIndex: 'position',
    },{
        title: '土地用途',
        dataIndex: 'landUse',
    },{
        title: '取得方式',
        dataIndex: 'acquireWay',
    },{
        title: '项目分期',
        dataIndex: 'projectStagesName',
        width:300
    },{
        title: '土地年限',
        dataIndex: 'ageLimit',
        width:60
    },{
        title: '使用权面积(m²)',
        dataIndex: 'rightArea',
    },{
        title: '其中:分摊面积(m²)',
        dataIndex: 'shareArea',
    },{
        title: '其中:独有面积(m²)',
        dataIndex: 'ownArea',
    },{
        title: '取证日期',
        dataIndex: 'evidenceDate',
    },{
        title: '备注',
        dataIndex: 'remark',
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
        request.delete(`/card/land/use/delete/${record.id}`).then(({data}) => {
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
        const {projectId} = this.props;
        return(
            <div style={{padding:"0 15px"}}>
            <SearchTable
                actionOption={{
                    body:(<Button size='small' onClick={()=>{
                        this.setState({visible:true,action:'add',opid:undefined});
                    }}><Icon type="plus" />新增</Button>)
                }}
                searchOption={{
                    fields:getSearchFields(projectId),
                    cardProps:{
                        title:'',
                        bordered:false,
                        extra:null,
                        bodyStyle:{padding:"0px"},
                    }
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:`/card/land/use/list/${props.projectId}`,
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