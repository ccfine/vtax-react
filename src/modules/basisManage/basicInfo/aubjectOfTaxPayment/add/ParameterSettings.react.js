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
                        getFields(this.props.form,[

                            {

                                label: '非地产收入不参与预缴税款抵减',
                                fieldName: 'taxSubjectConfigBO.prepayTaxesDeduction',
                                type: 'checkbox',
                                span: 12,
                                formItemStyle:{
                                    labelCol:{
                                        span:10
                                    },
                                    wrapperCol:{
                                        span:7
                                    }
                                },
                                fieldDecoratorOptions: {
                                    initialValue: defaultData!==null && parseInt(defaultData.prepayTaxesDeduction,0) === 1,
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