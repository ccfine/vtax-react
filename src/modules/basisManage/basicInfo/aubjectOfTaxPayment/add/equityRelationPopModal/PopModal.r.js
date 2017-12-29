/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,InputNumber} from 'antd';
import {regRules} from '../../../../../../utils'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        defaultData:{},
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
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
            if(!item.id){
                arr.push({...item, id:`t${i}`});
            }else{
                arr.push(item);
            }
        });
        return arr;
    }
    addDate = (data, item) =>{
        let arry = [];
        arry.push({...item});
        let t = this.addKey(data.concat(arry));
        this.props.setGqgxDate(t);
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
        this.props.setGqgxDate(data)
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
                width={600}
                visible={props.visible}
                footer={
                    type !== 'view' && <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                                <Button type="primary" onClick={this.handleSubmit}>继续添加</Button>
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
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='股东' {...formItemLayout2}>
                                {getFieldDecorator(`stockholder`,{
                                    initialValue:defaultData.stockholder,
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入股东'
                                        },{
                                            max:regRules.input_50_lenght.max, message: regRules.input_50_lenght.message
                                        }
                                    ]
                                })(
                                    <Input disabled={disibled} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label='股权比例' {...formItemLayout}>
                                {getFieldDecorator(`stockRightRatio`,{
                                    initialValue:defaultData.stockRightRatio
                                })(
                                    <InputNumber
                                        disabled={disibled}
                                        min={0}
                                        max={100}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='权益比例' {...formItemLayout}>
                                {getFieldDecorator(`rightsRatio`,{
                                    initialValue:defaultData.rightsRatio
                                })(
                                    <InputNumber
                                        disabled={disibled}
                                        min={0}
                                        max={100}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace('%', '')}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label='备注' {...formItemLayout2}>
                                {getFieldDecorator(`remark`,{
                                    initialValue:defaultData.remark,
                                    rules:[
                                        {
                                            max:regRules.textarea_2000_lenght.max, message: regRules.textarea_2000_lenght.message
                                        }
                                    ]
                                })(
                                    <TextArea disabled={disibled} />
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