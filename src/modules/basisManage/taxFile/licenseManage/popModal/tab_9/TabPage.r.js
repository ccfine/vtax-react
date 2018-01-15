/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Button,Popconfirm,message} from 'antd'
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
        title: '竣工备案编号 ',
        dataIndex: 'licenseNumber',
    },{
        title: '项目分期',
        dataIndex: 'stagesId'
    }, {
        title: '工程名称',
        dataIndex: 'projectName',
    },{
        title: '工程编号',
        dataIndex: 'projectNum',
    },{
        title: '建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '工程地点',
        dataIndex: 'position'
    },
     {
         title: '工程类别',
         dataIndex: 'projectType',
     },
     {
         title: '结构形式',
         dataIndex: 'structuralStyle',
     },
    {
        title: '建设单位',
        dataIndex: 'developmentOrg',
    },{
        title: '勘察单位',
        dataIndex: 'surveyOrg',
    },{
        title: '设计单位',
        dataIndex: 'designOrg',
    },{
        title: '施工单位',
        dataIndex: 'builderOrg',
    },{
        title: '监理单位',
        dataIndex: 'constructionOrg',
    },{
        title: '监督机构',
        dataIndex: 'authorityOrg',
    },{
        title: '开工日期',
        dataIndex: 'startDate',
    },{
        title: '竣工验收日期',
        dataIndex: 'endDate',
    },{
        title: '发证日期',
        dataIndex: 'issuingDate',
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
        request.delete(`/project/finish/acceptance/delete/${record.id}`).then(({data}) => {
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
                searchOption={{
                    fields:getSearchFields(projectId),
                    cardProps:{
                        title:'',
                        bordered:false,
                        extra:null,
                        bodyStyle:{padding:"0px"},
                    }
                }}
                actionOption={{
                    body:(<Button  onClick={()=>{
                        this.setState({visible:true,action:'add',opid:undefined});
                    }}>添加</Button>)
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:`/project/finish/acceptance/list/${props.projectId}`,
                    scroll:{x:'200%'},
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
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