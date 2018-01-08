import React from "react";
import { Modal, Form, Input, Row, Col, Radio } from 'antd';
import {request} from '../../../../../../utils'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class PopModal extends React.Component{
    state={
        stage:{}
    }
    componentWillReceiveProps(props){
        if(this.props.id !== props.id){
            request.get(`/land/priceProjectStages/find/${props.id}`).then(({data}) => {
                if(data.code===200){
                    // data返回undefined ?????
                    this.setState({stage:data.data?data.data:{}})
                }});
        }
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
            onCancel={this.props.hideModal}
            onOk={()=>{}}
            style={{maxWidth:'90%'}}
            width={820}
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
          >
             <Form>
             <Row>
                 <Col span={12}>
                   <FormItem
                       {...formItemLayout}
                       label="项目分期编码"
                       >
                       {getFieldDecorator('itemNum',{initialValue:this.state.stage.itemNum})(
                           <Input disabled={true} />
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
                           <Input disabled={true}/>
                       )}
                   </FormItem>
                 </Col>
                 <Col span={12}>
                   <FormItem
                       {...formItemLayout}
                       label="调整后施工证面积（㎡）"
                       >
                       {getFieldDecorator('certificateArea',{initialValue:this.state.stage.certificateArea})(
                           <Input/>
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
                           <Input disabled={true}/>
                       )}
                   </FormItem>
                 </Col>
                 <Col span={12}>
                   <FormItem
                       {...formItemLayout}
                       label="调整后可售面积（㎡）"
                       >
                       {getFieldDecorator('ableSaleArea',{initialValue:this.state.stage.ableSaleArea})(
                          <Input/>
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
                           <Input/>
                       )}
                   </FormItem>
                       </Col>
                    <Col span={12}>
                    <FormItem
                       {...formItemLayout}
                       label="分摊后土地价款"
                       >
                       {getFieldDecorator('apportionLandPrice',{initialValue:this.state.stage.apportionLandPrice})(
                           <Input/>
                       )}
                    </FormItem>
                    </Col>
             </Row>
             
             <Row>
                 <Col span={12}>
                 <FormItem
                       {...formItemLayout}
                       label="可抵扣的土地价款比例设置"
                       >
                       {getFieldDecorator('setUp',{initialValue:this.state.stage.setUp})(
                           <RadioGroup >
                           <Radio value={1}>按调整后可售面积（㎡）/调整后施工证面积（㎡）</Radio>
                           <Radio value={2}>100%</Radio>
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
                           <Input/>
                       )}
                   </FormItem>
                       </Col>
                    <Col span={12}>
                    <FormItem
                       {...formItemLayout}
                       label="可抵扣土地价款"
                       >
                       {getFieldDecorator('deductibleLandPrice',{initialValue:this.state.stage.deductibleLandPrice})(
                           <Input/>
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
                           <Input/>
                       )}
                   </FormItem>
                       </Col>
                    <Col span={12}>
                    <FormItem
                       {...formItemLayout}
                       label="已实际抵扣土地价款"
                       >
                       {getFieldDecorator('actualDeductibleLandPrice',{initialValue:this.state.stage.actualDeductibleLandPrice})(
                           <Input/>
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