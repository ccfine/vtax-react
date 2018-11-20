/**
 * Created by zhouzhe on 2018/11/14.
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal,Form,message} from 'antd'
import {getFields, request} from 'utils'

class PopModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            confirmType: undefined
        };
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            const { declare } = this.props;
            this.fetchConfirmType(declare.mainId);
        }
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { declare } = this.props;
                let param = {
                    month: declare.authMonth,
                    confirmType: values.confirmType,
                    parentId: declare.mainId
                }
                request.post('/taxsubject/updateConfig',param).then(({data}) => {
                    if (data.code === 200) {
                        message.success('修改成功')
                    } else {
                        message.error(data.msg)
                    }
                    this.props.toggleModalVisible(false)
                }).catch(err => {
                    message.error(err.message)
                    this.props.toggleModalVisible(false)
                })
            }
        });
    }
    fetchConfirmType = (taxSubjectId) => {
        request.get(`/taxsubject/get/taxSubjectConfig/${taxSubjectId}`).then(({data}) => {
            if (data.code === 200) {
                this.setState({confirmType: (data.data && data.data.confirmType) || undefined})
            } else {
                message.error(data.msg)
            }
        }).catch(err => {
            message.error(err.message)
        })
    }
    render(){
        const { title,visible,toggleModalVisible } = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={500}
                style={{ top: 250 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form style={{height:'100px'}}>
                    <Row>
                        {
                            getFields(this.props.form, [{
                                label:'确收时点',
                                fieldName:'confirmType',
                                type:'radioGroup',
                                span:24,
                                formItemStyle:{
                                    labelCol:{
                                        span:3
                                    },
                                    wrapperCol:{
                                        span:21
                                    },
                                },
                                options:[
                                    {
                                        label: '三者孰早：合同约定交付日期、房间交付日期、开票日期',
                                        value: '2',
                                    },
                                    {
                                        label: '二者孰早：房间交付日期、开票日期',
                                        value: '3',
                                    }
                                ],
                                fieldDecoratorOptions:{
                                    initialValue: this.state.confirmType || "",
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择确收时点'
                                        }
                                    ]
                                }
                            }])
                        }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)
