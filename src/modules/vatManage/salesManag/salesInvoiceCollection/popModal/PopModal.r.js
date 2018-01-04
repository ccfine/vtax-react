/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin} from 'antd';
import {request,getFields,regRules} from '../../../../../utils'
import moment from 'moment'
const confirm = Modal.confirm
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

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    toggleLoaded = loaded => this.setState({loaded})
    fetchReportById = id=>{
        this.toggleLoaded(false)
        request.get(`/output/invoice/collection/get/${id}`)
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
            alert(1)
            if (!err) {
                console.log(values)
            }
        });

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
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={1920}
                style={{
                    maxWidth:'90%'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            {
                                type === 'edit' && <Button
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
                                    type='danger'>
                                    删除
                                </Button>
                            }
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'470px',overflowY:'scroll'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['mainId'],
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'税收分类编码',
                                        fieldName:'taxClassificationCoding',
                                        type:'taxClassCodingSelect',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxClassificationCoding'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择税收分类编码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            dataSource:[{
                                                value:initData['taxClassificationCoding'],
                                                text:initData['taxClassificationCodingNum']
                                            }]
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
                                            disabled
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
                                        fieldName:'taxableItem',
                                        type:'input',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableItem'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'发票号码',
                                        fieldName:'invoiceNum',
                                        type:'input',
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
                                        fieldDecoratorOptions:{
                                            initialValue:shouldShowDefaultData ? moment(`${initData['billingDate']}`,"YYYY-MM-DD") : undefined,
                                        },
                                        componentProps:{
                                            format:"YYYY-MM-DD",
                                            disabled
                                        },

                                    },
                                    {
                                        label:'商品名称',
                                        fieldName:'commodityName',
                                        type:'input',
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
                                        fieldDecoratorOptions:{
                                            initialValue:initData['amount'] ? `${initData['amount']}` : undefined,
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入金额'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'税率',
                                        fieldName:'taxRate',
                                        type:'numeric',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxRate'] ? `${initData['taxRate']}` : undefined,
                                            rules:[
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'税额',
                                        fieldName:'taxAmount',
                                        type:'numeric',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxAmount'] ? `${initData['taxAmount']}` : undefined,
                                            rules:[
                                                regRules.input_length_20,
                                                {
                                                    required:true,
                                                    message:'请输入税额'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'价税合计',
                                        fieldName:'totalAmount',
                                        type:'input',
                                        fieldDecoratorOptions:{
                                            initialValue:( parseFloat( getFieldValue('amount') ) +  parseFloat( getFieldValue('taxRate') ) ) || 0,
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
                                                span:2
                                            },
                                            wrapperCol:{
                                                span:22
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