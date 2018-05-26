/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import SearchTable from '../SearchTableTansform.react'
import {Modal,message,Card} from 'antd'
import PopModal from './detailModal'
import {request,composeBotton} from 'utils'
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
    }, {
        title: '栋号 ',
        dataIndex: 'building',
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
        title: '单元号',
        dataIndex: 'unitNumber',
    },{
        title: '户号',
        dataIndex: 'accountNumber',
    },{
        title: '建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '分摊面积(m²)',
        dataIndex: 'shareArea'
    },{
        title: '设计用途',
        dataIndex: 'landUse',
    },{
        title: '坐落',
        dataIndex: 'position',
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
        request.delete(`/card/house/ownership/detail/delete/${record.id}`).then(({data}) => {
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
        if(props.updateKey !== this.props.updateKey || props.titleCertificateId!==this.props.titleCertificateId){
            this.setState({updateKey:Date.now()});
        }
    }
    render(){        
        const props = this.props;
        return(
            <Card title="大产证明细" style={{marginTop:'10px'}}>
                <SearchTable
                    actionOption={{
                        body:(
                            <span>
                                    {
                                        composeBotton([{
                                            type:'add',
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
                        url:`/card/house/ownership/detail/list/${props.titleCertificateId}`,
                        key:this.state.updateKey,
                        cardProps:{
                            bordered:false,
                        }
                    }}
                />
               <PopModal 
                    titleCertificateId={props.titleCertificateId}
                    id={this.state.opid}
                    action={this.state.action}
                    visible={this.state.visible}
                    hideModal={()=>{this.hideModal()}}
                    update={()=>{this.update()}}
                />
            </Card>
        )
    }
}