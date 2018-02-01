/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules} from '../../../../../utils'

const confirm = Modal.confirm;
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
    fetchReportById = (id,props)=>{
        this.toggleLoaded(false)
        request.get(`/output/invoice/collection/get/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    },()=>{

                        if(props.type==='edit'){
                            //根据税收分类编码的值去查询整条税收分类编码，因为税率会根据这条数据的值自动变化，所以需要这条数据源
                            request.get(`/tax/classification/coding/get/${data.data.taxClassificationCoding}`)
                                .then(({data})=>{
                                    if(data.code===200){
                                        props.form.setFieldsValue({
                                            'taxClassificationCoding':{
                                                ...data.data,
                                                label:data.data.num,
                                                key:data.data.id
                                            }
                                        })
                                    }
                                })
                        }

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
            this.fetchReportById(nextProps.modalConfig.id,nextProps)
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            this.props.toggleModalVisible(false);
            this.props.refreshTable()
            /*if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)

                if(type==='edit'){
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }*/
        });

    }

    updateRecord = data =>{
        request.put('/output/invoice/collection/update',data)
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
        request.post('/output/invoice/collection/save',data)
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

    deleteRecord = id => {
        request.delete(`/output/invoice/collection/delete/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('删除成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            })
    }

    render(){
        const props = this.props;
        const {initData,loaded} = this.state;
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '添加';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                disabled=true;
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
                    type !== 'view' ? <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            {
                                type === 'edit' && <Button
                                    onClick={()=>{
                                        if( parseInt(initData['sourceType'],0)!==1 ){
                                            message.error('只能删除手工新增的数据');
                                            return false;
                                        }
                                        confirm({
                                            title: '友情提醒',
                                            content: '该删除后将不可恢复，是否删除？',
                                            okText: '确定',
                                            okType: 'danger',
                                            cancelText: '取消',
                                            onOk:()=>{
                                                this.toggleLoaded(false)
                                                this.deleteRecord(initData['id'])
                                            },
                                            onCancel() {

                                            },
                                        });
                                    }}
                                    type='danger'>
                                    删除
                                </Button>
                            }
                        </Col>
                    </Row> : null
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'200px'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'编码',
                                        fieldName:'taxableProjectName',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableProjectName'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入编码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    }, {
                                        label:'名称',
                                        fieldName:'invoiceNum',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceNum'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入名称'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    }, {
                                        label:'类型',
                                        fieldName:'invoiceDetailNum',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceDetailNum'],
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    }, {
                                        label:'排序',
                                        fieldName:'commodityName',
                                        type:'numeric',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['commodityName'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入排序'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            valueType:'int'
                                        },
                                    }, {
                                        label:'描述',
                                        fieldName:'invoiceCode',
                                        type:'textArea',
                                        span:'24',
                                        formItemStyle:{
                                            labelCol:{
                                                span:3
                                            },
                                            wrapperCol:{
                                                span:21
                                            },
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceCode'],
                                            rules:[
                                                regRules.textarea_length_100,
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                        }
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