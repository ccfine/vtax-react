/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,DatePicker} from 'antd';
import {request,regRules,fMoney,requestDict} from '../../../../../utils'
import {CusFormItem} from '../../../../../compoments'
import moment from 'moment';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
let timeout;
let currentValue;
function fetchTaxMain(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const fetch = ()=> {
        request.get(`/taxsubject/listByName`,{
            params:{
                name:value
            }
        })
            .then(({data}) => {
                if(data.code===200 && currentValue === value){

                    const result = data.data.records;
                    const newData = [];
                    result.forEach((r) => {
                        newData.push({
                            value: `${r.name}`,
                            text: r.name,
                        });
                    });
                    callback(newData);
                }
            });
    }

    timeout = setTimeout(fetch, 300);
}
class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        mainTaxItems:[
        ],
        initData:{

        }
    }


    getFields(start,end) {
        const props = this.props;
        const {getFieldDecorator} = this.props.form;
        const {initData} = this.state;

        let disabled =  props.modalConfig.type ==='view';

        const dateFormat = 'YYYY-MM-DD'
        let shouldShowDefaultData = false;
        if(props.modalConfig.type==='edit' || props.modalConfig.type==='view'){
            shouldShowDefaultData = true;
        }

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 3},
            wrapperCol: { span: 19 },
        };

        const children = [];
        const max20={
            max:regRules.input_20_lenght.max, message: regRules.input_20_lenght.message,
        }
        const max50={
            max:regRules.input_50_lenght.max, message: regRules.input_50_lenght.message,
        }
        const data = [
            {
                components:<CusFormItem.TaxMain
                    fieldName="mainId"
                    initialValue={initData.mainId}
                    formItemStyle={formItemLayout}
                    form={this.props.form}
                    fieldDecoratorOptions={{
                        rules:[
                            {
                                required:true,
                                message:'请选择纳税主体'
                            }
                        ]
                    }}
                />
            },{
                label: '进项结构分类',
                type: 'select',
                fieldName: 'incomeStructureType',
                initialValue:initData.incomeStructureType,
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
                }],
                rules: [
                    {
                        required: true, message: '请选择进项结构分类',
                    }
                ],
            }, {
                label: '发票类型',
                type: 'select',
                fieldName: 'invoiceType',
                initialValue:initData.invoiceType,
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
                }],
                rules: [
                    {
                        required: true, message: '请选择发票类型',
                    }
                ],
            }, {
                label: '发票号码',
                type: 'text',
                fieldName: 'invoiceNum',
                initialValue:initData.invoiceNum,
                rules: [
                    {
                        required: true, message: '请输入发票号码',
                    },{
                        ...max20
                    }
                ],
            }, {
                label: '发票代码',
                type: 'text',
                fieldName: 'invoiceCode',
                initialValue:initData.invoiceCode,
                rules:[
                    {
                        required:true,
                        message:'请输入发票号码'
                    },{
                ...max20
                    }
                ]
            }, {
                label: '开票日期',
                type: 'rangePicker',
                fieldName: 'billingDate',
                initialValue:(shouldShowDefaultData && initData.billingDate) ? moment(initData.billingDate, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            }, {
                label: '认证月份',
                type: 'monthPicker',
                fieldName: 'billingDate',
                initialValue:(shouldShowDefaultData && initData.billingDate) ? moment(initData.billingDate, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            }, {
                label: '认证时间',
                type: 'rangePicker',
                fieldName: 'authDate',
                initialValue:(shouldShowDefaultData && initData.authDate) ? moment(initData.authDate, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择认证时间'
                    }
                ]
            }, {
                label: '销货单位名称',
                type: 'text',
                fieldName: 'sellerName',
                initialValue: initData.sellerName,
                rules:[
                    {
                        required:true,
                        message:'请输入销货单位名称'
                    },{
                        ...max50
                    }
                ]
            }, {
                label: '纳税人识别号',
                type: 'text',
                fieldName: 'sellerTaxNum',
                initialValue:initData.sellerTaxNum,
                rules:[
                    {
                        required:true,
                        message:'请输入纳税人识别号'
                    },{
                    ...max20
                    }
                ]
            }, {
                label: '地址',
                type: 'text',
                fieldName: 'address',
                initialValue:initData.address,
                rules:[
                    {
                        required:true,
                        message:'请输入地址'
                    },{
                    ...max50
                    }
                ]
            }, {
                label: '电话',
                type: 'text',
                fieldName: 'phone',
                initialValue:initData.phone,
                rules:[
                    {
                        required:true,
                        message:'请输入电话'
                    },{
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    },{
                    ...max20
                    }
                ]
            }, {
                label: '开户行',
                type: 'text',
                fieldName: 'bank',
                initialValue:initData.bank,
                rules:[
                    {
                        required:true,
                        message:'请输入开户行'
                    },{
                    ...max20
                    }
                ]
            }, {
                label: '账号',
                type: 'text',
                fieldName: 'account',
                initialValue:initData.account,
                rules:[
                    {
                        required:true,
                        message:'请输入账号'
                    },{
                    ...max20
                    }
                ]
            }, {
                label: '金额',
                type: 'text',
                fieldName: 'jbxx.officePhone',
                initialValue:fMoney(initData.amount),
                disabled:true,
                rules:[
                    {
                        ...max20
                    }
                ]
            }, {
                label: '税额',
                type: 'text',
                fieldName: 'taxAmount',
                initialValue:fMoney(initData.taxAmount),
                disabled:true,
                rules: [
                    {
                        ...max20
                    }
                ],
            }, {
                label: '价税合计',
                type: 'text',
                fieldName: 'checkItems',
                initialValue:fMoney(initData.checkItems),
                disabled:true,
                rules: [
                    {
                        ...max20
                    }
                ],
            }, {
                label: '备注',
                type: 'text',
                fieldName: 'differential',
                initialValue:initData.differential,
                span:24,
                rules:[
                    {
                        max:regRules.textarea_100_lenght.max, message: regRules.textarea_100_lenght.message,
                    }
                ],
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;

            if(!data[i].components){
                if (data[i].type === 'text') {
                    inputComponent = <Input disabled={ data[i].disabled ? data[i].disabled : disabled} {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
                } else if (data[i].type === 'rangePicker') {
                    inputComponent = <DatePicker disabled={disabled} placeholder={`请输入${data[i].label}`} format="YYYY-MM-DD" style={{width:'100%'}} />;
                } else if (data[i].type === 'monthPicker') {
                    inputComponent = <MonthPicker disabled={disabled} placeholder={`请输入${data[i].label}`} format="YYYY-MM" style={{width:'100%'}} />;
                } else if (data[i].type === 'select') {
                    inputComponent = (
                        <Select disabled={disabled} placeholder="请选择">
                            {
                                data[i].items.map((item, i) => <Option key={i} value={`${item.id}`}>{item.name}</Option>)
                            }
                        </Select>
                    )
                }
            }else{
                inputComponent = data[i].components
            }

            if(!data[i].components) {
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        <FormItem
                            {...(data[i].span === 24 ? formItemLayout2 : formItemLayout)}
                            label={data[i].label}
                        >
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue,
                                rules: data[i].rules,
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }else{
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        {inputComponent}
                    </Col>
                );
            }


        }
        return children.slice(start, end || null);
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    onSearch = (value) => {
        fetchTaxMain(value, data => this.setState({ mainTaxItems:data }));
    }
    onSelect = (value,option)=>{
        this.setState({
            selectedId:value
        })
    }
    fetchReportById = id=>{
        request.get(`/report/get/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    const {setFieldsValue} = this.props.form
                }

                const {setFieldsValue} = this.props.form
                const d = {"id":1,"createdDate":"2017-12-20 17:34:19","lastModifiedDate":"2017-12-20 12:16:35","createdBy":null,"lastModifiedBy":"1","mainId":1,"mainName":"c2","checkSets":"查1","checkType":12,"checkStart":"2017-01-02","checkEnd":"2017-01-02","checkImplementStart":"2017-01-02","checkImplementEnd":"2017-01-02","documentNum":"文书编号","issue":null,"closingTime":"2017-12-12","checkItems":"hello","differential":'2',"taxPayment":null,"lateFee":'90000.0',"fine":'12121.12',"remark":'备注蚊子',"isAttachment":0,"orgId":"87e7511d51754da6a1a04de1b4c669ff"}
                this.setState({
                    initData:d,
                    mainTaxItems:[{
                        text:d.mainName,
                        value:d.mainId
                    }]
                })
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
    render(){
        const props = this.props;
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
        }
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form onSubmit={this.handleSubmit} style={{height:'330px',overflowY:'scroll'}}>
                    <Row>
                        {
                            this.getFields(0,3)
                        }
                    </Row>
                    <Row>
                        {
                            this.getFields(3,8)
                        }
                    </Row>
                    <Row>
                        {
                            this.getFields(8,17)
                        }
                    </Row>
                    <Row>
                        {
                            this.getFields(17,18)
                        }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)