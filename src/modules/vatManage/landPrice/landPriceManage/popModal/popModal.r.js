import React from "react";
import { Modal, Form, Input, Row, Col, Radio, Icon ,message, Spin} from 'antd';
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
        priceSource:null,
        visible:false, // 土价来源
        stageLoaded:false,
        loading:false
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    updateSource(table){
        // 更新土价来源
        let allAmount = Array.isArray(table)?table[table.length-1].amount:0; 
        this.setState({priceSource:table,record:Object.assign({},this.state.record,{adjustLandPrice:allAmount})});
    }
    updateStage(item){
        item.action = "modify";
        // 更新项目分期信息
        let stageSource = this.state.stageSource;
        let index = stageSource.findIndex(ele=>item.id===ele.id);
        stageSource[index] = item;
        stageSource.pop();
        stageSource = this.countStage(stageSource);
        this.setState({stageSource: stageSource});
    }
    countStage(stageSource){
        let stage={
            id:"-1"
        };
        let countFeild = ['upArea','certificateArea','upAreaSale','pageAblesalearea','apportionLandPrice','deductibleLandPrice','saleArea','actualDeductibleLandPrice'];
        countFeild.forEach(ele=>stage[ele] = 0);
        let numFeild;
        stageSource.forEach(element => {
            countFeild.forEach(feild=>{
                numFeild = Number.parseFloat(element[feild]);
                stage[feild] += (Number.isNaN(numFeild)?0:numFeild);
            })
        });
        stageSource.push(stage);
        return stageSource;
    }
    async handleOk(){
        
        if(this.props.readOnly){
            this.props.hideModal();
            return;
        }

        this.setState({loading:true});
        this.props.form.validateFields((err, values) => {
            if (!err) {
              // 修改价款信息
              let requests = [];
              requests.push(request.put("/landPriceInfo/update", Object.assign({},this.state.record,values)));
              
              // 修改土地来源
              Array.isArray(this.state.priceSource) && this.state.priceSource.forEach(ele=>{
                  if(ele.action === "add"){
                      ele.landPriceInfoId = this.state.record.id;
                      requests.push(request.post("/land/priceSource/add", ele));
                  }else if(ele.action === "modify"){
                        requests.push(request.put("/land/priceSource/update", ele));
                  }else if(ele.action === "delete"){
                      requests.push(request.delete(`/land/priceSource/delete/${ele.id}`));
                  }
              });

              // 修改分期信息
              Array.isArray(this.state.StageTable) && this.state.StageTable.forEach(ele=>{
                if(ele.action === "modify"){
                    requests.push(request.put("/land/priceProjectStages/update", ele));
                }
              })
              Promise.all(requests).then((results)=>{
                  let success = true;
                  for(let i=0;i<results.length;i++){
                      if(results[i].data.code !== 200){
                        success = false;
                        message.error(results[i].data.msg, 4);
                        break;
                      }
                  }
                  success && message.success('操作成功！', 4);
                  success && this.props.hideModal();
                  this.setState({loading:false});
              }).catch(err => {
                message.error(err.message)
                this.setState({loading:false});
            });

            }
          });
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
                    let stageSource = data.data.page.records;
                    stageSource = this.countStage(stageSource);
                    this.setState({stageSource:stageSource,stageLoaded:true})
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
            onOk={()=>{
                this.handleOk();
            }}
            onCancel={this.props.hideModal}
            style={{maxWidth:'90%'}}
            width={920}
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
          >
          <Spin spinning={this.state.loading}>
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
                            <NumericInput disabled={this.props.readOnly}/>
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
                            <Input disabled={this.props.readOnly}
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
                            <NumericInput disabled={this.props.readOnly}/>
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
                            <RadioGroup disabled={this.props.readOnly}>
                            <Radio value={1}>按调整后施工证面积（㎡）/调整后建筑面积（㎡）计算</Radio>
                            <Radio value={2}>按调整后施工证面积（㎡）/调整后施工证面积（㎡）合计</Radio>
                          </RadioGroup>
                        )}
                    </FormItem>
                        </Col>
              </Row>
          </Form>
          <StageTable
                  dataSource={this.state.stageSource} loading={!this.state.stageLoaded} update={(item)=>this.updateStage(item)}
                >
                </StageTable>
            </Spin>
          </Modal>
        
        <SourceModal visible={this.state.visible} id={this.props.id} hideModal={()=>{this.hideModal()}} update={(table)=>this.updateSource(table)}/>  </div>
        );
    }
}

export default Form.create()(LandPriceModal);
