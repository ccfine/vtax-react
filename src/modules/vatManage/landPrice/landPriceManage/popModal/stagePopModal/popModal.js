import React from "react";
import { Modal, Form, Input, Row, Col, Radio } from 'antd';
import {CusFormItem} from "../../../../../../compoments";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {NumericInput} = CusFormItem;

class PopModal extends React.Component{
    state={
        stage:{}
    }
    handOK(e){
        if(this.props.readOnly){
            this.props.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.update(Object.assign({},this.state.stage,values));
                this.props.hideModal();
                this.props.form.resetFields();
            }
        });
    }
    componentWillReceiveProps(props){
        let obj = Object.assign({},props.stage);
        this.setState({stage:obj});
    }
    renderForm(formItemLayout,getFieldDecorator){
        //if(this.props.readOnly){
            return (<Form>
            <Row>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="项目分期编码"
                      >
                      {getFieldDecorator('itemNum',{initialValue:this.state.stage.itemNum})(
                          <Input disabled={true}/>
                      )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="项目分期名称"
                      >
                      {getFieldDecorator('itemName',{initialValue:this.state.stage.itemName})(
                          <Input disabled={true}/>
                      )}
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="计税方法"
                      >
                      {getFieldDecorator('taxMethod',{initialValue:this.state.stage.taxMethod})(
                          <Input disabled={true} />
                      )}
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="施工证面积（㎡）"
                      >
                      {getFieldDecorator('upArea',{initialValue:this.state.stage.upArea})(
                          <NumericInput disabled={true} />
                      )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="调整后施工证面积（㎡）"
                      >
                      {getFieldDecorator('certificateArea',{initialValue:this.state.stage.certificateArea})(
                          <NumericInput disabled={this.props.readOnly} />
                      )}
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="可售面积（㎡）"
                      >
                      {getFieldDecorator('upAreaSale',{initialValue:this.state.stage.upAreaSale})(
                          <NumericInput disabled={true} />
                      )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                      {...formItemLayout}
                      label="调整后可售面积（㎡）"
                      >
                      {getFieldDecorator('ableSaleArea',{initialValue:this.state.stage.ableSaleArea})(
                         <NumericInput disabled={this.props.readOnly}/>
                      )}
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                <FormItem
                      {...formItemLayout}
                      label="可分摊土地价款比例"
                      >
                      {getFieldDecorator('apportionLandPriceProportion',{initialValue:this.state.stage.apportionLandPriceProportion})(
                          <NumericInput disabled={true} />
                      )}
                  </FormItem>
                      </Col>
                   <Col span={12}>
                   <FormItem
                      {...formItemLayout}
                      label="分摊后土地价款"
                      >
                      {getFieldDecorator('apportionLandPrice',{initialValue:this.state.stage.apportionLandPrice})(
                          <NumericInput disabled={true} />
                      )}
                   </FormItem>
                   </Col>
            </Row>
            
            <Row>
                <Col span={12}>
                <FormItem
                      labelCol= {{
                       xs: { span: 12 },
                       sm: { span: 10 },
                     }}
                     wrapperCol= {{
                       xs: { span: 12 },
                       sm: { span: 14 },
                     }}
                      label="可抵扣的土地价款比例设置"
                      >
                      {getFieldDecorator('setUp',{initialValue:this.state.stage.setUp})(
                          <RadioGroup  disabled={this.props.readOnly}>
                          <Radio value={2}>按调整后可售面积（㎡）/调整后施工证面积（㎡）</Radio>
                          <Radio value={1}>100%</Radio>
                        </RadioGroup>
                      )}
                  </FormItem>
                      </Col>
            </Row>
            <Row>
                <Col span={12}>
                <FormItem
                      {...formItemLayout}
                      label="可抵扣的土地价款比例"
                      >
                      {getFieldDecorator('deductibleLandPriceProportion',{initialValue:this.state.stage.deductibleLandPriceProportion})(
                          <NumericInput disabled={true}/>
                      )}
                  </FormItem>
                      </Col>
                   <Col span={12}>
                   <FormItem
                      {...formItemLayout}
                      label="可抵扣土地价款"
                      >
                      {getFieldDecorator('deductibleLandPrice',{initialValue:this.state.stage.deductibleLandPrice})(
                          <NumericInput disabled={true}/>
                      )}
                   </FormItem>
                   </Col>
            </Row>
            
            <Row>
                <Col span={12}>
                <FormItem
                      {...formItemLayout}
                      label="已售建筑面积（㎡）"
                      >
                      {getFieldDecorator('saleArea',{initialValue:this.state.stage.notOffsetLandPrice})(
                          <NumericInput disabled={true}/>
                      )}
                  </FormItem>
                      </Col>
                   <Col span={12}>
                   <FormItem
                      {...formItemLayout}
                      label="已实际抵扣土地价款"
                      >
                      {getFieldDecorator('actualDeductibleLandPrice',{initialValue:this.state.stage.actualDeductibleLandPrice})(
                          <NumericInput disabled={true}/>
                      )}
                   </FormItem>
                   </Col>
            </Row>
            <Row>
                <Col span={12}>
                <FormItem
                      {...formItemLayout}
                      label="单方土地成本"
                      >
                      {getFieldDecorator('singleLandCost',{initialValue:this.state.stage.singleLandCost})(
                          <NumericInput disabled={true}/>
                      )}
                  </FormItem>
                      </Col>
            </Row>
        </Form>);
        // }else{
        //     return (<Form>
        //         <Row>
        //             <Col span={12}>
        //               <FormItem
        //                   {...formItemLayout}
        //                   label="项目分期编码"
        //                   >
        //                   {getFieldDecorator('itemNum',{initialValue:this.state.stage.itemNum})(
        //                       <Input disabled={true}/>
        //                   )}
        //               </FormItem>
        //             </Col>
        //             <Col span={12}>
        //               <FormItem
        //                   {...formItemLayout}
        //                   label="项目分期名称"
        //                   >
        //                   {getFieldDecorator('itemName',{initialValue:this.state.stage.itemName})(
        //                       <Input disabled={true}/>
        //                   )}
        //               </FormItem>
        //             </Col>
        //         </Row>
        //         <Row>
        //             <Col span={12}>
        //             <FormItem
        //                   {...formItemLayout}
        //                   label="调整后施工证面积（㎡）"
        //                   >
        //                   {getFieldDecorator('certificateArea',{initialValue:this.state.stage.certificateArea})(
        //                       <NumericInput disabled={this.props.readOnly} />
        //                   )}
        //               </FormItem>
        //             </Col>
        //             <Col span={12}>
        //               <FormItem
        //                   {...formItemLayout}
        //                   label="调整后可售面积（㎡）"
        //                   >
        //                   {getFieldDecorator('ableSaleArea',{initialValue:this.state.stage.ableSaleArea})(
        //                      <NumericInput disabled={this.props.readOnly}/>
        //                   )}
        //               </FormItem>
        //             </Col>
        //         </Row>
        //         <Row>
        //             <Col span={12}>
        //             <FormItem
        //                   {...formItemLayout}
        //                   label="已售建筑面积（㎡）"
        //                   >
        //                   {getFieldDecorator('saleArea',{initialValue:this.state.stage.notOffsetLandPrice})(
        //                       <NumericInput disabled={this.props.readOnly}/>
        //                   )}
        //               </FormItem>
        //                   </Col>
        //                <Col span={12}>
        //                <FormItem
        //                   {...formItemLayout}
        //                   label="已实际抵扣土地价款"
        //                   >
        //                   {getFieldDecorator('actualDeductibleLandPrice',{initialValue:this.state.stage.actualDeductibleLandPrice})(
        //                       <NumericInput disabled={this.props.readOnly}/>
        //                   )}
        //                </FormItem>
        //                </Col>
        //         </Row>
                
        //         <Row>
        //             <Col span={12}>
        //             <FormItem
        //                   labelCol= {{
        //                    xs: { span: 12 },
        //                    sm: { span: 10 },
        //                  }}
        //                  wrapperCol= {{
        //                    xs: { span: 12 },
        //                    sm: { span: 14 },
        //                  }}
        //                   label="可抵扣的土地价款比例设置"
        //                   >
        //                   {getFieldDecorator('setUp',{initialValue:this.state.stage.setUp})(
        //                       <RadioGroup  disabled={this.props.readOnly}>
        //                       <Radio value={2}>按调整后可售面积（㎡）/调整后施工证面积（㎡）</Radio>
        //                       <Radio value={1}>100%</Radio>
        //                     </RadioGroup>
        //                   )}
        //               </FormItem>
        //                   </Col>
        //         </Row>
                
                
        //     </Form>);
        // }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 12 },
              sm: { span: 9 },
            },
            wrapperCol: {
              xs: { span: 12 },
              sm: { span: 15 },
            },
          };
        return (
            <Modal
            visible={this.props.visible}
            title="修改"
            onCancel={()=>{
                this.props.form.resetFields();
                this.props.hideModal();
            }}
            onOk={(e)=>{
                this.handOK(e);
            }}
            style={{maxWidth:'90%'}}
            width={820}
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
          >
             {
                 this.renderForm(formItemLayout,getFieldDecorator)
             }
          </Modal>
        );
    }
}

export default Form.create()(PopModal);