/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-23 10:14:18 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-26 10:36:06
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import {request,fMoney,composeBotton} from 'utils'
const columns = [{
        title: '房间编码',
        dataIndex: 'roomCode',
    }, {
        title: '已开票金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

export default class TabPage extends Component{
    state={
        updateKey:Date.now(),
        deleteLoading:false,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    toggleDeleteLoading=(val)=>{
        this.setState({deleteLoading:val})
    }
    deleteData=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除所有数据？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleDeleteLoading(true)
                request.delete(`/realtyCollection/delete/${this.props.mainId}`)
                    .then(({data})=>{
                        this.toggleDeleteLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                        message.error(err.message)
                        this.toggleDeleteLoading(false)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const props = this.props,
            {deleteLoading} = this.state;
        return(
            <SearchTable
                actionOption={props.disabled ? null :{
                    span:12,
                    body:(
                        <span>
                            {
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'realtyCollection/download',
                                },{
                                    type:'autoFileImport',
                                    url:`realtyCollection/upload/${props.mainId}`,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1121005'],
                                },{
                                    type:'delete',
                                    icon:'delete',
                                    text:'删除',
                                    btnType:'danger',
                                    loading:deleteLoading,
                                    userPermissions:['1125003'],
                                    onClick:()=>{
                                        this.deleteData()
                                    }
                                }])
                            }
                        </span>
                    )
                }}
                searchOption={undefined}
                tableOption={{
                    columns:columns,
                    url:`/realtyCollection/list/${props.mainId}`,
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    },
                    pagination:true,
                }}
            >
            </SearchTable>

        )
    }
}