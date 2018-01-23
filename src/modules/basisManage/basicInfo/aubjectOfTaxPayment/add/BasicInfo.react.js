/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:51
 * description  :
 */
import React, { Component } from 'react'
import {Form,Row,Col,Input,DatePicker,Select,Checkbox,Cascader,Icon,Card} from 'antd'
import moment from 'moment';
import {request,regRules,fMoney,requestDict} from '../../../../../utils'
import Industry from '../../../../../compoments/industry'
import './styles.less'

const FormItem = Form.Item;
const Option = Select.Option;

class BasicInfo extends Component {

    state = {

        defaultData:{},

        registrationType:[],
        taxpayerQualification:[],
        maximumLimit:[],
        selectOptions:[],

        IndustryModalKey:Date.now(),
        IndustryModalVisible: false,
    }

    handleKeyUp=(name)=> {
        const form = this.props.form;
        let value = form.getFieldValue(`${name}`).replace(/\$\s?|(,*)/g, '');
        form.setFieldsValue({
            [name]: value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        });
    }

    handleBlur=(name)=>{
        const form = this.props.form;
        let value = form.getFieldValue(`${name}`);
        //console.log(value,fMoney(value));

        form.setFieldsValue({
            [name]: fMoney(value),
        });
    }

    //注册类型:取基础资料DJZCLX
    getRegistrationType=()=>{
        requestDict('DJZCLX',result=>{
            this.setState({
                registrationType:result
            })
        })
    }
    //纳税人资质:取基础资料NSRLX
    getTaxpayerQualification=()=>{
        requestDict('NSRLX',result=>{
            this.setState({
                taxpayerQualification:result
            })
        })
    }
    //增值税专用发票最高限额:取基础资料ZZS_ZYFP_ZGXE
    getMaximumLimit=()=>{
        requestDict('ZZS_ZYFP_ZGXE',result=>{
            this.setState({
                maximumLimit:result
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
    }

    //根据id查询行业
    getIndustryTitle=(id)=>{
        request.get(`/taxsubject/get/industry/${id}`)
            .then(({data})=>{
                if(data.code ===200){
                    this.props.changeIndustry({
                        key:data.data.key,
                        title:data.data.title,
                    })
                }
            })
    }

    //弹出框
    showIndustryModal = () => {
        this.setState({
            IndustryModalVisible: true
        });
    }

    componentDidMount() {
        this.getRegistrationType()
        this.getTaxpayerQualification()
        this.getMaximumLimit()
        this.getlistArea()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.defaultData.industry && this.props.defaultData.industry !== nextProps.defaultData.industry ){
            this.getIndustryTitle(nextProps.defaultData.industry)
        }
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }

    getFields(start,end) {
        const {getFieldDecorator} = this.props.form;
        const {defaultData} = this.props;

        const dateFormat = 'YYYY-MM-DD';
        let disabled = this.props.type ==='view';
        let shouldShowDefaultData = false;
        if(this.props.type==='edit' || this.props.type==='view'){
            shouldShowDefaultData = true;
        }


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const children = [];
        const data = [
            {
                label: '编码',
                type: 'text',
                fieldName: 'jbxx.code',
                initialValue:defaultData.code,
                disabled:shouldShowDefaultData,
                rules: [
                    {
                        required: true, message: '请输入编码',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '纳税主体',
                type: 'text',
                fieldName: 'jbxx.name',
                initialValue:defaultData.name,
                disabled:shouldShowDefaultData,
                rules: [
                    {
                        required: true, message: '请输入纳税主体',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '社会信用代码',
                type: 'text',
                fieldName: 'jbxx.taxNum',
                initialValue:defaultData.taxNum,
                disabled:shouldShowDefaultData,
                rules: [
                    {
                        required: true, message: '请输入社会信用代码',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '管理单位公司注册证书营业执照号',
                type: 'text',
                fieldName: 'jbxx.busLicenseNum',
                initialValue:defaultData.busLicenseNum,
                disabled:shouldShowDefaultData,
                rules: [
                    {
                        required: true, message: '请输入管理单位公司注册证书营业执照号',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '所属行业',
                type: 'industry',
                fieldName: 'jbxx.industry',
                initialValue:this.props.industry.title,
                rules: [
                    {
                        required: true, message: '请选择所属行业',
                    }
                ],
            }, {
                label: '注册类型',
                type: 'select',
                fieldName: 'jbxx.registrationType',
                items: this.state.registrationType,
                initialValue:defaultData.registrationType,
                rules: [
                    {
                        required: true, message: '请选择注册类型',
                    }
                ],
            }, {
                label: '收入规模',
                type: 'select',
                fieldName: 'jbxx.scale',
                initialValue:defaultData.scale,
                items: [{
                    name: '100万以下',
                    id: '01',
                }, {
                    name: '100万~500万',
                    id: '02',
                }, {
                    name: '500万~1000万',
                    id: '03',
                }, {
                    name: '1000万~1亿',
                    id: '04',
                }, {
                    name: '1亿~10亿',
                    id: '05',
                }, {
                    name: '1亿~10亿',
                    id: '06',
                }]
            }, {
                label: '纳税人资质',
                type: 'select',
                fieldName: 'jbxx.taxpayerQualification',
                initialValue:defaultData.taxpayerQualification,
                items: this.state.taxpayerQualification,
                rules: [
                    {
                        required: true, message: '请选择纳税人资质',
                    }
                ],
            }, {
                label: '注册日期',
                type: 'rangePicker',
                fieldName: 'jbxx.registrationDate',
                initialValue: (shouldShowDefaultData && defaultData.registrationDate) ? moment(defaultData.registrationDate, dateFormat) :  null,
                rules: [
                    {
                        required: true, message: '请选择注册日期',
                    }
                ],
            }, {
                label: '开业日期',
                type: 'rangePicker',
                fieldName: 'jbxx.openingDate',
                initialValue:(shouldShowDefaultData && defaultData.openingDate) ? moment(defaultData.openingDate, dateFormat) :  null,
                rules: [
                    {
                        required: true, message: '请选择开业日期',
                    }
                ],
            }, {
                label: '经营期限',
                type: 'text',
                fieldName: 'jbxx.operatingPeriod',
                initialValue:defaultData.operatingPeriod,
                rules: [
                    {
                        required: true, message: '请输入经营期限',
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '营业状态',
                type: 'select',
                fieldName: 'jbxx.operatingStatus',
                initialValue:defaultData.operatingStatus,
                items: [{
                    name: '营业',
                    id: '01',
                }, {
                    name: '停业',
                    id: '02',
                }],
                rules: [
                    {
                        required: true, message: '请选择营业状态',
                    }
                ],
            }, {
                label: '生产经营地址',
                type: 'cascader',
                fieldName: 'jbxx.operatingProvince',
                initialValue:[defaultData.operatingProvince,defaultData.operatingCity,defaultData.operatingArea],
                items: this.state.selectOptions
            }, {
                label: '生产经营详细地址',
                type: 'text',
                fieldName: 'jbxx.operatingAddress',
                initialValue:defaultData.operatingAddress,
                noName:true,
                rules: [
                    {
                        max:regRules.input_length_50.max, message: regRules.input_length_50.message
                    }
                ],
            }, {
                label: '办公电话',
                type: 'text',
                fieldName: 'jbxx.officePhone',
                initialValue:defaultData.officePhone,
                rules: [
                    {
                        required: true, message: '请输入办公电话',
                    }
                ],
            }, {
                label: '开户银行',
                type: 'text',
                fieldName: 'jbxx.openingBank',
                initialValue:defaultData.openingBank,
                rules: [
                    {
                        required: true, message: '请输入开户银行',
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '银行账号',
                type: 'text',
                fieldName: 'jbxx.bankAccount',
                initialValue:defaultData.bankAccount,
                rules: [
                    {
                        required: true, message: '请输入银行账号',
                    },{
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '法定代表人',
                type: 'text',
                fieldName: 'jbxx.legalPerson',
                initialValue:defaultData.legalPerson,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '法人代表身份证号码',
                type: 'text',
                fieldName: 'jbxx.idCard',
                initialValue:defaultData.idCard,
                rules: [
                    {
                        pattern: regRules.not_chinese.pattern, message: regRules.not_chinese.message,
                    },{
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],

            }, {
                label: '财务负责人',
                type: 'text',
                fieldName: 'jbxx.financialOfficer',
                initialValue:defaultData.financialOfficer,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '税务经办人',
                type: 'text',
                fieldName: 'jbxx.operater',
                initialValue:defaultData.operater,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '经办人电话',
                type: 'text',
                fieldName: 'jbxx.operaterPhone',
                initialValue:defaultData.operaterPhone,
            }, {
                label: '增值税专用发票最高限额',
                type: 'select',
                fieldName: 'jbxx.maximumLimit',
                initialValue:defaultData.maximumLimit,
                items: this.state.maximumLimit
            }, {
                label: '税控机类型',
                type: 'text',
                fieldName: 'jbxx.machineType',
                initialValue:defaultData.machineType,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '注册资本原币币别',
                type: 'text',
                fieldName: 'jbxx.currencyType',
                initialValue:defaultData.currencyType,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '注册资本原币金额(万元)',
                type: 'text',
                fieldName: 'jbxx.currencyAmount',
                initialValue:fMoney(defaultData.currencyAmount),
                res:{
                    onKeyUp:(e)=>this.handleKeyUp('jbxx.currencyAmount'),
                    onBlur:(e)=>this.handleBlur('jbxx.currencyAmount'),
                },
            }, {
                label: '实收资本原币币别',
                type: 'text',
                fieldName: 'jbxx.receiptCurrencyType',
                initialValue:defaultData.receiptCurrencyType,
                rules: [
                    {
                        max:regRules.input_length_20.max, message: regRules.input_length_20.message,
                    }
                ],
            }, {
                label: '实收资本原币金额(万元)',
                type: 'text',
                fieldName: 'jbxx.receiptCurrencyAmount',
                initialValue:fMoney(defaultData.receiptCurrencyAmount),
                res:{
                    onKeyUp:(e)=>this.handleKeyUp('jbxx.receiptCurrencyAmount'),
                    onBlur:(e)=>this.handleBlur('jbxx.receiptCurrencyAmount'),
                },
            }, {
                label: '是否协同（喜盈佳）',
                type: 'checked',
                fieldName: 'jbxx.synergy',
                initialValue:defaultData.synergy,
            }, {
                label: '主管国税机关',
                type: 'cascader',
                fieldName: 'jbxx.nationalTaxProvince',
                initialValue:[defaultData.nationalTaxProvince,defaultData.nationalTaxCity,defaultData.nationalTaxArea],
                items: this.state.selectOptions
            }, {
                label: '主管国税机关详细地址',
                type: 'text',
                fieldName: 'jbxx.nationalTaxAddress',
                initialValue:defaultData.nationalTaxAddress,
                noName:true,
                rules: [
                    {
                        max:regRules.input_length_50.max, message: regRules.input_length_50.message,
                    }
                ],
            }, {
                label: '联系电话',
                type: 'text',
                fieldName: 'jbxx.nationalTaxPhone',
                initialValue:defaultData.nationalTaxPhone,
            }, {
                label: '主管地税机关',
                type: 'cascader',
                fieldName: 'jbxx.localTaxProvince',
                initialValue:[defaultData.localTaxProvince,defaultData.localTaxCity,defaultData.localTaxArea],
                items: this.state.selectOptions
            }, {
                label: '主管地税机关详细地址',
                type: 'text',
                fieldName: 'jbxx.localTaxAddress',
                initialValue:defaultData.localTaxAddress,
                noName:true,
                rules: [
                    {
                        max:regRules.input_length_50.max, message: regRules.input_length_50.message,
                    }
                ],
            }, {
                label: '联系电话',
                type: 'text',
                fieldName: 'jbxx.localTaxPhone',
                initialValue:defaultData.localTaxPhone,
            }, {
                label: '更新人',
                type: 'text',
                fieldName: 'jbxx.lastModifiedBy',
                initialValue:defaultData.lastModifiedBy,
            }, {
                label: '更新时间',
                type: 'text',
                fieldName: 'jbxx.lastModifiedDate',
                initialValue:defaultData.lastModifiedDate,
            }, {
                label: '当前状态',
                type: 'select',
                fieldName: 'jbxx.status',
                initialValue:`${defaultData.status}`,
                items: [{
                        name: '删除',
                        id: '0',
                    }, {
                        name: '保存',
                        id: '1',
                    }, {
                        name: '提交',
                        id: '2',
                }]
            }

        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;
            if (data[i].type === 'text') {
                inputComponent = <Input disabled={disabled || data[i].disabled} {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
            } else if (data[i].type === 'rangePicker') {
                inputComponent = <DatePicker disabled={disabled || data[i].disabled} placeholder={`请输入${data[i].label}`} format="YYYY-MM-DD" style={{width:'100%'}} />;
            } else if (data[i].type === 'select') {
                inputComponent = (
                    <Select disabled={disabled || data[i].disabled} placeholder="请选择">
                        {
                            data[i].items.map((item, i) => <Option key={i} value={`${item.id}`}>{item.name}</Option>)
                        }
                    </Select>
                )
            }else if(data[i].type ==='checked'){
                inputComponent = <Checkbox disabled={disabled || data[i].disabled}  />;
            }else if(data[i].type ==='cascader') {
                inputComponent = <Cascader disabled={disabled || data[i].disabled} options={data[i].items} placeholder={`请输入${data[i].label}`}/>;
            }else if(data[i].type ==='industry'){
                inputComponent = <Input disabled={true} placeholder={`请输入${data[i].label}`} addonAfter={<a style={{cursor: this.props.type ==='view' && 'not-allowed'}} onClick={this.props.type !=='view' ? this.showIndustryModal : null}>
                    <Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />
                </a>} />;
            }

            if(data[i].type ==='checked'){
                children.push(
                    <Col span={12} key={i}>
                        <FormItem {...formItemLayout} label={data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                valuePropName: 'checked',
                                initialValue: data[i].initialValue
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            } else if(data[i].type ==='cascader'){
                children.push(
                    <Col span={12} key={i}>
                        <FormItem {...formItemLayout} label={data[i].label} >
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            } else {
                children.push(
                    <Col span={12} key={i} >
                        <FormItem {...formItemLayout} label={data[i].noName === true ? null : data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue,
                                rules: data[i].rules,
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }

        }
        return children.slice(start, end || null);
    }

    render() {
        return (
            <div className="basicInfo" style={{height:'390px',overflow:'hidden',overflowY:'scroll'}}>

                <Card style={{marginBottom:16}}>
                    <Row gutter={40}>
                        {
                            this.getFields(0,14)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(14,18)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(18,19)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(19,24)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(24,28)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(28,29)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(29,32)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(32,34)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(34,this.props.type !== 'view' ? 35 : 38)
                        }
                    </Row>
                </Card>

                {/*所属行业弹出框*/}
                <Industry
                    key={this.state.IndustryModalKey}
                    name="jbxx.industry"
                    visible={this.state.IndustryModalVisible}
                    title="行业信息"
                    url="/taxsubject/list/industry"
                    changeVisable={ status =>{
                        this.setState({
                            IndustryModalVisible:status,
                            IndustryModalKey:Date.now()
                        })
                    }}
                    changeIndustry={this.props.changeIndustry.bind(this)}
                    form={this.props.form}
                />

            </div>
        )
    }
}
export default BasicInfo