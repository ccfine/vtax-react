/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {Modal,message,Icon,Tooltip} from 'antd'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import PopModal from './popModal'
import {request,fMoney,composeBotton} from 'utils'
const getColumns = context=>[
    {
        title:'操作',
        render:(text, record, index)=>(
            <span>
                <a style={{margin:"0 5px"}} onClick={()=>context.showModal('modify',record.id)}>
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
    },{
        title: '项目名称',
        dataIndex: 'contractNum',
        render:(text,record)=>(
            <a
                onClick={() => context.showModal('look',record.id)}
            >
                <Tooltip placement="top" title="查看">
                    {text}
                </Tooltip>
            </a>
        )
    },{
        title: '金额',
        dataIndex: 'landPrice',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

export default class TabPage extends Component{
    state={
        action:undefined,
        opid:undefined,
        visible:false,
        updateKey:Date.now()
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=(type,opid)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type,
                opid:opid
            }
        })
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
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
                                    onClick:()=>this.showModal('add',undefined)
                                }])
                            }
                        </span>
                    )
                }}
                searchOption={undefined}
                tableOption={{
                    columns:getColumns(this),
                    url:`/contract/land/list/${props.mainId}`,
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    }
                }}
            >
                <PopModal
                    mainId={props.mainId}
                    id={this.state.opid}
                    action={this.state.action}
                    visible={this.state.visible}
                    toggleModalVisible={()=>{this.toggleModalVisible()}}
                    refreshTable={()=>{this.refreshTable()}}
                />
            </SearchTable>

        )
    }
}