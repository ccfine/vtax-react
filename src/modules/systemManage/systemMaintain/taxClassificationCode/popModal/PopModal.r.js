/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules,requestDict,setFormat} from 'utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={

        initData:{},
        simpleTaxRate:[],
        commonlyTaxRate:[],
        businessType:[],
        loaded:false,
    }

    toggleLoaded = loaded => this.setState({loaded})
    fetchReportById = (id)=>{
        this.toggleLoaded(false)
        request.get(`/tax/classification/coding/get/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    },()=>{
                        this.getCommonlyTaxRate(data.data.taxableProjectId)
                        this.getSimpleTaxRate(data.data.taxableProjectId)
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)
                const data = values.taxableProjectName;
                if(data.label && data.key){
                    values.taxableProjectName = data.label
                    values.taxableProjectId = data.key || this.state.initData['taxableProjectId'];
                }
                if(type==='edit'){
                    if(this.props.modalConfig.id){
                        values['id'] = this.props.modalConfig.id;
                    }
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }
    updateRecord = data =>{
        request.put('/tax/classification/coding/update',data)
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
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }

    createRecord = data =>{
        request.post('/tax/classification/coding/save',data)
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
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }

    //根据应税项目查询一般计税方法税率列表
    getCommonlyTaxRate=(data)=>{
        request.get(`/sys/taxrate/list/commonlyTaxRate/by/${data}`)
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        commonlyTaxRate:setFormat(data.data),
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    //根据应税项目查询简易计税方法税率列表
    getSimpleTaxRate=(data)=>{
        request.get(`/sys/taxrate/list/simpleTaxRate/by/${data}`)
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        simpleTaxRate:setFormat(data.data),
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentDidMount(){
        //业务类型
        requestDict('YWXT',result=>{
            this.setState({
                businessType: setFormat(result)
            })
        });
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
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
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.fetchReportById(nextProps.modalConfig.id)
        }
    }
    render(){
        const props = this.props;
        const {setFieldsValue} = props.form
        const {initData,loaded} = this.state;
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                title = '编辑';
                break;
            default :
            //no default
        }
        const formItemStyle={
            labelCol:{
                span:10
            },
            wrapperCol:{
                span:14
            }
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
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
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
                                        label:'税收分类编码',
                                        fieldName:'num',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['num'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入税收分类编码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled: type==='edit'
                                        }
                                    }, {
                                        label:'商品名称',
                                        fieldName:'commodityName',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['commodityName'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入商品名称'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }

                                    }, {
                                        label:'业务类型',
                                        fieldName:'businessType',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        options:this.state.businessType,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['businessType'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入业务类型'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },{
                                        label:'应税项目',
                                        fieldName:'taxableProjectName',
                                        type:'taxableProject',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableProjectName'] ? {
                                                label:initData['taxableProjectName'] || '',
                                                key:initData['taxableProjectId'] || ''
                                            } : undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择应税项目'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                            onChange: data => {
                                                this.getCommonlyTaxRate(data.key)
                                                this.getSimpleTaxRate(data.key)
                                                setFieldsValue({
                                                    commonlyTaxRateId: data.commonlyTaxRateId,
                                                    simpleTaxRateId: data.simpleTaxRateId,
                                                });
                                            }
                                        }
                                    }, {
                                        label:'一般增值税税率',
                                        fieldName:'commonlyTaxRateId',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        notShowAll:true,
                                        options:this.state.commonlyTaxRate,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['commonlyTaxRateId'],
                                        },
                                    }, {
                                        label:'简易增值税税率',
                                        fieldName:'simpleTaxRateId',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        notShowAll:true,
                                        options:this.state.simpleTaxRate,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['simpleTaxRateId'],
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