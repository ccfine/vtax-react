// Created by liuliyuan on 2018/8/21
import React, { Component } from 'react'
import {Card,message,Form,Row,Col,Button,Modal} from 'antd'
import {request} from 'utils'
import {AsyncTable} from 'compoments'
import { SelectCell } from 'compoments/EditableCell'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const columns = (context) =>[{
    title: '利润中心名称',
    dataIndex: 'profitName',
    width:'100%',
    render:(text,record)=>{
        return <span style={pointerStyle} onClick={()=>{
            context.mounted && context.setState({
                    profitCenterId:record.id
                },()=>{
                    context.refreshTableTwo()
                })
            }}>{text}</span>;
    }
}];
const table_1_columns = [{
    title: '项目名称',
    dataIndex: 'itemName',
    width:'50%',
}, {
    title: '项目代码',
    dataIndex: 'itemNum',
    width:'50%',
}];
const table_2_columns = (context, getFieldDecorator) =>[{
    title: '项目分期名称',
    dataIndex: 'itemName',
    width:'25%',
}, {
    title: '项目分期代码',
    dataIndex: 'itemNum',
    width:'20%',
}, {
    title: '计税方法',
    dataIndex: 'taxMethod',
    width:'25%',
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

class ProjectManagement extends Component{
    state = {
        updateKey:Date.now(),
        selectedRowKeys:[],
        tableUpDateKey1:Date.now(),
        tableUpDateKey2:Date.now()+1,
        deleteLoading:false,
        profitCenterId:null,
    }
    componentDidMount(){
       const taxSubjectId = this.props.match.params.id;
        taxSubjectId && setTimeout(()=>{
            this.refreshTable()
        },300)
    }
    refreshTable=()=>{
        this.mounted && this.setState({
            updateKey: Date.now(),
            tableUpDateKey1: Date.now(),
            tableUpDateKey2: Date.now(),
            selectedRowKeys:[]
        })
    }
    refreshTableTwo=()=>{
        this.mounted && this.setState({
            tableUpDateKey1: Date.now(),
            tableUpDateKey2: Date.now(),
            //selectedRowKeys:[]
        })
    }
    refreshTableThree=()=>{
        this.mounted && this.setState({
            tableUpDateKey2: Date.now(),
            //selectedRowKeys:[]
        })
    }
    onChange=(selectedRowKeys) => {
        this.mounted && this.setState({
            selectedRowKeys,
            tableUpDateKey2: Date.now(),
        })
    }
    toggleDeleteLoading=(deleteLoading)=>{
        this.mounted && this.setState({deleteLoading})
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.toggleDeleteLoading(true)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //if(JSON.stringify(values) !=='{}'){
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
                            mainId: this.props.match.params.id
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
                                    this.refreshTableThree();
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
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {updateKey,selectedRowKeys,tableUpDateKey1,tableUpDateKey2,profitCenterId} = this.state,
            taxSubjectId = this.props.match.params.id;
        const {getFieldDecorator} = this.props.form;
        return(
            <Card
                className="search-card"
                title='项目信息管理'
            >
                <Row gutter={24}>
                    <Col span={6}>
                        <Card
                            title={'利润中心'}
                        >
                            <AsyncTable url={`/taxsubject/profitCenterList/${taxSubjectId}`}
                                        updateKey={updateKey}
                                        tableProps={{
                                            rowKey:record=>record.id,
                                            //pageSize:100,
                                            size:'small',
                                            columns:columns(this),
                                            pagination:false,
                                            scroll:{
                                                x:200,
                                                y:window.screen.availHeight-320,
                                            },
                                        }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            bodyStyle={{padding: '10px 20px'}}
                            title="项目信息">
                            <AsyncTable url={`/taxsubject/projectByProfitCenter/${profitCenterId}`}
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
                                                x:200,
                                                y:window.screen.availHeight-320,
                                            },
                                        }} />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card
                            title="分期信息"
                            bodyStyle={{padding: '10px 20px'}}
                            extra={
                                <Button disabled={selectedRowKeys.length<1} size='small' type="primary" onClick={this.handleSubmit}>保存</Button>
                            }
                        >
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
                                                    //x:700,
                                                    y:window.screen.availHeight-320,
                                                },
                                            }} />
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Card>

        )
    }
}
export default Form.create()(ProjectManagement)