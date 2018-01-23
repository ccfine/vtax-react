/**Created by liurunbin 2017.12.20
 * */
import React,{Component} from 'react'
import {Button,Modal,Icon,Table,Card,message} from 'antd'
import {List} from 'immutable'
import {request} from '../../../../../utils'
import {FileExport,AutoFileUpload} from '../../../../../compoments'
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
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }
    initData=()=>{
        this.fetchTable_1_Data();
        this.setState({
            selectedRowKeys:null,
            $$table_2_data:List([])
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
    handleDownload=()=>{
        let url =`${window.baseURL}${this.props.url}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
    }
    render(){
        const {$$table_1_data,table_1_loaded,$$table_2_data,selectedRowKeys} = this.state;
        const rowSelection = {
            type:'radio',
            onChange: this.onChange,
        };
        return(
            <div style={{display:'inline-block',...this.props.style}}>
                <Button size='small' disabled={this.props.disabled} onClick={()=>this.toggleModal(true)}>
                    <Icon type="plus-circle" />
                    项目信息管理
                </Button>
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
                                <AutoFileUpload url={`project/upload/${this.props.taxSubjectId}`} fetchTable_1_Data={this.fetchTable_1_Data} />
                                <FileExport
                                    url='project/download'
                                    title="模板下载"
                                    setButtonStyle={{marginTop:10,marginRight:5}}
                                    size='small'
                                />
                                <Button size='small'
                                    onClick={()=>{
                                        confirm({
                                            title: '友情提醒',
                                            content: '该删除后将不可恢复，是否删除？',
                                            okText: '确定',
                                            okType: 'danger',
                                            cancelText: '取消',
                                            onOk:()=>{

                                                request.delete(`/project/delete/${this.state.selectedRowKeys[0]}`)
                                                    .then(({data})=>{
                                                        if(data.code===200){
                                                            message.success('删除成功!');
                                                            this.initData();
                                                        }else{
                                                            message.error(data.msg)
                                                        }
                                                    })
                                            },
                                            onCancel:()=>{
                                                console.log('Cancel');
                                            },
                                        });
                                    }}
                                    disabled={!selectedRowKeys}
                                    type='danger'>
                                    <Icon type="delete" />
                                    删除
                                </Button>
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