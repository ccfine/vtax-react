/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules,fMoney} from '../../../../../utils'
import moment from 'moment'
const confirm = Modal.confirm;
const formItemStyle={
        labelCol:{
            span:9
        },
        wrapperCol:{
            span:15
        }
}
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
            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)
                for(let key in values){
                    if(moment.isMoment(values[key])){
                        values[key] = values[key].format('YYYY-MM-DD');
                    }
                    if(key ==='taxClassificationCoding'){
                        const taxClassificationCodingObj = values[key];
                        values[key] = taxClassificationCodingObj['id'];

                        //这个字段是选择之后带过来的，不需要手动输入
                        values['taxableProjectId'] = taxClassificationCodingObj['taxableProjectId'];
                    }

                    if(key==='taxAmount' || key === 'totalAmount'){
                        values[key] = values[key].replace(/,/g,'')
                    }
                }

                if(type==='edit'){
                    /**
                     * 这两个值没有在input里输入，所以需要手动带入
                     * */
                    values.id=this.state.initData['id'];
                    values.taxableProjectId = this.state.initData['taxableProjectId'];
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
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
        const {getFieldValue,setFieldsValue} = this.props.form
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
        let shouldShowDefaultData = false;
        if( (type==='edit' || type==='view') && loaded){
            shouldShowDefaultData = true;
        }
        if(type==='type'){
            disabled=true
        }

        const taxRateValue = getFieldValue('taxRate'),
            amountValue = getFieldValue('amount');
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
                    <Form style={{height:'420px',overflowY:'scroll'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['mainId'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                        formItemStyle,
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'税收分类编码',
                                        fieldName:'taxClassificationCoding',
                                        type:'taxClassCodingSelect',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxClassificationCodingNum'] ? {
                                                label:initData['taxClassificationCodingNum'] || '',
                                                key:initData['taxClassificationCoding'] || ''
                                            } : undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择税收分类编码'
                                                }
                                            ]
                                        },
                                        formItemStyle,
                                        componentProps:{
                                            disabled,
                                            conditionValue:getFieldValue('taxRate') ? {
                                                taxMethod:getFieldValue('taxMethod'),
                                                taxRate:getFieldValue('taxRate')
                                            } : {
                                                taxMethod:initData['taxMethod'],
                                                taxRate:initData['taxRate']
                                            },
                                            onChange:data=>{
                                                let type = parseInt(getFieldValue('taxMethod'),0);
                                                let rateValue = '';

                                                if(!!type){
                                                    if(type===1){
                                                        rateValue=getFieldValue('taxClassificationCoding').commonlyTaxRate
                                                    }
                                                    if(type===2){
                                                        rateValue=getFieldValue('taxClassificationCoding').simpleTaxRate
                                                    }
                                                    setFieldsValue({
                                                        taxRate:rateValue
                                                    })
                                                }

                                            }
                                        }
                                    },
                                    {
                                        label:'计税方法',
                                        fieldName:'taxMethod',
                                        type:'select',
                                        options:[
                                            {
                                                text:'一般计税方法',
                                                value:'1'
                                            },
                                            {
                                                text:'简易计税方法',
                                                value:'2'
                                            }
                                        ],
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxMethod'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择计税方法'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            onSelect:value=>{
                                                let rateValue = getFieldValue('taxClassificationCoding');
                                                if(rateValue){
                                                    if(parseInt(value,0)===1){
                                                        rateValue=getFieldValue('taxClassificationCoding').commonlyTaxRate
                                                    }
                                                    if(parseInt(value,0)===2){
                                                        rateValue=getFieldValue('taxClassificationCoding').simpleTaxRate
                                                    }
                                                    setFieldsValue({
                                                        taxRate:rateValue
                                                    })

                                                    if(amountValue){
                                                        let taxAmount = parseFloat(amountValue) * parseFloat(rateValue) / 100;
                                                        setFieldsValue({
                                                            taxAmount:fMoney(taxAmount),
                                                            totalAmount:fMoney( parseFloat(amountValue) + taxAmount )
                                                        })
                                                    }
                                                }

                                            }
                                        }
                                    },
                                    {
                                        label:'发票类型',
                                        fieldName:'invoiceType',
                                        type:'select',
                                        options:[
                                            {
                                                text:'专票',
                                                value:'s'
                                            },
                                            {
                                                text:'普票',
                                                value:'c'
                                            }
                                        ],
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceType'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择发票类型'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'应税项目',
                                        fieldName:'taxableProjectName',
                                        type:'input',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableProjectName'],
                                        },
                                        formItemStyle,
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'发票号码',
                                        fieldName:'invoiceNum',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceNum'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入发票号码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'发票代码',
                                        fieldName:'invoiceCode',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceCode'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入发票代码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            onChange:e=>{
                                                setFieldsValue({
                                                    'invoiceDetailNum':e.target.value
                                                })
                                            }
                                        }
                                    },
                                    {
                                        label:'发票明细号',
                                        fieldName:'invoiceDetailNum',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['invoiceDetailNum'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'开票日期',
                                        fieldName:'billingDate',
                                        type:'datePicker',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:shouldShowDefaultData ? moment(`${initData['billingDate']}`,"YYYY-MM-DD") : undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择开票日期'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            format:"YYYY-MM-DD",
                                            disabled
                                        }

                                    },
                                    {
                                        label:'商品名称',
                                        fieldName:'commodityName',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['commodityName'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入商品名称'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'规格型号',
                                        fieldName:'specificationModel',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['specificationModel'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'购货单位名称',
                                        fieldName:'purchaseName',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['purchaseName'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入购货单位名称'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'购方税号',
                                        fieldName:'purchaseTaxNum',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['purchaseTaxNum'],
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入购方税号'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'地址',
                                        fieldName:'address',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['address'],
                                            rules:[
                                                regRules.input_length_50
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'电话',
                                        fieldName:'phone',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['phone'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'开户行',
                                        fieldName:'bank',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['bank'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'帐号',
                                        fieldName:'account',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['account'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'金额',
                                        fieldName:'amount',
                                        type:'numeric',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['amount'] ? ( disabled ? `${fMoney(initData['amount'])}` : initData['amount'] ) : undefined,
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入金额'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            onChange:value=>{
                                                if(taxRateValue && value){
                                                    /**
                                                     * 如果有税率了，就计算税额和价税合计
                                                     * */
                                                    let taxAmount = parseFloat(value) * parseFloat(taxRateValue) / 100;
                                                    setFieldsValue({
                                                        taxAmount:fMoney(taxAmount),
                                                        totalAmount:fMoney( parseFloat(value) + taxAmount )
                                                    })
                                                }
                                            }
                                        }
                                    },
                                    {
                                        label:'税率',
                                        fieldName:'taxRate',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxRate'] ? `${initData['taxRate']}` : undefined,
                                        },
                                        componentProps:{
                                            disabled:true,
                                        }
                                    },
                                    {
                                        label:'税额',
                                        fieldName:'taxAmount',
                                        type:'numeric',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxAmount'] ? `${fMoney(initData['taxAmount'])}` : undefined,
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入税额'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'价税合计',
                                        fieldName:'totalAmount',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:fMoney(initData['totalAmount']) || undefined,
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'备注',
                                        fieldName:'remark',
                                        type:'input',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['remark'],
                                            rules:[
                                                regRules.input_length_50
                                            ]
                                        },
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:3
                                            },
                                            wrapperCol:{
                                                span:21
                                            }
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'收款人',
                                        fieldName:'payee',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['payee'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'复核',
                                        fieldName:'checker',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['checker'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'开票人',
                                        fieldName:'drawer',
                                        type:'input',
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['drawer'],
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
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