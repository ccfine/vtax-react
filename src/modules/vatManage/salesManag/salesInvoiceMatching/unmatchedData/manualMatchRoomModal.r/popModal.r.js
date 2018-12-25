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
                console.log('values',values)
                // const { declare } = this.props;
                // let param = {
                //     month: declare.authMonth,
                //     parentId: declare.mainId
                // }
                // request.post('/output/room/files/updateConfig',param).then(({data}) => {
                //     if (data.code === 200) {
                //         message.success('修改成功')
                //     } else {
                //         message.error(data.msg)
                //     }
                //     this.props.toggleModalVisible(false)
                // }).catch(err => {
                //     message.error(err.message)
                //     this.props.toggleModalVisible(false)
                // })
            }
        });
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
                                label:'发票红冲类型',
                                fieldName:'confirmType',
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
                                        value: '1',
                                    },
                                    {
                                        text: '退房红冲',
                                        value: '2',
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
