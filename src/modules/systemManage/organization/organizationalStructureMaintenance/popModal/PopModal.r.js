/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules} from '../../../../../utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        initData:{

        },
        loaded:false
    }

    toggleLoaded = loaded => this.setState({loaded})
    fetchReportById = (id)=>{
        this.toggleLoaded(false)
        request.get(`/sys/dict/find/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    })
                }
            })
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData:{}
            })
        }
        if(nextProps.modalConfig.type === 'add'){
            this.setState({
                loaded:true
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            this.fetchReportById(nextProps.modalConfig.id)
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)

                if(type==='edit'){
                    const data = {
                        ...this.state.initData,
                        ...values
                    }
                    this.updateRecord(data)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/sys/dict/update',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('更新成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`更新失败:${data.msg}`)
                }
            })
    }

    createRecord = data =>{
        request.post('/sys/dict/add',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('新增成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`新增失败:${data.msg}`)
                }
            })
    }
    render(){
        const props = this.props;
        const {initData,loaded} = this.state;
        let title='';
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '添加';
                break;
            case 'edit':
                title = '编辑';
                break;
            default :
            //no default
        }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={800}
                style={{
                    maxWidth:'90%'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'200px'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'上级机构代码',
                                        fieldName:'code',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['code'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入上级机构代码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled: type==='edit'
                                        }
                                    }, {
                                        label:'上级机构名称',
                                        fieldName:'name',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['name'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入上级机构名称'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled: type==='edit'
                                        }
                                    }, {
                                        label:'机构代码',
                                        fieldName:'type',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['type'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入机构代码'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'机构名称',
                                        fieldName:'sortBy',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['sortBy'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入机构名称'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'机构简称',
                                        fieldName:'sortBy',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['sortBy'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入机构简称'
                                                }
                                            ]
                                        },
                                    }, {
                                        label: '经营地址',
                                        fieldName: 'sortBy',
                                        type: 'input',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: initData['sortBy'],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入经营地址'
                                                }
                                            ]
                                        },
                                    }, {
                                        label: '机构所在地',
                                        fieldName: 'sortBy',
                                        type: 'input',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: initData['sortBy'],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入机构所在地'
                                                }
                                            ]
                                        },
                                    }, {
                                        label: '本级序号',
                                        fieldName: 'sortBy',
                                        type: 'numeric',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: initData['sortBy'],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入本级序号'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            valueType:'int'
                                        },
                                    }
                                ])
                            }
                        </Row>
                    </Form>
                </Spin>

            </Modal>
        )
    }
}

export default Form.create()(PopModal)