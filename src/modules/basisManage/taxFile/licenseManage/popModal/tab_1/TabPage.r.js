/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
import SearchTable from '../SearchTableTansform.react'
import PopModal from './popModal'
import {request,fMoney,composeBotton} from 'utils'
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
    },{
        title: '合同编号',
        dataIndex: 'contractNum',
        render:(text,record)=>(
            <a title="查看详情"
                onClick={() => {
                    context.setState({
                        visible:true,
                        action:'look',
                        opid:record.id
                    });
                }}
            >
                {text}
            </a>
        )
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
                    url:`/contract/land/list/${props.projectId}`,
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