import React from "react";
import { Modal, Form, Input, Row, Col, Radio, Icon } from 'antd';
import {CusFormItem} from "../../../../../compoments";
import StageTable from './stageTable';
import SourceModal from "./sourcePopModal";
import {request} from '../../../../../utils'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {NumericInput} = CusFormItem;


class LandPriceModal extends React.Component{
    state={
        record:{},
        stageSource:null,
        visible:false, // 土价来源
        stageLoaded:false
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    updateSource(table){
        // .... 在此保存数据。。。。。。。。。。。。。。。。。。。。。


        console.log("获取到变更的数据",table);
    }
    handleOk(){
        //...分期款项编辑事项
        //...在此提交数据..... 1.更具土款来源提交数据2.提交当前表单3.根据分期款项变更提交数据。。。。。

    }
    componentWillReceiveProps(props){
        if(this.props.id !== props.id){
            request.get(`/landPriceInfo/find/${props.id}`).then(({data}) => {
                if(data.code===200){
                    this.setState({record:data.data})
                }});
        }
        if(this.props.id !== props.id){
            // 加载table数据
            request.get(`/land/priceProjectStages/list/${props.id}`).then(({data}) => {
                if(data.code===200){
                    this.setState({stageSource:data.data.page.records,stageLoaded:true})
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
        return (<div><Modal
            title="修改"
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.props.hideModal}
            style={{maxWidth:'90%'}}
            width={920}
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
          >
          <Form>
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
                            <NumericInput disabled={true}/>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label="调整后建筑面积(m²)"
                        >
                        {getFieldDecorator('buildArea',{initialValue:this.state.record.buildArea})(
                            <NumericInput/>
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
                            <NumericInput disabled={true}/>
                        )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label="调整后土地价款"
                        >
                        {getFieldDecorator('adjustLandPrice',{initialValue:this.state.record.adjustLandPrice})(
                            <Input
                                suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                onClick={()=>{this.showModal()}}
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
                            <NumericInput/>
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
          </Form>
          <StageTable
                  dataSource={this.state.stageSource} loading={!this.state.stageLoaded}
                >
                </StageTable>
          </Modal>
        
        <SourceModal visible={this.state.visible} id={this.props.id} hideModal={()=>{this.hideModal()}} update={this.updateSource}/>  </div>
        );
    }
}

export default Form.create()(LandPriceModal);
