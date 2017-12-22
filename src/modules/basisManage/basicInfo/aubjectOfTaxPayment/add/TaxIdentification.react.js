/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React, { Component } from 'react'
import { Checkbox, Row, Col, Form } from 'antd'
import './styles.less'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class TaxIdentification extends Component {

    state = {
        list: [
            {
                label:'流转税',
                fieldName: 'jbxx.lzs',
                data:[
                    {
                        label: '增值税',
                        value: 'zzs',
                    },{
                        label: '消费税',
                        value: 'xfs',
                        disabled: true,
                    }
                ]
            },{
                label:'所得税',
                fieldName: 'jbxx.sds',
                data:[
                    {
                        label: '企业所得税',
                        value: 'qysds',
                    },{
                        label: '个人所得税',
                        value: 'grsds',
                        disabled: true,
                    },
                ]
            }
        ]
    }

    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const checkboxformItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 20
            },
        };
        const {list} = this.state;

        return (
            <div className="basicInfo">
                {
                    list.map((item,i)=>{
                        return (
                            <Row key={i}>
                                <Col span={24}>
                                    <FormItem
                                        {...checkboxformItemLayout}
                                        label={item.label}
                                        className='vTax-CheckboxGroup'
                                    >
                                        {getFieldDecorator(item.fieldName, {
                                        })(
                                            <CheckboxGroup options={item.data} />
                                        )}
                                    </FormItem>

                                </Col>
                            </Row>
                        )
                    })
                }

            </div>
        )
    }
}
export default TaxIdentification