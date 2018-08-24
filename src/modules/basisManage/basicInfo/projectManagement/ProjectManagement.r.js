// Created by liuliyuan on 2018/8/21
import React, { Component } from 'react'
import {Card,message,Form,Row,Col,Button,Modal,Icon} from 'antd'
import {request} from 'utils'
import {AsyncTable} from 'compoments'
import { SelectCell } from 'compoments/EditableCell'

const columns = (context) =>[{
    title: '利润中心名称',
    dataIndex: 'profitName',
    width:'100%',
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
    width:'100px',
}, {
    title: '项目分期代码',
    dataIndex: 'itemNum',
    width:'100px',
}, {
    title: '计税方法',
    dataIndex: 'taxMethod',
    width:'180px',
    className:'text-center',
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
        selectedRowTaxSubjectKeys:[],
        tableUpDateKey1:Date.now(),
        tableUpDateKey2:Date.now()+1,
        loading:false,
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
            selectedRowTaxSubjectKeys:[],
            selectedRowKeys:[]
        })
    }
    refreshTableTwo=()=>{
        this.mounted && this.setState({
            tableUpDateKey1: Date.now(),
            tableUpDateKey2: Date.now(),
            selectedRowKeys:[]
        })
    }
    refreshTableThree=()=>{
        this.mounted && this.setState({
            tableUpDateKey2: Date.now(),
        })
    }
    toggleLoading=(loading)=>{
        this.mounted && this.setState({loading})
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.toggleLoading(true)
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
                                this.toggleLoading(false)
                                if(data.code===200){
                                    if(parseInt(data.data, 0) > 0 ){
                                        message.success(
                                            <span>当前项目下还有<span style={{color:'red'}}> {data.data} </span>个项目分期的计税方法未维护！</span>
                                        );
                                    }else{
                                        message.success(`保存成功！`);
                                    }
                                    this.props.form.resetFields();
                                    this.refreshTableThree();
                                }else{
                                    message.error(`保存失败:${data.msg}`)
                                }
                            }).catch(err=>{
                            message.error(err.message)
                            this.toggleLoading(false)
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
        const {updateKey,selectedRowKeys,selectedRowTaxSubjectKeys,tableUpDateKey1,tableUpDateKey2} = this.state,
            taxSubjectId = this.props.match.params.id;
        const {getFieldDecorator} = this.props.form;
        return(
            <div>
                <div style={{ margin: "0px 0 6px 6px" }}>
                    <span style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12,cursor: 'pointer'}}
                        onClick={() => {
                            this.props.history.goBack();
                        }}
                    >
                        <Icon type="left" /><span>返回</span>
                    </span>
                </div>
                <Card
                    className="search-card"
                    title='项目信息管理'
                >
                    <Row gutter={8}>
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
                                                rowSelection:{
                                                    type: 'radio',
                                                },
                                                onRowSelect:(selectedRowKeys)=>{
                                                    this.mounted && this.setState({
                                                        selectedRowTaxSubjectKeys:selectedRowKeys,
                                                    },()=>{
                                                        this.refreshTableTwo()
                                                    })
                                                },
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
                                <AsyncTable url={`/taxsubject/projectByProfitCenter/${selectedRowTaxSubjectKeys && selectedRowTaxSubjectKeys[0]}`}
                                            updateKey={tableUpDateKey1}
                                            tableProps={{
                                                rowKey:record=>record.id,
                                                //pageSize:100,
                                                size:'small',
                                                rowSelection:{
                                                    type: 'radio',
                                                },
                                                onRowSelect:(selectedRowKeys)=>{
                                                    this.mounted && this.setState({
                                                        selectedRowKeys,
                                                    },()=>{
                                                        this.mounted && this.setState({
                                                            tableUpDateKey2: Date.now(),
                                                        })
                                                    })
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
            </div>
        )
    }
}
export default Form.create()(ProjectManagement)