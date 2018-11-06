/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import PopModal from './popModal'
import {request,fMoney,composeBotton,parseJsonToParams} from 'utils'
const getColumns = context=>{
    let operates = context.props.disabled?[]:[{
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:['1121004'],
            onSuccess:()=>context.showModal('modify',record.id)
        },{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:['1121008'],
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
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    }]
    return [...operates,{
        title: '应税项目名称',
        dataIndex: 'taxableProjectName',
        render:(text,record)=>(
            <a title="查看详情"
                onClick={() => context.showModal('look',record.id)}>
                {text}
            </a>
        )
    }, {
        title: '计税方法',
        dataIndex: 'taxMethod',
        render:(text)=>{
            text = parseInt(text,10);
            if(text===1){
                return '一般计税方法'
            }else if(text ===2){
                return '简易计税方法'
            }else{
                return ''
            }
        }
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];
}

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
            action:type,
            opid
        })
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    deleteRecord(record){
        request.delete(`/account/otherTax/deducted/collection/${this.props.beginType === '2' ? 'pc/' : ''}delete/${this.props && this.props.filters.mainId}/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
                message.error(err.message);
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
                actionOption={props.disabled ? null :{
                    body:(
                        <span>
                            {
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    userPermissions:['1121003'],
                                    onClick:()=>this.showModal('add',undefined)
                                }])
                            }
                        </span>
                    )
                }}
                searchOption={undefined}
                tableOption={{
                    columns:getColumns(this),
                    url:`/account/otherTax/deducted/collection/${this.props.beginType === '2' ? 'pc/' : ''}list?${parseJsonToParams(this.props.filters)}`,
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        style:{
                            marginTop:0,
                            maxHeight:400,
                            overflowY:'auto',
                        }
                    },
                    pagination:true,
                    pageSize:100,
                }}
            >
                <PopModal
                    filters={this.props.filters}
                    id={this.state.opid}
                    action={this.state.action}
                    visible={this.state.visible}
                    toggleModalVisible={this.toggleModalVisible}
                    refreshTable={this.refreshTable}
                />
            </SearchTable>

        )
    }
}