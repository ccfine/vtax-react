/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,Checkbox} from 'antd';
import {request,fMoney} from '../../../../../../utils'
const FormItem = Form.Item;
const Option = Select.Option;

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        defaultData:{},
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
        form.setFieldsValue({
            [name]: fMoney(value),
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                const type = this.props.modalConfig.type;
                switch (type){
                    case 'add':
                        this.addDate(this.props.initData, values);
                        break;
                    case 'edit':
                        this.updateDate(this.props.selectedRowKeys[0], values);
                        break;
                }
                this.props.toggleModalVisible(false);
                this.props.setSelectedRowKeysAndselectedRows(null,{})
            }
        });
    }
    addKey=data=>{
        const arr = [];
        data.forEach((item,i) => {
            arr.push({...item, id:`t${i}`});
        });
        return arr;
    }
    addDate = (data, item) =>{
        let arry = [];
        arry.push({...item});
        let t = this.addKey(data.concat(arry));
        this.props.setGdjcgDate(t);
    }

    updateDate=(id,selectedRows)=>{
        const list = this.props.initData;
        const data = list.map((item)=>{
            if(item.id === id){
                return {
                    id:item.id,
                    ...selectedRows,
                }
            }
            return item;
        })
        this.props.setGdjcgDate(data)
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                defaultData:{}
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            this.setState({
                defaultData:{...nextProps.selectedRows[0]}
            })

        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const props = this.props;
        const {defaultData} = this.state;
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
        let disibled = false;
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
                disibled=true;
                break;
        }
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                visible={props.visible}
                footer={
                    type !== 'view' && <Row>
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
                            <FormItem label='股东类型' {...formItemLayout}>
                                {getFieldDecorator(`stockholderType`,{
                                    initialValue:defaultData.stockholderType,
                                    rules:[
                                        {
                                            required:true,
                                            message:'请选择股东类型'
                                        }
                                    ]
                                })(
                                    <Select
                                        disabled={disibled}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value={'1'}>我方股东</Option>
                                        <Option value={'2'}>他方股东</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='实际股东' {...formItemLayout}>
                                {getFieldDecorator(`realStockholder`,{
                                    initialValue:defaultData.realStockholder
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="是否代持股权"
                            >
                                {getFieldDecorator('stockRight', {
                                    valuePropName: 'checked',
                                    initialValue:defaultData.stockRight,
                                })(
                                    <Checkbox disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='登记股东' {...formItemLayout}>
                                {getFieldDecorator(`registeredStockholder`,{
                                    initialValue:defaultData.registeredStockholder
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label='注册资本出资期限' {...formItemLayout}>
                                {getFieldDecorator(`term`,{
                                    initialValue:defaultData.term,
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='注册资本原币币种' {...formItemLayout}>
                                {getFieldDecorator(`registeredCapitalCurrency`,{
                                    initialValue:defaultData.registeredCapitalCurrency
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='注册资本原币金额(万元)' {...formItemLayout}>
                                {getFieldDecorator(`registeredCapitalAmount`,{
                                    initialValue:defaultData.registeredCapitalAmount
                                })(
                                    <Input disabled={disibled}
                                           onKeyUp={(e)=>this.handleKeyUp('registeredCapitalAmount')}
                                           onBlur={(e)=>this.handleBlur('registeredCapitalAmount')}
                                           style={{width:'100%'}}  />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='注册资本备注' {...formItemLayout2}>
                                {getFieldDecorator(`capitalRemark`,{
                                    initialValue:defaultData.capitalRemark
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='实收资本' {...formItemLayout}>
                                {getFieldDecorator(`collectionCapitalCurrency`,{
                                    initialValue:defaultData.collectionCapitalCurrency
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='实收资本原币金额(万元)' {...formItemLayout}>
                                {getFieldDecorator(`collectionCapitalAmount`,{
                                    initialValue:defaultData.collectionCapitalAmount
                                })(
                                    <Input disabled={disibled}
                                           onKeyUp={(e)=>this.handleKeyUp('collectionCapitalAmount')}
                                           onBlur={(e)=>this.handleBlur('collectionCapitalAmount')}
                                           style={{width:'100%'}}  />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='代持情况' {...formItemLayout2}>
                                {getFieldDecorator(`situation`,{
                                    initialValue:defaultData.situation
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='股东属性备注' {...formItemLayout2}>
                                {getFieldDecorator(`propertyRemark`,{
                                    initialValue:defaultData.propertyRemark
                                })(
                                    <Input disabled={disibled} />
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