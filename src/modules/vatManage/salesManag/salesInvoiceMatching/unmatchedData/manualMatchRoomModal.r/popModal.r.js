/**
 * Created by zhouzhe on 2018/12/24.
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal,Form,message} from 'antd'
import {getFields, request} from 'utils'

class PopModal extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { params } = this.props;
                let param = {
                    ...params,
                    returned: values.returned
                }
                request.get('/output/invoice/marry/manual/determine',{
                    params: param
                }).then(({data}) => {
                    this.props.togglesPopModalVisible(false)
                    if (data.code === 200) {
                        message.success('操作成功!');
                        this.props.toggleModalVisible(false);
                        this.props.refreshTable();
                    } else {
                        message.error(`操作失败:${data.msg}`)
                    }
                }).catch(err => {
                    message.error(err.message)
                    this.props.togglesPopModalVisible(false)
                })
            }
        });
    }
    render(){
        const { title,visible,togglesPopModalVisible } = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>togglesPopModalVisible(false)}
                width={500}
                style={{ top: 250 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>togglesPopModalVisible(false)}>取消</Button>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form style={{height:'100px'}}>
                    <Row>
                        {
                            getFields(this.props.form, [{
                                label:'发票红冲类型',
                                fieldName:'returned',
                                type:'select',
                                span:24,
                                formItemStyle:{
                                    labelCol:{
                                        span:8
                                    },
                                    wrapperCol:{
                                        span:10
                                    },
                                },
                                options:[
                                    {
                                        text: '一般红冲',
                                        value: '0',
                                    },
                                    {
                                        text: '退房红冲',
                                        value: '1',
                                    }
                                ],
                                fieldDecoratorOptions:{
                                    // initialValue: this.state.confirmType || "",
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择发票红冲类型'
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
