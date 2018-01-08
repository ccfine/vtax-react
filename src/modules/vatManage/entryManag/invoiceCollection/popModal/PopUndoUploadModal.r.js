/**
 * author       : liuliyuan
 * createTime   : 2018/1/4 15:29
 * description  :
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,DatePicker,message,Spin} from 'antd';
import {request} from '../../../../../utils'
import {CusFormItem} from '../../../../../compoments'
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

class PopUndoUploadModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state={
        uploading: false,

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        visible:false,
    }

    getFields(start,end) {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const children = [];
        const data = [
            {
                components:<CusFormItem.TaxMain
                    fieldName="taxSubjectId"
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
                />,
                span:24,
            }, {
                label: '认证月份',
                type: 'monthPicker',
                fieldName: 'authMonth',
                span:24,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;

            if(!data[i].components){
                if (data[i].type === 'text') {
                    inputComponent = <Input {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
                } else if (data[i].type === 'rangePicker') {
                    inputComponent = <DatePicker placeholder={`请输入${data[i].label}`} format="YYYY-MM-DD" style={{width:'100%'}} />;
                } else if (data[i].type === 'monthPicker') {
                    inputComponent = <MonthPicker  placeholder={`请输入${data[i].label}`} format="YYYY-MM" style={{width:'100%'}} />;
                }
            }else{
                inputComponent = data[i].components
            }

            if(!data[i].components) {
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        <FormItem
                            {...formItemLayout}
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
                let authMonth = values.authMonth && values.authMonth.format('YYYY-MM');
                this.setState({
                    uploading: true,
                });
                request.post(`/income/invoice/collection/revocation/${values.taxSubjectId}/${authMonth}`,
                )
                    .then(({data}) => {
                        if (data.code === 200) {
                            this.setState({
                                uploading: false,
                            });
                            message.success('撤销成功！', 4)
                            //新增成功，关闭当前窗口,刷新父级组件
                            this.props.toggleUndoUploadModalVisible(false);
                            this.props.updateTable();
                        } else {
                            message.error(data.msg, 4)
                            this.setState({
                                uploading: false,
                            });
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({
                            uploading: false,
                        });

                    })
            }
        })
    }

    render(){
        const { uploading } = this.state;
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleUndoUploadModalVisible(false)}
                width={450}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleUndoUploadModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
                <Spin spinning={uploading}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                this.getFields(0,2)
                            }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopUndoUploadModal)