import React from 'react'
import {Modal,Alert,message} from 'antd'
import {AsyncTable} from 'compoments'
import {request} from 'utils'
const columns=[{
    title:'项目分期',
    dataIndex:'stagesName',
}]
class PopModal extends React.Component{
    state={
        tableKey:Date.now(),
        submitLoading:false,
        selectedRowKeys:[],
    }
    toggleSubmitLoading(val){
        this.setState({submitLoading:val})
    }
    handleCancel=()=>{
        this.props.toggleModalVisible(false)
    }
    handleOk=()=>{
        if(this.state.selectedRowKeys.length===0){
            message.info('无可结转的项目分期')
            return;
        }
        let params = this.props.filters;
        params.stagesIds = this.state.selectedRowKeys;
        this.toggleSubmitLoading(true)
        request.post('/account/landPrice/deductedDetails/finish',params).then(({data})=>{
            if(data.code===200){
                message.success(`分期结转成功！`)
                this.props.toggleModalVisible(false)
                this.props.refreshTable && this.props.refreshTable();
            }else{
                message.error(`操作失败:${data.msg}`)
            }
            this.toggleSubmitLoading(false)
        }).catch(err=>{
            this.toggleSubmitLoading(false)
            message.error(err.message)
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.setState({
                    tableKey:Date.now()
                })
            },200)
        }
    }
    render(){
        const {tableKey,submitLoading} = this.state;
        const {visible,filters} = this.props;
        return <Modal
              title="分期结转"
              maskClosable={false} 
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              confirmLoading={submitLoading}
            >
                <Alert style={{marginBottom:15}} message="以下项目分期，期初销售建筑面积/分期可售建筑面积已达95%，请确认是否进行最后一次土地价款的抵减（如果是，请勾选并点击确认）" type="info" showIcon />
                <AsyncTable url="/account/landPrice/deductedDetails/loadFinishList"
                                updateKey={tableKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.stagesId,
                                    pagination:false,
                                    size:'small',
                                    columns:columns,
                                    rowSelection:{
                                        type: 'checkbox',
                                    },
                                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                                        this.setState({
                                            selectedRowKeys,
                                        })
                                    },
                                }} />
            </Modal>
    }
}

export default PopModal;

