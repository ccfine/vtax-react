/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:51
 * description  :
 */
import React, { Component } from 'react'
import {Form,Row,Col,Input,DatePicker,Select,Checkbox,Cascader,InputNumber,Icon,Card} from 'antd'
import {request,regRules,fMoney} from '../../../../../utils'
import Industry from '../../../../../compoments/industry'
import './styles.less'

const FormItem = Form.Item;
const Option = Select.Option;

class BasicInfo extends Component {

    state = {
        modalKey:Date.now()+'1',
        submitLoading:false,
        registrationType:[],
        taxpayerQualification:[],
        maximumLimit:[],
        selectOptions:[],

        IndustryModalKey:Date.now(),
        IndustryModalVisible: false,
        industry:{},
    }

    getFields(start,end) {
        const {getFieldDecorator} = this.props.form;
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
                rules: [
                    {
                        required: true, message: '请输入编码',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    }
                ],
            }, {
                label: '纳税主体',
                type: 'text',
                fieldName: 'jbxx.name',
                rules: [
                    {
                        required: true, message: '请输入纳税主体',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    }
                ],
            }, {
                label: '社会信用代码',
                type: 'text',
                fieldName: 'jbxx.taxNum',
                rules: [
                    {
                        required: true, message: '请输入社会信用代码',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    }
                ],
            }, {
                label: '管理单位公司注册证书营业执照号',
                type: 'text',
                fieldName: 'jbxx.busLicenseNum',
                rules: [
                    {
                        required: true, message: '请输入管理单位公司注册证书营业执照号',
                    },{
                        pattern: regRules.trim.pattern, message: regRules.trim.message,
                    }
                ],
            }, {
                label: '注册类型',
                type: 'select',
                fieldName: 'jbxx.registrationType',
                items: this.state.registrationType,
                rules: [
                    {
                        required: true, message: '请选择注册类型',
                    }
                ],
            }, {
                label: '收入规模',
                type: 'select',
                fieldName: 'jbxx.scale',
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
                rules: [
                    {
                        required: true, message: '请选择注册日期',
                    }
                ],
            }, {
                label: '开业日期',
                type: 'rangePicker',
                fieldName: 'jbxx.openingDate',
                rules: [
                    {
                        required: true, message: '请选择开业日期',
                    }
                ],
            }, {
                label: '经营期限',
                type: 'text',
                fieldName: 'jbxx.operatingPeriod',
                rules: [
                    {
                        required: true, message: '请输入经营期限',
                    }
                ],
            }, {
                label: '营业状态',
                type: 'select',
                fieldName: 'jbxx.operatingStatus',
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
                items: this.state.selectOptions
            }, {
                label: '生产经营详细地址',
                type: 'text',
                fieldName: 'jbxx.operatingAddress',
                noName:true,
            }, {
                label: '办公电话',
                type: 'text',
                fieldName: 'jbxx.officePhone',
                rules: [
                    {
                        required: true, message: '请输入办公电话',
                    },{
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    }
                ],
            }, {
                label: '开户银行',
                type: 'text',
                fieldName: 'jbxx.openingBank',
                rules: [
                    {
                        required: true, message: '请输入开户银行',
                    }
                ],
            }, {
                label: '银行账号',
                type: 'text',
                fieldName: 'jbxx.bankAccount',
                rules: [
                    {
                        required: true, message: '请输入银行账号',
                    },{
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    }
                ],
            }, {
                label: '法定代表人',
                type: 'text',
                fieldName: 'jbxx.legalPerson'
            }, {
                label: '法人代表身份证号码',
                type: 'text',
                fieldName: 'jbxx.idCard',
                rules: [
                    {
                        pattern: regRules.not_chinese.pattern, message: regRules.not_chinese.message,
                    }
                ],

            }, {
                label: '财务负责人',
                type: 'text',
                fieldName: 'jbxx.financialOfficer'
            }, {
                label: '税务经办人',
                type: 'text',
                fieldName: 'jbxx.operater'
            }, {
                label: '经办人电话',
                type: 'text',
                fieldName: 'jbxx.operaterPhone',
                rules: [
                    {
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    }
                ],
            }, {
                label: '增值税专用发票最高限额',
                type: 'select',
                fieldName: 'jbxx.maximumLimit',
                items: this.state.maximumLimit
            }, {
                label: '税控机类型',
                type: 'text',
                fieldName: 'jbxx.machineType'
            }, {
                label: '注册资本原币币别',
                type: 'text',
                fieldName: 'jbxx.currencyType'
            }, {
                label: '注册资本原币金额(万元)',
                type: 'inputNumber',
                fieldName: 'jbxx.currencyAmount',
                res:{
                    formatter:value => fMoney(value),
                    parser:value => value.replace(/\$\s?|(,*)/g, ''),
                }
            }, {
                label: '实收资本原币币别',
                type: 'text',
                fieldName: 'jbxx.receiptCurrencyType'
            }, {
                label: '实收资本原币金额(万元)',
                type: 'inputNumber',
                fieldName: 'jbxx.receiptCurrencyAmount',
                initialValue:'',
                res:{
                    formatter:value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser:value => value.replace(/\$\s?|(,*)/g, ''),
                    onBlur:this.handleBlur,
                }
            }, {
                label: '是否协同（喜盈佳）',
                type: 'checked',
                fieldName: 'jbxx.synergy',
                initialValue:false,
            }, {
                label: '主管国税机关',
                type: 'cascader',
                fieldName: 'jbxx.nationalTaxProvince',
                items: this.state.selectOptions
            }, {
                label: '主管国税机关详细地址',
                type: 'text',
                fieldName: 'jbxx.nationalTaxAddress',
                noName:true,
            }, {
                label: '联系电话',
                type: 'text',
                fieldName: 'jbxx.nationalTaxPhone',
                rules: [
                    {
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    }
                ],
            }, {
                label: '主管地税机关',
                type: 'cascader',
                fieldName: 'jbxx.localTaxProvince',
                items: this.state.selectOptions
            }, {
                label: '主管地税机关详细地址',
                type: 'text',
                fieldName: 'jbxx.localTaxAddress',
                noName:true,
            }, {
                label: '联系电话',
                type: 'text',
                fieldName: 'jbxx.localTaxPhone',
                rules: [
                    {
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    }
                ],
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;
            if (data[i].type === 'text') {
                inputComponent = <Input placeholder={`请输入${data[i].label}`}/>;
            } else if (data[i].type === 'rangePicker') {
                inputComponent = <DatePicker placeholder={`请输入${data[i].label}`} />;
            } else if (data[i].type === 'select') {
                inputComponent = (
                    <Select placeholder="请选择">
                        {
                            data[i].items.map((item, i) => <Option key={i} value={`${item.id}`}>{item.name}</Option>)
                        }
                    </Select>
                )
            }else if(data[i].type ==='checked'){
                inputComponent = <Checkbox  />;
            }else if(data[i].type ==='cascader'){
                inputComponent = <Cascader options={data[i].items} placeholder={`请输入${data[i].label}`} />;
            }else if(data[i].type === 'inputNumber'){
                inputComponent = <InputNumber {...data[i].res} style={{width:'100%'}} />
            }

            if(data[i].type === 'rangePicker'){
                children.push(
                    <Col span={12} key={i}>
                        <FormItem {...formItemLayout} label={data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            } else if(data[i].type ==='checked'){
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
                                initialValue:[],
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
                                initialValue: data[i].initialValue || '',
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

    handleBlur=(e)=>{
        console.log(e);
        console.log(e.target.value)
        console.log(fMoney(e.target.value));
       return e.target.value = fMoney(e.target.value)
    }

    //注册类型:取基础资料DJZCLX
    getRegistrationType=()=>{
        request.get('/sys/dict/listBaseInfo/DJZCLX')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        registrationType:data.data
                    })
                }
            })
    }
    //纳税人资质:取基础资料NSRLX
    getTaxpayerQualification=()=>{
        request.get('/sys/dict/listBaseInfo/NSRLX')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        taxpayerQualification:data.data
                    })
                }
            })
    }
    //增值税专用发票最高限额:取基础资料ZZS_ZYFP_ZGXE
    getMaximumLimit=()=>{
        request.get('/sys/dict/listBaseInfo/ZZS_ZYFP_ZGXE')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        maximumLimit:data.data
                    })
                }
            })
    }

    //省市区联动
    getlistArea=()=>{
        request.get('/taxsubject/listArea')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        selectOptions:data.data
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

    //给其它组件传数据
    changeIndustry=industry=>{
        this.mounted && this.setState({
            industry
        })
    }

    onChange = (value, selectedOptions) => {
        console.log(value)
        console.log(selectedOptions)
        /*this.setState({
            text: selectedOptions.map(o => o.label).join(', '),
        });*/
    }

    componentDidMount() {
        this.getRegistrationType()
        this.getTaxpayerQualification()
        this.getMaximumLimit()
        this.getlistArea()
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {

        const {getFieldDecorator} = this.props.form;

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
        const formInnerLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 19
            },
        };
        const formTailLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16, offset: 6
            },
        };

        const SearchAfter = (
            <a onClick={this.showIndustryModal}>
                <Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />
            </a>
        );

        return (
            <div className="basicInfo">
                <Card style={{marginBottom:16}}>
                    <Row gutter={40}>
                        {
                            this.getFields(0,4)
                        }
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='所属行业'>
                                {getFieldDecorator('jbxx.industry', {
                                    initialValue: this.state.industry.title || '',
                                    rules: [
                                        {
                                            required: true, message: '请选择所属行业',
                                        }
                                    ],
                                })(
                                    <Input placeholder="请选择所属行业" addonAfter={SearchAfter} />
                                )}
                            </FormItem>
                        </Col>
                        {
                           this.getFields(4,13)
                        }
                    </Row>
                </Card>

                {/*办公电话*/}
                <Card style={{marginBottom:16}}>
                    <Row gutter={40}>
                        {
                            this.getFields(13,14)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(14,18)
                        }
                    </Row>
                </Card>

                {/*财务负责人*/}
                <Card style={{marginBottom:16}}>
                    <Row gutter={40}>
                        {
                            this.getFields(18,19)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(19,27)
                        }
                    </Row>
                </Card>

                {/*是否协同（喜盈佳）*/}
                <Card>
                    <Row gutter={40}>
                        {
                            this.getFields(27,28)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(28,30)
                        }
                    </Row>

                    {/*联系电话*/}

                    <Row gutter={40}>
                        {
                            this.getFields(30,31)
                        }
                    </Row>
                    <Row gutter={40}>
                        {
                            this.getFields(31,33)
                        }
                    </Row>

                    {/*联系电话*/}
                    <Row gutter={40}>
                        {
                            this.getFields(33,34)
                        }
                    </Row>
                </Card>

                {/*所属行业弹出框*/}
                <Industry
                    key={this.state.IndustryModalKey}
                    visible={this.state.IndustryModalVisible}
                    title="行业信息"
                    url="/taxsubject/listIndustry"
                    changeVisable={ status =>{
                        this.setState({
                            IndustryModalVisible:status,
                            IndustryModalKey:Date.now()
                        })
                    }}
                    changeIndustry={this.changeIndustry.bind(this)}
                />

            </div>
        )
    }
}
export default BasicInfo