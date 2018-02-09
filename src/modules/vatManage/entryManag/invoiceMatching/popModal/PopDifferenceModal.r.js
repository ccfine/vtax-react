/**
 * author       : liuliyuan
 * createTime   : 2018/1/5 18:30
 * description  :
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,message,Spin} from 'antd';
import {request,regRules} from '../../../../../utils'
const FormItem = Form.Item;
const { TextArea } = Input;

class PopDifferenceModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state={
        loading: false,

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        visible:false,
    }


    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    id:this.props.selectedRows[0].id
                }
                this.setState({
                    loading: true,
                });
                request.put(this.props.url, data
                )
                    .then(({data}) => {

                        if (data.code === 200) {
                            this.setState({
                                loading: false,
                            });
                            message.success('提交成功！', 4)
                            this.props.form.resetFields();
                            //新增成功，关闭当前窗口,刷新父级组件
                            this.props.toggleModalVisible(false);
                            this.props.refreshTable();
                        } else {
                            message.error(data.msg, 4)
                            this.setState({
                                loading: false,
                            });
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({
                            loading: false,
                        });
                    })
            }
        })
    }

    handleReset = () => {
        this.props.form.resetFields();
        this.props.toggleModalVisible(false)
    }
    render(){
        const { loading } = this.state;
        const props = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={450}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={this.handleReset}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={24}>
                                <FormItem label='差异原因' {...formItemLayout}>
                                    {getFieldDecorator(`causeDifference`,{
                                        initialValue:props.selectedRows && props.selectedRows[0].causeDifference,
                                        rules:[
                                            {
                                                max:regRules.textarea_length_2000.max, message: regRules.textarea_length_2000.message
                                            }
                                        ]
                                    })(
                                        <TextArea autosize={{ minRows: 5, maxRows: 8 }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopDifferenceModal)