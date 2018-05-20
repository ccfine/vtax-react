/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Modal,message,Icon,Tooltip} from 'antd'
import PopModal from './popModal'
import {request,composeBotton} from 'utils'
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
        render:(text, record, index)=>(
            <span>
                <a style={{margin:"0 5px"}} onClick={()=>{
                    context.setState({visible:true,action:'modify',opid:record.id});
                }}>
                    <Tooltip placement="top" title="编辑">
                           <Icon type="edit" />
                    </Tooltip>
                </a>
                <span style={{
                    color:'#f5222d',
                    cursor:'pointer'
                }} onClick={()=>{
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
                }}>
                    <Tooltip placement="top" title="删除">
                        <Icon type="delete" />
                    </Tooltip>
                </span>
            </span>
        ),
        fixed:'left',
        width:'100px',
        dataIndex:'action',
        className:'text-center',
    },
    {
        title: '预售许可证编号 ',
        dataIndex: 'licenseNumber',
        render:(text,record)=>(
            <a
                onClick={() => {
                    context.setState({visible:true,action:'look',opid:record.id});
                }}
            >
                <Tooltip placement="top" title="查看">
                    {text}
                </Tooltip>
            </a>
        )
    }, {
        title: '发证日期',
        dataIndex: 'issueDate',
    },{
        title: '项目分期 ',
        dataIndex: 'stagesName',
    }, {
        title: '土地使用权出让合同',
        dataIndex: 'contractNum',
    },{
        title: '坐落地',
        dataIndex: 'position',
    },{
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '房屋产权证编号',
        dataIndex: 'certificate',
    },{
        title: '土地、规划用途',
        dataIndex: 'landUse',
    },{
        title: '预售建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '地上建筑面积(m²)',
        dataIndex: 'upArea',
    },{
        title: '地下建筑面积(m²)',
        dataIndex: 'downArea',
    },{
        title: '幢号',
        dataIndex: 'buildingNum',
    },{
        title: '层数',
        dataIndex: 'pliesNum',
    },{
        title: '房屋类型',
        dataIndex: 'houseType',
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
        request.delete(`/card/house/sales/delete/${record.id}`).then(({data}) => {
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
                    body:(
                        <span>
                            {
                                composeBotton([{
                                    type:'add',
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
                    url:`/card/house/sales/list/${props.projectId}`,
                    scroll:{x:'200%'},
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