/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,DatePicker} from 'antd';
import {CusFormItem} from '../../../../../compoments'
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        initData:{

        }
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
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
        const {initData} = this.state;
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
            default:
                //no default
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
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={12}>
                            <CusFormItem.TaxMain fieldName="mainId" initialValue={initData.mainId} formItemStyle={formItemLayout} form={this.props.form} />
                        </Col>
                        <Col span={12}>
                            <CusFormItem.AsyncSelect
                                fieldTextName="ss"
                                fieldValueName="sss"
                                fieldName="a"
                                label="涉及税种"
                                url=""
                                initialValue={initData.a}
                                formItemStyle={formItemLayout}
                                form={this.props.form}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <CusFormItem.AsyncSelect
                                fieldTextName="ss"
                                fieldValueName="sss"
                                fieldName="a"
                                label="税收优惠分类"
                                url=""
                                initialValue={initData.a}
                                formItemStyle={formItemLayout}
                                form={this.props.form}/>
                        </Col>
                        <Col span={12}>
                            <FormItem label='文号' {...formItemLayout}>
                                {getFieldDecorator(`documentNum`,{
                                    initialValue:initData.documentNum,
                                })(
                                    <Input disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="有效期间起止"
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
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='税收优惠法律依据' {...formItemLayout2}>
                                {getFieldDecorator(`issue`,{
                                    initialValue:initData.issue
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