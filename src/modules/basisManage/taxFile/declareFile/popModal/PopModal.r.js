/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,DatePicker} from 'antd';
import {request} from '../../../../../utils'
import {CusFormItem} from '../../../../../compoments'
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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

    handleSubmit = (e) => {
        e.preventDefault();
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
        const {mainTaxItems,initData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
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
        const dateFormat = 'YYYY-MM-DD'
        let shouldShowDefaultData = false;
        if(type==='edit' || type==='view'){
            shouldShowDefaultData = true;
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
                <Form onSubmit={this.handleSubmit} style={{height:'470px',overflowY:'scroll'}}>
                    <Row>
                        <Col span={12}>
                            <CusFormItem.TaxMain fieldName="mainId" initialValue={initData.mainId} formItemStyle={formItemLayout} form={this.props.form} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='检查组' {...formItemLayout}>
                                {getFieldDecorator(`checkSets`,{
                                    initialValue:initData.checkSets,
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入检查组'
                                        }
                                    ]
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='检查类型' {...formItemLayout}>
                                {getFieldDecorator(`checkType`,{
                                    initialValue:initData.checkType,
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择检查类型'
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={disabled}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value={'1'}>类型1</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="检查期间起止"
                            >
                                {getFieldDecorator('checkImplement', {
                                    initialValue:shouldShowDefaultData ?[moment(initData.checkImplementStart, dateFormat), moment(initData.checkImplementEnd, dateFormat)] :[null,null],
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择检查期间起止'
                                        }
                                    ]
                                })(
                                    <RangePicker disabled={disabled} style={{width:'100%'}} format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="检查实施时间起止"
                            >
                                {getFieldDecorator('check', {
                                    initialValue:shouldShowDefaultData ?[moment(initData.checkStart, dateFormat), moment(initData.checkEnd, dateFormat)]:[null,null],
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择检查实施时间起止'
                                        }
                                    ]
                                })(
                                    <RangePicker disabled={disabled} style={{width:'100%'}} format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='文书编号' {...formItemLayout}>
                                {getFieldDecorator(`documentNum`,{
                                    initialValue:initData.documentNum,
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入文书编号'
                                        }
                                    ]
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='主要争议点' {...formItemLayout2}>
                                {getFieldDecorator(`issue`,{
                                    initialValue:initData.issue
                                })(
                                    <TextArea disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="预计结案时间"
                            >
                                {getFieldDecorator('closingTime', {
                                    initialValue:shouldShowDefaultData ? moment(initData.closingTime, dateFormat) :undefined
                                })(
                                    <DatePicker disabled={disabled} style={{width:'100%'}} format="YYYY-MM-DD" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='查补事项' {...formItemLayout2}>
                                {getFieldDecorator(`checkItems`,{
                                    initialValue:initData.checkItems
                                })(
                                    <TextArea disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='差异类型' {...formItemLayout}>
                                {getFieldDecorator(`differential`,{
                                    initialValue:initData.differential
                                })(
                                    <Select
                                        disabled={disabled}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value={'1'}>暂时性差异</Option>
                                        <Option value={'2'}>永久性差异</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='补缴税款' {...formItemLayout}>
                                {getFieldDecorator(`taxPayment`,{
                                    initialValue:initData.taxPayment
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='滞纳金' {...formItemLayout}>
                                {getFieldDecorator(`lateFee`,{
                                    initialValue:initData.lateFee
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='罚款' {...formItemLayout}>
                                {getFieldDecorator(`fine`,{
                                    initialValue:initData.fine
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='备注' {...formItemLayout2}>
                                {getFieldDecorator(`remark`,{
                                    initialValue:initData.remark
                                })(
                                    <TextArea disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)