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
            loading: false
        };
    }
    componentWillReceiveProps(nextProps){
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
                        beforeTaxesConstruction: res.addendumAmountRecord.beforeTaxesConstruction,
                        beforeOnSalesPayment: res.addendumAmountRecord.beforeOnSalesPayment,
                        beforeTaxesRealEstateRental: res.addendumAmountRecord.beforeTaxesRealEstateRental,
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
                    id: res.addendumAmountRecord.id,
                    mainId: declare.mainId,
                    month: declare.authMonth
                }
                this.fetchUpdate(params)
            }
        });
    }

    fetchUpdate = (data) => {
        request.put('/tax/declaration/addendum/four/update',data)
            .then(({data})=>{
                if (data.code ===200) {
                    this.props.toggleModalVisible(false,true)
                }else {
                    message.error(data.msg)
                }
            }).catch(err => {
                message.error(err.message)
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
        const {beforeTaxesConstruction,beforeOnSalesPayment,beforeTaxesRealEstateRental,totalAmount,loading} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={500}
                style={{ top: 250 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={loading}>
                    <Form>
                        <p style={{color:'red'}}>{`分次预缴税款总额不可超过${totalAmount}`}</p>
                        <table border="1" style={{border:'1px solid #e8e8e8'}}>
                            <thead>
                                <tr style={{height:'31px'}}>
                                    <th style={{width: '180px',padding:'6px'}}></th>
                                    <th style={{width: '100px',textAlign:'right',padding:'6px'}}>调整前</th>
                                    <th style={{width: '100px',textAlign:'right',padding:'6px'}}>调整后</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{height:'31px'}}>
                                    <td>建筑服务预征缴纳税款</td>
                                    <td style={{textAlign:'right'}}>{fMoney(beforeTaxesConstruction)}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterTaxesConstruction`}
                                            initialValue={'0.00'}
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
                                    <td style={{textAlign:'right'}}>{fMoney(beforeOnSalesPayment)}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterOnSalesPayment`}
                                            initialValue={'0.00'}
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
                                    <td style={{textAlign:'right'}}>{fMoney(beforeTaxesRealEstateRental)}</td>
                                    <td>
                                        <NumericInputCell
                                            fieldName={`afterTaxesRealEstateRental`}
                                            initialValue={'0.00'}
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
