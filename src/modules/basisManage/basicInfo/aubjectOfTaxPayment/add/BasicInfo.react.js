/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:51
 * description  :
 */
import React, { Component } from 'react'
import {Row,Card,message} from 'antd'
import moment from 'moment';
import {request,getFields,regRules,requestDict,setFormat} from 'utils'
import './styles.less'

class BasicInfo extends Component {

    state = {

        defaultData:{},

        registrationType:[],
        taxpayerQualification:[],
        maximumLimit:[],
        selectOptions:[],
    }

    //注册类型:取基础资料DJZCLX
    getRegistrationType=()=>{
        requestDict('DJZCLX',result=>{
            this.setState({
                registrationType:setFormat(result)
            })
        })
    }
    //纳税人资质:取基础资料NSRLX
    getTaxpayerQualification=()=>{
        requestDict('NSRLX',result=>{
            this.setState({
                taxpayerQualification:setFormat(result)
            })
        })
    }
    //增值税专用发票最高限额:取基础资料ZZS_ZYFP_ZGXE
    getMaximumLimit=()=>{
        requestDict('ZZS_ZYFP_ZGXE',result=>{
            this.setState({
                maximumLimit:setFormat(result)
            })
        })
    }

    //省市区联动
    getlistArea=()=>{
        request.get('/taxsubject/list/area')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        selectOptions:data.data
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
            });
    }

    componentDidMount() {
        this.getRegistrationType()
        this.getTaxpayerQualification()
        this.getMaximumLimit()
        this.getlistArea()
    }

    componentWillReceiveProps(nextProps){
        //console.log(nextProps);
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }

    render() {

        const {defaultData} = this.props;
        const {getFieldValue} = this.props.form
        const dateFormat = 'YYYY-MM-DD';
        let disabled = this.props.type ==='view';
        let shouldShowDefaultData = false;
        if(this.props.type==='edit' || this.props.type==='view'){
            shouldShowDefaultData = true;
        }
        const formItemStyle={
            labelCol:{
                span:10
            },
            wrapperCol:{
                span:14
            }
        }
        return (
            <div className="basicInfo" style={{height:'350px',overflow:'hidden',overflowY:'auto'}}>

                <Card style={{marginBottom:16}}>
                    <Row>
                        {
                            getFields(this.props.form,[
                                {
                                    label:'编码',
                                    fieldName:'jbxx.code',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:shouldShowDefaultData
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.code,
                                        rules: [
                                            {
                                                required: true, message: '请输入编码',
                                            },{
                                                pattern: regRules.trim.pattern, message: regRules.trim.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'纳税主体',
                                    fieldName:'jbxx.name',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:shouldShowDefaultData
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.name,
                                        rules: [
                                            {
                                                required: true, message: '请输入纳税主体',
                                            },{
                                                pattern: regRules.trim.pattern, message: regRules.trim.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'社会信用代码',
                                    fieldName:'jbxx.taxNum',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:shouldShowDefaultData
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.taxNum,
                                        rules: [
                                            {
                                                required: true, message: '请输入社会信用代码',
                                            },{
                                                pattern: regRules.trim.pattern, message: regRules.trim.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'管理单位公司注册证书营业执照号',
                                    fieldName:'jbxx.busLicenseNum',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:shouldShowDefaultData
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.busLicenseNum,
                                        rules: [
                                            {
                                                required: true, message: '请输入管理单位公司注册证书营业执照号',
                                            },{
                                                pattern: regRules.trim.pattern, message: regRules.trim.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'所属行业',
                                    fieldName:'jbxx.industry',
                                    type:'industry',
                                    span:12,
                                    formItemStyle,
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData['industry'] ? {
                                            label:defaultData['industry'] || '',
                                            key:defaultData['industry'] || ''
                                        } : undefined,
                                        /*rules:[
                                            {
                                                required:true,
                                                message:'请选择所属行业'
                                            }
                                        ]*/
                                    },
                                    componentProps:{
                                        disabled,
                                        conditionValue:getFieldValue('jbxx.industry') ? {
                                            industry:getFieldValue('jbxx.industry')
                                        } : {
                                            industry:defaultData['industry']
                                        },
                                    }

                                },{
                                    label:'注册类型',
                                    fieldName:'jbxx.registrationType',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.registrationType,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.registrationType,
                                        /*rules: [
                                            {
                                                required: true, message: '请选择注册类型',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'收入规模',
                                    fieldName:'jbxx.scale',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:[{
                                        text: '100万以下',
                                        value: '01',
                                    }, {
                                        text: '100万~500万',
                                        value: '02',
                                    }, {
                                        text: '500万~1000万',
                                        value: '03',
                                    }, {
                                        text: '1000万~1亿',
                                        value: '04',
                                    }, {
                                        text: '1亿~10亿',
                                        value: '05',
                                    }, {
                                        text: '1亿~10亿',
                                        value: '06',
                                    }],
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.scale,
                                    }
                                },{
                                    label:'纳税人资质',
                                    fieldName:'jbxx.taxpayerQualification',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.taxpayerQualification,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.taxpayerQualification,
                                        /*rules: [
                                            {
                                                required: true, message: '请选择纳税人资质',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'注册日期',
                                    fieldName:'jbxx.registrationDate',
                                    type:'datePicker',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:(shouldShowDefaultData && defaultData.registrationDate) ? moment(defaultData.registrationDate, dateFormat) : undefined,
                                        /*rules: [
                                            {
                                                required: true, message: '请选择注册日期',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'开业日期',
                                    fieldName:'jbxx.openingDate',
                                    type:'datePicker',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:(shouldShowDefaultData && defaultData.openingDate) ? moment(defaultData.openingDate, dateFormat) : undefined,
                                        /*rules: [
                                            {
                                                required: true, message: '请选择开业日期',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'经营期限',
                                    fieldName:'jbxx.operatingPeriod',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.operatingPeriod,
                                        rules: [
                                            /*{
                                                required: true, message: '请输入经营期限',
                                            },*/{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'营业状态',
                                    fieldName:'jbxx.operatingStatus',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:[{
                                        text: '营业',
                                        value: '01',
                                    }, {
                                        text: '停业',
                                        value: '02',
                                    }],
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.operatingStatus,
                                        /*rules: [
                                            {
                                                required: true, message: '请选择营业状态',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'生产经营地址',
                                    fieldName:'jbxx.operatingProvince',
                                    type:'cascader',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.selectOptions,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:(defaultData.operatingProvince && [defaultData.operatingProvince,defaultData.operatingCity,defaultData.operatingArea]) || [],
                                    }
                                },{
                                    label:'生产经营详细地址',
                                    fieldName:'jbxx.operatingAddress',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.operatingAddress,
                                        rules: [
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ],
                                    }
                                },{
                                    label:'办公电话',
                                    fieldName:'jbxx.officePhone',
                                    type:'input',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:5
                                        },
                                        wrapperCol:{
                                            span:7
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.officePhone,
                                        /*rules: [
                                            {
                                                required: true, message: '请输入办公电话',
                                            }
                                        ],*/
                                    }
                                },{
                                    label:'开户银行',
                                    fieldName:'jbxx.openingBank',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.openingBank,
                                        rules: [
                                            /*{
                                                required: true, message: '请输入开户银行',
                                            },*/{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'银行账号',
                                    fieldName:'jbxx.bankAccount',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.bankAccount,
                                        rules: [
                                            /*{
                                                required: true, message: '请输入银行账号',
                                            },*/{
                                                pattern: regRules.number.pattern, message: regRules.number.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'法定代表人',
                                    fieldName:'jbxx.legalPerson',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.legalPerson,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'法人代表身份证号码',
                                    fieldName:'jbxx.idCard',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.idCard,
                                        rules: [
                                            {
                                                pattern: regRules.not_chinese.pattern, message: regRules.not_chinese.message,
                                            },{
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'财务负责人',
                                    fieldName:'jbxx.financialOfficer',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.financialOfficer,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'税务经办人',
                                    fieldName:'jbxx.operater',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.operater,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'经办人电话',
                                    fieldName:'jbxx.operaterPhone',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.operaterPhone,
                                    }
                                },{
                                    label:'增值税专用发票最高限额',
                                    fieldName:'jbxx.maximumLimit',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.maximumLimit,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.maximumLimit,
                                    }
                                },{
                                    label:'税控机类型',
                                    fieldName:'jbxx.machineType',
                                    type:'input',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:5
                                        },
                                        wrapperCol:{
                                            span:7
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.machineType,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'注册资本原币币别',
                                    fieldName:'jbxx.currencyType',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.currencyType,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'注册资本原币金额(万元)',
                                    fieldName:'jbxx.currencyAmount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.currencyAmount,
                                    }
                                },{
                                    label:'实收资本原币币别',
                                    fieldName:'jbxx.receiptCurrencyType',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.receiptCurrencyType,
                                        rules: [
                                            {
                                                max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                                            }
                                        ],
                                    }
                                },{
                                    label:'实收资本原币金额(万元)',
                                    fieldName:'jbxx.receiptCurrencyAmount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.receiptCurrencyAmount,
                                    }
                                },{
                                    label:'是否协同（喜盈佳）',
                                    fieldName:'synergy',
                                    type:'checkbox',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:5
                                        },
                                        wrapperCol:{
                                            span:7
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.synergy,
                                    }
                                },{
                                    label:'主管国税机关',
                                    fieldName:'jbxx.nationalTaxProvince',
                                    type:'cascader',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.selectOptions,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:(defaultData.nationalTaxProvince && [defaultData.nationalTaxProvince,defaultData.nationalTaxCity,defaultData.nationalTaxArea]) || [],
                                    }
                                },{
                                    label:'主管国税机关详细地址',
                                    fieldName:'jbxx.nationalTaxAddress',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.nationalTaxAddress,
                                        rules: [
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ],
                                    }
                                },{
                                    label:'联系电话',
                                    fieldName:'nationalTaxPhone',
                                    type:'input',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:5
                                        },
                                        wrapperCol:{
                                            span:7
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.nationalTaxPhone,
                                    }
                                },{
                                    label:'主管地税机关',
                                    fieldName:'jbxx.localTaxProvince',
                                    type:'cascader',
                                    span:12,
                                    formItemStyle,
                                    options:this.state.selectOptions,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:(defaultData.localTaxProvince && [defaultData.localTaxProvince,defaultData.localTaxCity,defaultData.localTaxArea]) || [],
                                    }
                                },{
                                    label:'主管地税机关详细地址',
                                    fieldName:'jbxx.localTaxAddress',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.localTaxAddress,
                                        rules: [
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ],
                                    }
                                },{
                                    label:'联系电话',
                                    fieldName:'jbxx.localTaxPhone',
                                    type:'input',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:5
                                        },
                                        wrapperCol:{
                                            span:7
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.localTaxPhone,
                                    }
                                }
                            ])
                        }

                        {
                            this.props.type !== 'add' && getFields(this.props.form,[
                                {/*
                                    label:'更新人',
                                    fieldName:'jbxx.lastModifiedBy',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:true
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.lastModifiedBy,
                                    }
                                },{
                                    label:'更新时间',
                                    fieldName:'jbxx.lastModifiedDate',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:true
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.lastModifiedDate,
                                    }
                                },{*/
                                    label:'当前状态',
                                    fieldName:'jbxx.status',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:[{
                                        text: '删除',
                                        value: '0',
                                    }, {
                                        text: '保存',
                                        value: '1',
                                    }, {
                                        text: '提交',
                                        value: '2',
                                    }],
                                    componentProps:{
                                        disabled:true
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:`${defaultData.status}`,
                                    }
                                }
                            ])
                        }

                    </Row>
                </Card>
            </div>
        )
    }
}
export default BasicInfo