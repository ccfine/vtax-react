/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-23 10:14:18 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-01 09:53:40
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
        title: '事项名称',
        dataIndex: 'name',
        render:(text,record)=>(
            <a
                onClick={() => context.showModal('look',record.id)}
                title="查看详情">
                {text}
            </a>
        )
    /*}, {
        title: '利润中心',
        dataIndex: 'profitCenterName',*/
    }, {
        title: '项目分期',
        dataIndex: 'stagesName',
    }, {
        title: '期初余额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '累计扣除土地价款',
        dataIndex: 'landPrice',
        render:text=>fMoney(text),
        className:'table-money'
    }, {
        title: '累计销售土地面积',
        dataIndex: 'salesArea',
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
        request.delete(`/landPriceCollection/${this.props.beginType === '2' ? 'pc/' : ''}delete/${this.props && this.props.filters.mainId}/${record.id}`).then(({data}) => {
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
                    url:`/landPriceCollection/${this.props.beginType === '2' ? 'pc/' : ''}list?${parseJsonToParams(props.filters)}`,
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
                    filters={props.filters}
                    beginType={props.beginType}
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