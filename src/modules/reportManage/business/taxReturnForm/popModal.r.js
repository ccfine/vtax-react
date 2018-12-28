/**
 * Created by zhouzhe on 2018/12/25.
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal,Form,Spin,message} from 'antd'
import {fMoney,request} from 'utils'
import {NumericInputCell} from 'compoments/EditableCell'

class PopModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            beforeTaxesConstruction: '',
            beforeOnSalesPayment: '',
            beforeTaxesRealEstateRental: '',
            loading: false,
            btnLoading: false
        };
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            this.props.form.resetFields();
            this.setState({
                beforeTaxesConstruction:'',
                beforeOnSalesPayment:'',
                beforeTaxesRealEstateRental:'',
                loading: false,
                btnLoading: false,
            })
        }
        if(!this.props.visible && nextProps.visible){
            const { declare } = this.props;
            const params = {
                mainId: declare.mainId,
                month: declare.authMonth
            }
            this.fetchQueryData(params);
        }
    }
    fetchQueryData = (data) => {
        this.setState({loading: true})
        request.get('/tax/declaration/addendum/four/queryTotalAmount',{params: data})
            .then(({data}) => {
                if (data.code === 200) {
                    let res = data.data;
                    this.setState({
                        buildingServicesTaxAmount: res.buildingServicesTaxAmount,
                        onSalesEstateTaxAmount: res.onSalesEstateTaxAmount,
                        leaseholdTaxAmount: res.leaseholdTaxAmount,
                        beforeTaxesConstruction: res.beforeTaxesConstruction,
                        beforeOnSalesPayment: res.beforeOnSalesPayment,
                        beforeTaxesRealEstateRental: res.beforeTaxesRealEstateRental,
                        afterTaxesConstruction: res.afterTaxesConstruction,
                        afterOnSalesPayment: res.afterOnSalesPayment,
                        afterTaxesRealEstateRental: res.afterTaxesRealEstateRental,
                        totalAmount:res.totalAmount,
                        res
                    })
                this.setState({loading: false})
                }
            }).catch(err=>{
                message.error(err.message)
                this.setState({loading: false})
            });
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { res } = this.state;
                const { declare } = this.props;
                let params = {
                    afterTaxesConstruction: values.afterTaxesConstruction.replace(/\$\s?|(,*)/g, ''),
                    afterOnSalesPayment: values.afterOnSalesPayment.replace(/\$\s?|(,*)/g, ''),
                    afterTaxesRealEstateRental: values.afterTaxesRealEstateRental.replace(/\$\s?|(,*)/g, ''),
                    id: (res && res.id) || '',
                    mainId: declare.mainId,
                    month: declare.authMonth
                }
                this.fetchUpdate(params)
            }
        });
    }

    fetchUpdate = (data) => {
        this.setState({btnLoading:true})
        request.put('/tax/declaration/addendum/four/update',data)
            .then(({data})=>{
                if (data.code ===200) {
                    this.props.toggleModalVisible(false,true)
                }else {
                    message.error(data.msg)
                }
                this.setState({btnLoading:false})
            }).catch(err => {
                message.error(err.message)
                this.setState({btnLoading:false})
            })
    }

    handleFocus = (e, fieldName) => {
        e && e.preventDefault();
        const {setFieldsValue, getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if (value === '0.00') {
            setFieldsValue({
                [fieldName]: ''
            });
        } else {
            setFieldsValue({
                [fieldName]: value.replace(/\$\s?|(,*)/g, '')
            });
        }
    };
    handleBlur = (e, fieldName) => {
        e && e.preventDefault();
        const {setFieldsValue, getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if (value !== '') {
            setFieldsValue({
                [fieldName]: fMoney(value)
            });
        } else {
            setFieldsValue({
                [fieldName]: '0.00'
            });
        }
    };
    render(){
        const { title,visible,toggleModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const {buildingServicesTaxAmount,onSalesEstateTaxAmount,leaseholdTaxAmount,beforeTaxesConstruction,beforeOnSalesPayment,beforeTaxesRealEstateRental,
            afterTaxesConstruction, afterOnSalesPayment, afterTaxesRealEstateRental,totalAmount,loading,btnLoading} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={700}
                style={{ top: 250 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" loading={btnLoading} onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={loading}>
                    <Form>
                        <p style={{color:'red'}}>{`分次预缴税款总额不可超过${totalAmount || '--'}，单个调整事项不可大于本期应抵减税额`}</p>
                        <table border="1" style={{border:'1px solid #e8e8e8',width:660}}>
                            <thead>
                                <tr style={{height:'31px'}}>
                                    <th style={{width: '180px',padding:'6px'}}></th>
                                    <th style={{width: '100px',textAlign:'right',padding:'6px'}}>本期应抵减税额</th>
                                    <th style={{width: '100px',textAlign:'right',padding:'6px'}}>本期实际抵减税额</th>
                                    <th style={{width: '100px',textAlign:'right',padding:'6px'}}>本期实际抵减税额调整结果</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{height:'31px'}}>
                                    <td>建筑服务预征缴纳税款</td>
                                    <td style={{textAlign:'right'}}>{fMoney(buildingServicesTaxAmount) || '--'}</td>
                                    <td style={{textAlign:'right'}}>{fMoney(beforeTaxesConstruction) || '--'}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterTaxesConstruction`}
                                            initialValue={afterTaxesConstruction || '0.00'}
                                            getFieldDecorator={getFieldDecorator}
                                            componentProps={{
                                                onFocus: (e) => this.handleFocus(e, `afterTaxesConstruction`),
                                                onBlur: (e) => this.handleBlur(e, `afterTaxesConstruction`)
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr style={{height:'31px'}}>
                                    <td>销售不动产预征缴纳税款</td>
                                    <td style={{textAlign:'right'}}>{fMoney(onSalesEstateTaxAmount) || '--'}</td>
                                    <td style={{textAlign:'right'}}>{fMoney(beforeOnSalesPayment) || '--'}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterOnSalesPayment`}
                                            initialValue={afterOnSalesPayment || '0.00'}
                                            getFieldDecorator={getFieldDecorator}
                                            componentProps={{
                                                onFocus: (e) => this.handleFocus(e, `afterOnSalesPayment`),
                                                onBlur: (e) => this.handleBlur(e, `afterOnSalesPayment`)
                                            }}
                                        />
                                        
                                    </td>
                                </tr>
                                <tr style={{height:'31px'}}>
                                    <td>出租不动产预征缴纳税款</td>
                                    <td style={{textAlign:'right'}}>{fMoney(leaseholdTaxAmount) || '--'}</td>
                                    <td style={{textAlign:'right'}}>{fMoney(beforeTaxesRealEstateRental) || '--'}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterTaxesRealEstateRental`}
                                            initialValue={afterTaxesRealEstateRental || '0.00'}
                                            getFieldDecorator={getFieldDecorator}
                                            componentProps={{
                                                onFocus: (e) => this.handleFocus(e, `afterTaxesRealEstateRental`),
                                                onBlur: (e) => this.handleBlur(e, `afterTaxesRealEstateRental`)
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)
