import React from "react";
import {Modal, Form, Input, Row, Col, Select} from "antd";
import {request,requestDict} from '../../../../../../../utils'
import {CusFormItem} from "../../../../../../../compoments";
const FormItem = Form.Item;
const Option = Select.Option;
const {NumericInput} = CusFormItem;

class PopModal extends React.Component{
    state={
        source:{},
        priceClassDic:[]
    }
    componentDidMount(){
        requestDict('JKFL',result=>{
            this.setState({
                priceClassDic:result
            })
        })
    }
    componentWillReceiveProps(props){
        console.log("props",props);
        if(props.action === "modify"){
            this.props.form.resetFields();
            request.get(`/land/priceSource/find/${props.id}`).then(({data}) => {
                if(data.code===200){
                    this.setState({source:data.data})
                }});
        }else if(props.action === "add" && this.props.action!==props.action){
            this.setState({source:{}});
        }
    }
    handleOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            // 数据是新增还是修改
            let newobj = Object.assign({},this.state.source,values);
            this.state.priceClassDic.map((item)=>{
                if(item.id === newobj.priceClass){
                    newobj.priceClassTxt = item.name;
                }
            });
            if(this.props.action === "add"){
                newobj.id = Date.now();
                newobj.id.action = "add";
                this.props.add(newobj);
            }else if(this.props.action === "modify"){
                // 考虑添加后修改的情况
                newobj.id.action = newobj.id.action?"modify":newobj.id.action;
                this.props.update(newobj);
            }
            
            this.props.hideModal();
        }
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 12 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 12 },
              sm: { span: 18 },
            },
          };
          const {action}= this.props;
          const {source:record} = this.state;
        return (
            <Modal
            title={action==="add"?"新增":"修改"}
            visible={this.props.visible}
            onOk={(e)=>{this.handleOk(e)}}
            onCancel={this.props.hideModal}
            style={{maxWidth:'90%'}}
            width={320}
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
          >
          <Form>
              <Row>
                  <Col span={24}>
                    <FormItem
                        {...formItemLayout}
                        label="付款类型"
                        >
                        {getFieldDecorator('priceClass',{
                            initialValue:record.priceClass,
                            rules: [
                                { required: true, message: '必录' },
                            ]    
                        })(
                            <Select>
                                {
                                    this.state.priceClassDic.map((item)=><Option key={item.id} value={item.id}>{item.name}</Option>)
                                }
                            </Select> 
                        )}
                    </FormItem>
                  </Col>
              </Row>
              
              <Row>
                  <Col span={24}>
                    <FormItem
                        {...formItemLayout}
                        label="金额"
                        >
                        {getFieldDecorator('amount',{
                            initialValue:record.amount,
                            rules: [
                                { required: true, message: '必录' },
                            ] 
                        })(
                            <NumericInput />
                        )}
                    </FormItem>
                  </Col>
              </Row>
              
              <Row>
                  <Col span={24}>
                    <FormItem
                        {...formItemLayout}
                        label="票据类型"
                        >
                        {getFieldDecorator('billType',{initialValue:record.billType})(
                            <Input/>
                        )}
                    </FormItem>
                  </Col>
              </Row>
              </Form>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);