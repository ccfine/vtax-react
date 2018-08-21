/**Created by liurunbin 2017.12.20
 * */
import React,{Component} from 'react'
import {Modal,Card,message,Form,Row,Col,Button,Alert} from 'antd'
import {request} from 'utils'
import {AsyncTable} from 'compoments'
import { SelectCell } from 'compoments/EditableCell'

const table_1_columns = [{
    title: '项目名称',
    dataIndex: 'itemName',
    width:'350px',
}, {
    title: '项目代码',
    dataIndex: 'itemNum',
    width:'350px',
}];
const table_2_columns = (context, getFieldDecorator) =>[{
    title: '项目分期名称',
    dataIndex: 'itemName',
    width:'250px',
}, {
    title: '项目分期代码',
    dataIndex: 'itemNum',
    width:'200px',
}, {
    title: '计税方法',
    dataIndex: 'taxMethod',
    width:'250px',
    render:(text,record)=>{
        //1一般计税方法，2简易计税方法 ,
        text = parseInt(text,0);
        if(text===1){
            return '一般计税方法'
        }else if(text ===2){
            return '简易计税方法'
        }else{
            return (
                <SelectCell
                    fieldName={`list[${record.id}].taxMethod`}
                    options={[
                        {
                            text:'一般计税方法',
                            value:'1',
                        },{
                            text:'简易计税方法',
                            value:'2',
                        }
                    ]}
                    //initialValue={record.taxMethod.toString()}
                    getFieldDecorator={getFieldDecorator}
                    fieldDecoratorOptions={{
                        rules:[
                            {
                                required:true,
                                message:'请选择计税方法'
                            }
                        ]
                    }}
                    /*componentProps={{
                        onChange:(value)=>context.handleChange(value,record)
                    }}*/
                />)
        }
    },

    /*render:text=>{
        //1一般计税方法，2简易计税方法 ,
        text = parseInt(text,0);
        if(text===1){
            return '一般计税方法'
        }else if(text ===2){
            return '简易计税方法'
        }else{
            return ''
        }

    }*/
}];
class ProjectInformationManagement extends Component{
    state = {
        selectedRowKeys:[],
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
        this.setState({tableUpDateKey1:Date.now(),tableUpDateKey2:Date.now(),selectedRowKeys:[]})
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
    handleReset = () => {
        this.props.form.resetFields();
        this.props.toggleModal(false)
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.toggleDeleteLoading(true)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //if(JSON.stringify(values) !=='{}'){
                    console.log(values)
                    let list = [];
                    for(let key in values){
                        for(let nKey in values[key]){
                            list = list.concat(
                                {
                                    ...values[key][nKey],
                                    id:nKey,
                                }
                            )
                        }
                    }
                    const modalRef = Modal.confirm({
                        title: '友情提醒',
                        content: '该数据保存后将不可修改，是否保存？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk:()=>{
                            modalRef && modalRef.destroy();
                            request.put('/project/stage/update',{
                                list:list,//.filter(item=>!!item.taxMethod)
                                mainId: this.props.taxSubjectId[0]
                            })
                                .then(({data})=>{
                                    this.toggleDeleteLoading(false)
                                    if(data.code===200){
                                        if(parseInt(data.data, 0) > 0 ){
                                            message.success(`当前数据保存成功，您还有${data.data}条数据未保存！`);
                                        }else{
                                            message.success(`所有数据全部保存成功！`);
                                        }
                                        this.props.form.resetFields();
                                        this.refreshTable();
                                    }else{
                                        message.error(`保存失败:${data.msg}`)
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
                //}
            }else{
                message.error(`分期信息的计税方法不能为空！`)
            }
        })
    }

    render(){
        const {selectedRowKeys,tableUpDateKey1,tableUpDateKey2} = this.state,
        {taxSubjectId} = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <div style={{display:'inline-block',...this.props.style}}>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    //title="项目管理"
                    title={
                        <Row>
                            <Col span={6} style={{padding:'8px 0'}}>
                                项目管理
                            </Col>
                            <Col span={12}>
                                <Alert style={{color: 'red'}} message="保存后不可修改！" type="warning" showIcon />
                            </Col>
                        </Row>
                    }
                    visible={this.props.visible}
                    width={800}
                    onCancel={()=>this.props.toggleModal(false)}
                    footer={
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <Button disabled={selectedRowKeys.length<1} type="primary" onClick={this.handleSubmit}>保存</Button>
                                <Button onClick={this.handleReset}>取消</Button>
                            </Col>
                        </Row>
                    }
                    style={{ top: '5%' }}
                    bodyStyle={{
                        background:'#EEF0F4',
                        height:500,
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
                                bodyStyle={{padding: '10px 20px'}}
                                title="项目信息">
                                <AsyncTable url={`/taxsubject/projectList/${taxSubjectId}`}
                                            updateKey={tableUpDateKey1}
                                            tableProps={{
                                                rowKey:record=>record.id,
                                                //pageSize:100,
                                                size:'small',
                                                rowSelection:{
                                                    type:'radio',
                                                    onChange: this.onChange,
                                                    selectedRowKeys:selectedRowKeys,
                                                },
                                                columns:table_1_columns,
                                                pagination:false,
                                                scroll:{
                                                    x:700,
                                                    y:150,
                                                },
                                            }} />
                            </Card>

                            <Card title="分期信息" bodyStyle={{padding: '10px 20px'}} style={{marginTop:10}}>
                                <Form onSubmit={this.handleSubmit}>
                                    <AsyncTable url={`/taxsubject/stages/${selectedRowKeys && selectedRowKeys[0]}`}
                                                updateKey={tableUpDateKey2}
                                                tableProps={{
                                                    rowKey:record=>record.id,
                                                    //pageSize:100,
                                                    size:'small',
                                                    columns:table_2_columns(this,getFieldDecorator),
                                                    pagination:false,
                                                    scroll:{
                                                        x:700,
                                                        y:150,
                                                    },
                                                }} />
                                </Form>
                            </Card>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(ProjectInformationManagement)