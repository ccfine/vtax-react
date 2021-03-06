import React from "react";
import { Modal, Form, Input, Row, Col, Radio, Icon, message, Spin } from 'antd';
import { CusFormItem } from "compoments";
import StageTable from './stageTable';
import SourceModal from "./sourcePopModal";
import { request } from 'utils'
import findIndex from 'lodash/findIndex'


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { NumericInput } = CusFormItem;


class LandPriceModal extends React.Component {
    state = {
        record: {},
        stageSource: [],
        priceSource: null,
        visible: false, // 土价来源
        stageLoaded: false,
        loading: false
    }
    showModal() {
        this.setState({ visible: true });
    }
    hideModal() {
        this.setState({ visible: false });
    }
    updateSource(table) {
        // 更新土价来源
        let allAmount = Array.isArray(table) ? table[table.length - 1].amount : '';
        this.setState({ priceSource: table, record: Object.assign({}, this.state.record, { adjustLandPrice: allAmount.toString().replace(/,/g, '') }) });
    }
    updateStage(item) {
        item.action = "modify";
        // 更新项目分期信息
        let stageSource = this.state.stageSource;
        let index = findIndex(stageSource,ele => item.id === ele.id);
        stageSource[index] = item;
        stageSource.pop();
        stageSource = this.countStage(stageSource);
        this.setState({ stageSource: stageSource });
    }
    countStage(stageSource) {
        if (!stageSource || stageSource.length === 0) return;
        let stage = {
            id: "-1"
        };
        let countFeild = ['upArea', 'certificateArea', 'upAreaSale', 'ableSaleArea', 'apportionLandPrice', 'deductibleLandPrice', 'saleArea', 'actualDeductibleLandPrice'];
        countFeild.forEach(ele => stage[ele] = 0);
        let numFeild;
        stageSource.forEach(element => {
            countFeild.forEach(feild => {
                numFeild = parseFloat(element[feild]);
                stage[feild] += (isNaN(numFeild) ? 0 : numFeild);
            })
        });
        stageSource.push(stage);
        return stageSource;
    }
    handleOk() {
        if (this.props.readOnly) {
            this.props.hideModal();
            this.props.form.resetFields();
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                // 修改价款信息
                let requests = [];
                let oldPriceInfo = Object.assign({}, this.state.record, values);
                let priceInfo = {
                    buildArea: oldPriceInfo.buildArea,
                    contractLandId: oldPriceInfo.contractLandId,
                    id: oldPriceInfo.id,
                    landPrice: oldPriceInfo.adjustLandPrice,
                    notOffsetLandPrice: oldPriceInfo.notOffsetLandPrice,
                    setUp: oldPriceInfo.setUp
                };
                priceInfo.landPrice = priceInfo.landPrice && priceInfo.landPrice.toString().replace(/,/g, '');

                requests.push(request.put("/landPriceInfo/update", priceInfo));

                // 修改土地来源
                Array.isArray(this.state.priceSource) && this.state.priceSource.forEach(ele => {
                    if (ele.action === "add") {
                        ele.landPriceInfoId = this.state.record.id;
                        requests.push(request.post("/land/priceSource/add", ele));
                    } else if (ele.action === "modify") {
                        requests.push(request.put("/land/priceSource/update", ele));
                    } else if (ele.action === "delete") {
                        requests.push(request.delete(`/land/priceSource/delete/${ele.id}`));
                    }
                });

                // 修改分期信息
                Array.isArray(this.state.stageSource) && this.state.stageSource.forEach(ele => {
                    if (ele.action === "modify") {
                        let stage = {
                            ableSaleArea: ele.ableSaleArea,// 调整后可售面积（㎡） 
                            //apportionLandPriceProportion:ele.actualDeductibleLandPrice ,//已实际抵扣土地价款 ,
                            certificateArea: ele.certificateArea,// 调整后施工证面积（㎡） ,
                            //deductibleLandPrice:ele.actualDeductibleLandPrice ,// 已实际抵扣土地价款 ,
                            id: ele.id,//主键 ,
                            //landPriceInfoId: this.state.record.id,//land_price_info价款信息表的id ,
                            //projectStagesId :ele.id,
                            //saledArea:ele.saleArea ,// 已售建筑面积（㎡） ,
                            setUp: ele.setUp// 可抵扣的土地价款比例设置(1-100%,2-按调整后可售面积（㎡）/调整后施工证面积（㎡）计算)

                        }
                        requests.push(request.put("/land/priceProjectStages/update", stage));
                    }
                })
                Promise.all(requests).then((results) => {
                    let success = true;
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].data.code !== 200) {
                            success = false;
                            message.error(results[i].data.msg, 4);
                            break;
                        }
                    }
                    success && message.success('操作成功！', 4);
                    success && this.props.hideModal();
                    success && this.props.onSuccess && this.props.onSuccess();
                    success && this.props.form.resetFields();
                    this.setState({ loading: false });
                }).catch(err => {
                    message.error(err.message)
                    this.setState({ loading: false });
                });

            }
        });
    }
    componentWillReceiveProps(props) {
        if (this.props.updateKey !== props.updateKey) {
            this.setState({ record: {}, stageSource: [], loading: true, stageLoaded: false });
            request.get(`/landPriceInfo/find/${props.id}`).then(({ data }) => {
                if (data.code === 200) {
                    this.setState({ record: data.data, loading: false })
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({ loading: false })
            })

            // 加载table数据
            request.get(`/land/priceProjectStages/list/${props.id}`).then(({ data }) => {
                if (data.code === 200) {
                    let stageSource = data.data.items;
                    stageSource = this.countStage(stageSource);
                    this.setState({ stageSource: stageSource, stageLoaded: true })
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({ stageLoaded: true })
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        return (<div><Modal
            title="编辑"
            visible={this.props.visible}
            onOk={() => {
                this.state.loading || this.handleOk();
            }}
            onCancel={() => {
                this.props.hideModal();
                this.props.form.resetFields();
            }}
            style={{ maxWidth: '90%' ,top:'5%'}}
            width={920}
            bodyStyle={{ maxHeight: "450px", overflow: "auto" }}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Spin spinning={this.state.loading}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="纳税主体"
                            >
                                {getFieldDecorator('mainName', { initialValue: this.state.record.mainName })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="项目编号"
                            >
                                {getFieldDecorator('itemNum', { initialValue: this.state.record.itemNum })(
                                    <Input disabled={true} />
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
                                {getFieldDecorator('itemName', { initialValue: this.state.record.itemName })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="土地出让合同编号"
                            >
                                {getFieldDecorator('contractNum', { initialValue: this.state.record.contractNum })(
                                    <Input disabled={true} />
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
                                {getFieldDecorator('coveredArea', { initialValue: this.state.record.coveredArea })(
                                    <NumericInput decimalPlaces={4} disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="调整后建筑面积(m²)"
                            >
                                {getFieldDecorator('buildArea', { initialValue: this.state.record.buildArea })(
                                    <NumericInput decimalPlaces={4} disabled={this.props.readOnly} />
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
                                {getFieldDecorator('landPrice', { initialValue: this.state.record.landPrice })(
                                    <NumericInput disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="调整后土地价款"
                            >
                                <div style={{position:'relative'}}>
                                    <Icon type="search" onClick={() => { this.showModal() }} style={{ cursor: "pointer", padding: "5px 10px", position: "absolute", right: "-1px", top: "6px", textAlign: 'right', width: '100%', zIndex: 1,display:'inline-block' }} />
                                    {
                                        getFieldDecorator('adjustLandPrice', { initialValue: this.state.record.adjustLandPrice })(
                                            <Input disabled={this.props.readOnly} />
                                        )}
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="结转上期未抵减完的土地价款"
                            >
                                {getFieldDecorator('notOffsetLandPrice', { initialValue: this.state.record.notOffsetLandPrice })(
                                    <NumericInput disabled={this.props.readOnly} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24} className="fix-ie10-formItem-textArea">
                            <FormItem
                                {...formItemLayout2}
                                label="可分摊土地价款比例设置"
                            >
                                {getFieldDecorator('setUp', { initialValue: this.state.record.setUp })(
                                    <RadioGroup disabled={this.props.readOnly}>
                                        <Radio className='radioStyle' value={1}>按调整后施工证面积（㎡）/调整后建筑面积（㎡）计算</Radio>
                                        <Radio className='radioStyle' value={2}>按调整后施工证面积（㎡）/调整后施工证面积（㎡）合计</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <StageTable
                    dataSource={this.state.stageSource}
                    loading={!this.state.stageLoaded}
                    update={(item) => this.updateStage(item)}
                    readOnly={this.props.readOnly}
                >
                </StageTable>
            </Spin>
        </Modal>

            <SourceModal
                visible={this.state.visible}
                id={this.props.id}
                hideModal={() => { this.hideModal() }}
                update={(table) => this.updateSource(table)}
                readOnly={this.props.readOnly}
                updateKey={this.props.updateKey}
            />  </div>
        );
    }
}

export default Form.create()(LandPriceModal);
