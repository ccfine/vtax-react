/**Created by liurunbin 2017.12.20
 * */
import React,{Component} from 'react'
import {Button,Modal,Table,Card,message} from 'antd'
import {List} from 'immutable'
import {request} from '../../../../../utils'
import FileUpload from './FileUpload.r'
const confirm = Modal.confirm;
const constants = {
    PROJECT_NAME:'itemName',
    PROJECT_CODE:'itemNum',
}
const table_1_columns = [{
    title: '项目名称',
    dataIndex: constants.PROJECT_NAME,
}, {
    title: '项目代码',
    dataIndex: constants.PROJECT_CODE,
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
}];
export default class ProjectInformationManagement extends Component{
    state = {
        visible: false,
        selectedRowKeys:null,

        $$table_1_data:List([]),
        table_1_loaded:false,
        $$table_2_data:List([]),

    }
    toggleModal = visible => {
        this.setState({
            visible
        });
        visible && this.initData()
    }
    initData=()=>{
        this.fetchTable_1_Data();
        this.setState({
            selectedRowKeys:null
        })
    }
    fetchTable_1_Data = () =>{
        this.setState({
            table_1_loaded:false
        })
        request.get(`/project/list/${this.props.taxSubjectId}`)
            .then(({data})=>{
                if(data.code===200){
                    this.setState(prevState=>({
                        $$table_1_data:List(data.data.records),
                        table_1_loaded:true
                    }))
                }else{
                    message.error(`项目列表获取失败:${data.msg}`)
                }
            })
    }
    fetchTable_2_Data = projectId =>{
        request.get(`/project/stages/${projectId}`)
            .then(({data})=>{
                if(data.code===200){
                    this.setState(prevState=>({
                        $$table_2_data:List(data.data.records.map((item,i)=>{
                            item.index=i;
                            return item;
                        })),
                        table_1_loaded:true
                    }))
                }else{
                    message.error(`项目分期列表获取失败:${data.msg}`)
                }
            })
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys
        })
        this.fetchTable_2_Data(selectedRowKeys)
    }
    render(){
        const {$$table_1_data,table_1_loaded,$$table_2_data,selectedRowKeys} = this.state;
        const rowSelection = {
            type:'radio',
            onChange: this.onChange,
        };
        return(
            <div style={{display:'inline-block',...this.props.style}}>
                <span style={{
                    color:'#1890ff',
                    cursor:'pointer'
                }} onClick={()=>this.toggleModal(true)}>项目信息管理</span>
                <Modal
                    title="项目管理"
                    visible={this.state.visible}
                    width={1000}
                    onCancel={()=>this.toggleModal(false)}
                    footer={false}
                    bodyStyle={{
                        padding:10,
                        background:'#EEF0F4'
                    }}
                >
                    <Card
                        extra={
                            <div>
                                <FileUpload taxSubjectId={this.props.taxSubjectId} fetchTable_1_Data={this.fetchTable_1_Data} />
                                <Button size='small'
                                        onClick={()=>{
                                            confirm({
                                                title: '友情提醒',
                                                content: '该删除后将不可恢复，是否删除？',
                                                okText: '确定',
                                                okType: 'danger',
                                                cancelText: '取消',
                                                onOk() {
                                                    console.log('OK');
                                                },
                                                onCancel() {
                                                    console.log('Cancel');
                                                },
                                            });
                                        }}
                                        disabled={!selectedRowKeys}
                                        type='danger'>删除</Button>
                            </div>
                        }
                        bodyStyle={{padding:0}}
                        title="项目信息">
                        <Table
                            rowSelection={rowSelection}
                            size="small"
                            rowKey={record=>record.id}
                            loading={!table_1_loaded}
                            bordered={false}
                            pagination={false} dataSource={$$table_1_data.toArray()} columns={table_1_columns}/>
                    </Card>
                    <Card title="分期信息" bodyStyle={{padding:0}} style={{marginTop:10}}>
                        <Table
                            size="small"
                            rowKey={record=>record.index}
                            bordered={false}
                            pagination={false}
                            dataSource={$$table_2_data.toArray()}
                            columns={table_2_columns}/>
                    </Card>
                </Modal>
            </div>
        )
    }
}