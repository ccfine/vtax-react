import React from "react";
import { Modal, Form, Input, Icon, Row, Col, Radio, Button } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class LandPriceInfo extends React.Component{
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
              <div>
                  <Row>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="纳税主体"
                            >
                            {getFieldDecorator('mainName',{initialValue:this.state.record.mainName})(
                                <Input disabled={true} />
                            )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="项目编号"
                            >
                            {getFieldDecorator('itemNum',{initialValue:this.state.record.itemNum})(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                      </Col>
                  </Row>
                  <Row>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="项目名称"
                            >
                            {getFieldDecorator('itemName',{initialValue:this.state.record.itemName})(
                                <Input disabled={true} />
                            )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="土地出让合同编号"
                            >
                            {getFieldDecorator('contractNum',{initialValue:this.state.record.contractNum})(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                      </Col>
                  </Row>
                  <Row>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="合同建筑面积(m²)"
                            >
                            {getFieldDecorator('coveredArea',{initialValue:this.state.record.coveredArea})(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="调整后建筑面积(m²)"
                            >
                            {getFieldDecorator('buildArea',{initialValue:this.state.record.buildArea})(
                                <Input/>
                            )}
                        </FormItem>
                      </Col>
                  </Row>
                  <Row>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="合同土地价款"
                            >
                            {getFieldDecorator('landPrice',{initialValue:this.state.record.landPrice})(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label="调整后土地价款"
                            >
                            {getFieldDecorator('adjustLandPrice',{initialValue:this.state.record.adjustLandPrice})(
                                <Search
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                              />
                            )}
                        </FormItem>
                      </Col>
                  </Row>
                  <Row>
                      <Col span={12}>
                      <FormItem
                            {...formItemLayout}
                            label="结转上期未抵减完的土地价款"
                            >
                            {getFieldDecorator('notOffsetLandPrice',{initialValue:this.state.record.notOffsetLandPrice})(
                                <Input/>
                            )}
                        </FormItem>
                            </Col>
                  </Row>
                  
                  <Row>
                      <Col span={12}>
                      <FormItem
                            {...formItemLayout}
                            label="可分摊土地价款比例设置"
                            >
                            {getFieldDecorator('setUp',{initialValue:this.state.record.setUp})(
                                <RadioGroup >
                                <Radio value={1}>按调整后施工证面积（㎡）/调整后建筑面积（㎡）计算</Radio>
                                <Radio value={2}>按调整后施工证面积（㎡）/调整后施工证面积（㎡）合计</Radio>
                              </RadioGroup>
                            )}
                        </FormItem>
                            </Col>
                  </Row>
              </div>);
    }
}

export default LandPriceInfo;