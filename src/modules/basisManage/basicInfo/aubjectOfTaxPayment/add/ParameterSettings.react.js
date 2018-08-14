// Created by liuliyuan on 2018/8/6
import React,{Component} from 'react';
import {Row} from 'antd';
import {getFields} from 'utils'

export default class ParameterSettings extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {defaultData} = this.props;
        let disabled = this.props.type ==='view';
        return(
            <div className="basicInfo" style={{height:'350px',overflow:'hidden',overflowY:'auto'}}>
                <Row>
                    {
                        getFields(this.props.form,[{
                                label: '非地产收入不参与预缴税款抵减',
                                fieldName: 'taxSubjectConfigBO.prepayTaxesDeduction',
                                type: 'checkbox',
                                span: 6,
                                formItemStyle:{
                                    labelCol:{
                                        span:20
                                    },
                                    wrapperCol:{
                                        span:4
                                    }
                                },
                                fieldDecoratorOptions: {
                                    initialValue: defaultData!==null && parseInt(defaultData.prepayTaxesDeduction,0) === 1,
                                    valuePropName: 'checked',
                                },
                                componentProps: {
                                    disabled,
                                },
                            },
                            {

                                label: '未使用营销系统',
                                fieldName: 'taxSubjectConfigBO.unusedMarketingSystem',
                                type: 'checkbox',
                                span: 6,
                                formItemStyle:{
                                    labelCol:{
                                        span:20
                                    },
                                    wrapperCol:{
                                        span:4
                                    }
                                },
                                fieldDecoratorOptions: {
                                    initialValue: defaultData!==null && parseInt(defaultData.unusedMarketingSystem,0) === 1,
                                    valuePropName: 'checked',
                                },
                                componentProps: {
                                    disabled,
                                },
                            },{

                                label: '未使用喜盈佳发票平台',
                                fieldName: 'taxSubjectConfigBO.unusedInvoicePlatform',
                                type: 'checkbox',
                                span: 6,
                                formItemStyle:{
                                    labelCol:{
                                        span:20
                                    },
                                    wrapperCol:{
                                        span:4
                                    }
                                },
                                fieldDecoratorOptions: {
                                    initialValue: defaultData!==null && parseInt(defaultData.unusedInvoicePlatform,0) === 1,
                                    valuePropName: 'checked',
                                },
                                componentProps: {
                                    disabled,
                                },
                            },
                            {

                                label: '线下开票（服务器版开票）',
                                fieldName: 'taxSubjectConfigBO.offlineBillingInvoice',
                                type: 'checkbox',
                                span: 6,
                                formItemStyle:{
                                    labelCol:{
                                        span:20
                                    },
                                    wrapperCol:{
                                        span:4
                                    }
                                },
                                fieldDecoratorOptions: {
                                    initialValue: defaultData!==null && parseInt(defaultData.offlineBillingInvoice,0) === 1,
                                    valuePropName: 'checked',
                                },
                                componentProps: {
                                    disabled,
                                },
                            }
                        ])
                    }

                </Row>
            </div>
        )
    }
}