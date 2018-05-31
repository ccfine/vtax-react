/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Modal,message} from 'antd'
import PopModal from './popModal'
import {request,composeBotton} from 'utils'
const getColumns = context=>[
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
            userPermissions:[],
            style:{color:'#f5222d'},
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
        title: '建设用地规划许可证',
        dataIndex: 'licenseKey',
        render:(text,record)=>(
            <a title="查看详情"
                onClick={() => {
                    context.setState({visible:true,action:'look',opid:record.id});
                }}>
                {text}
            </a>
        )
    }, {
        title: '用地位置',
        dataIndex: 'position',
    },{
        title: '用地性质',
        dataIndex: 'property',
    },{
        title: '用地面积(m²)',
        dataIndex: 'landArea',
    },{
        title: '建设规模(m²)',
        dataIndex: 'scale',
    },{
        title: '取证日期',
        dataIndex: 'evidenceDate',
    },{
        title: '土地出让合同编号',
        dataIndex: 'leaseContractNum',
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
        request.delete(`/card/build/delete/${record.id}`).then(({data}) => {
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
            <SearchTable
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
                searchOption={undefined}
                tableOption={{
                    columns:getColumns(this),
                    url:`/card/build/list/${props.projectId}`,
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