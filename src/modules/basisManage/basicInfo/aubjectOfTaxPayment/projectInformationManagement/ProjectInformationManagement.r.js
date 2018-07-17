/**Created by liurunbin 2017.12.20
 * */
import React,{Component} from 'react'
import {Modal,Card,message} from 'antd'
import {request} from 'utils'
import {AsyncTable} from 'compoments'
const table_1_columns = [{
    title: '项目名称',
    dataIndex: 'itemName',
}, {
    title: '项目代码',
    dataIndex: 'itemNum',
}];
const table_2_columns = [{
    title: '项目分期名称',
    dataIndex: 'itemName',
}, {
    title: '项目分期代码',
    dataIndex: 'itemNum',
}, {
    title: '计税方法',
    dataIndex: 'taxMethod',
    render:text=>{
        //1一般计税方法，2简易计税方法 ,
        text = parseInt(text,0);
        if(text===1){
            return '一般计税方法'
        }else if(text ===2){
            return '简易计税方法'
        }else{
            return ''
        }

    }
}];
export default class ProjectInformationManagement extends Component{
    state = {
        selectedRowKeys:null,
        tableUpDateKey1:Date.now(),
        tableUpDateKey2:Date.now()+1,
        deleteLoading:false,
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && !this.props.visible){
            setTimeout(()=>{
                this.refreshTable()
            },300) 
        }
    }
    refreshTable=()=>{
        this.setState({tableUpDateKey1:Date.now(),tableUpDateKey2:Date.now(),selectedRowKeys:null})
    }
    onChange=(selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            tableUpDateKey2:Date.now(),
        })
    }
    deleteData=()=>{
        if(!this.state.selectedRowKeys || this.state.selectedRowKeys.length===0){
            message.error('请选择')
            return;
        }
        this.toggleDeleteLoading(true)
        request.delete(`/project/delete/${this.state.selectedRowKeys[0]}`)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('删除成功!');
                            this.refreshTable()
                        }else{
                            message.error(data.msg)
                        }
                        this.toggleDeleteLoading(false)
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.toggleDeleteLoading(false)
                    })
    }
    toggleDeleteLoading=(deleteLoading)=>{
        this.setState({deleteLoading})
    }
    render(){
        const {selectedRowKeys,tableUpDateKey1,tableUpDateKey2} = this.state,
        {taxSubjectId} = this.props;
        return(
            <div style={{display:'inline-block',...this.props.style}}>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    title="项目管理"
                    visible={this.props.visible}
                    width={600}
                    onCancel={()=>this.props.toggleModal(false)}
                    footer={false}
                    style={{ top: '5%' }}
                    bodyStyle={{
                        background:'#EEF0F4',
                        height:450,
                        overflowY:'auto',
                    }}
                >
                    <Card
                        extra={
                            <div>
                                {/*
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'project/download',
                                },{
                                    type:'autoFileImport',
                                    url:`project/upload/${this.props.taxSubjectId}`,
                                    userPermissions:['1581005'],
                                    onSuccess:this.refreshTable,
                                },{
                                    type:'delete',
                                    icon:'delete',
                                    text:'删除',
                                    btnType:'danger',
                                    userPermissions:['1581008'],
                                    loading:deleteLoading,
                                    onClick:this.deleteData
                                }])
                            */}
                            </div>
                        }
                        bodyStyle={{padding:0}}
                        title="项目信息">
                        <AsyncTable url={`/taxsubject/projectList/${taxSubjectId}`}
                                    updateKey={tableUpDateKey1}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pageSize:10,
                                        size:'small',
                                        rowSelection:{
                                            type:'radio',
                                            onChange: this.onChange,
                                            selectedRowKeys:selectedRowKeys,
                                        },
                                        columns:table_1_columns,
                                        pagination:true,
                                    }} />
                     </Card>
                    <Card title="分期信息" bodyStyle={{padding:0}} style={{marginTop:10}}>
                        <AsyncTable url={`/taxsubject/stages/${selectedRowKeys && selectedRowKeys[0]}`}
                                    updateKey={tableUpDateKey2}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pageSize:10,
                                        size:'small',
                                        columns:table_2_columns,
                                        pagination:true,
                                    }} />
                    </Card>
                </Modal>
            </div>
        )
    }
}