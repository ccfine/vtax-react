/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Button,Popconfirm,message,Card} from 'antd'
import PopModal from './popModal'
import {request} from '../../../../../../utils'
import PartTwo from './TabPage2.r'
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
        title: '权证名称 ',
        dataIndex: 'warrantName',
    }, {
        title: '权证号',
        dataIndex: 'warrantNum',
    },{
        title: '权利人',
        dataIndex: 'warrantUser',
    },{
        title: '坐落',
        dataIndex: 'position',
    },{
        title: '取得方式',
        dataIndex: 'acquireWay'
    },{
        title: '用途',
        dataIndex: 'landUse',
    },{
        title: '宗地面积(m²)',
        dataIndex: 'landArea',
    },{
        title: '建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '地号',
        dataIndex: 'num',
    },{
        title: '使用期限',
        dataIndex: 'limitDate',
    },{
        title: '登记时间',
        dataIndex: 'boardingTime',
    },{
        title: '项目分期',
        dataIndex: 'stagesItemName',
    },{
        title: '清算分期',
        dataIndex: 'liquidationStage',
    },{
        title: '套数',
        dataIndex: 'rooms',
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
        updateKey:Date.now(),
        selectedRowKeys:[],
        titleCertificateId:undefined
    }
    hideModal(){
        this.setState({visible:false});
    }
    update(){
        this.setState({updateKey:Date.now()})
    }
    deleteRecord(record){
        request.delete(`/card/house/ownership/delete/${record.id}`).then(({data}) => {
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
            <Card title="大产证">
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
                    body:(<Button size='small' onClick={()=>{
                        this.setState({visible:true,action:'add',opid:undefined});
                    }}>添加</Button>)
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:`/card/house/ownership/list/${props.projectId}`,
                    scroll:{x:'200%'},
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        bodyStyle:{marginLeft:'-2px',padding:'10px'}
                    },
                    rowSelection:{
                        selectedRowKeys:this.state.selectedRowKeys,
                        type:'radio',
                        onSelect:((record, selected, selectedRows)=>{
                            if(selected){
                                this.setState({titleCertificateId:record.id})
                                console.log(record.id)
                            }
                        }),
                        onChange:selectedRowKeys=>{
                            this.setState({selectedRowKeys});
                        }
                    }
                }}
            >
            </SearchTable>
            </Card>
               <PopModal 
                projectid={props.projectId}
                id={this.state.opid}
                action={this.state.action} 
                visible={this.state.visible} 
                hideModal={()=>{this.hideModal()}}
                update={()=>{this.update()}}
                ></PopModal>
                {this.state.titleCertificateId && <PartTwo titleCertificateId={this.state.titleCertificateId} updateKey={this.state.updateKey}/>}
                
            </div>
        )
    }
}