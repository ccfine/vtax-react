/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import {connect} from 'react-redux';
import InputTaxCertificate from './inputTaxCertificate'
import SimpleTaxCertificate from './simpleTaxCertificate'
import GeneralTaxCertificate from './generalTaxCertificate'
import SimplifiedTaxInputTaxTransfer from './simplifiedTaxInputTaxTransfer'
import moment from 'moment';
const TabPane = Tabs.TabPane;

const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'mainId',
            span:6,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && declare['mainId']) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },

        }, {
            label:'凭证月份',
            type:'monthPicker',
            formItemStyle,
            span:6,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择凭证月份'
                    }
                ]
            }
        }
    ]
}
class SimpleTaxInputTaxTransferredToTheAccount extends Component{
    state = {
        activeKey:'1'
    }
    onTabChange = activeKey =>{
        this.setState({
            activeKey
        })
    }
    render(){
        const {activeKey} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey}>
                <TabPane tab="进项税额" key="1">
                    <InputTaxCertificate searchFields={searchFields(disabled,declare)} />
                </TabPane>
                <TabPane tab="简易计税" key="2">
                    <SimpleTaxCertificate searchFields={searchFields(disabled,declare)} />
                </TabPane>
                <TabPane tab="一般计税" key="3">
                    <GeneralTaxCertificate searchFields={searchFields(disabled,declare)} />
                </TabPane>
                <TabPane tab="简易计税进项税额转出" key="4">
                    <SimplifiedTaxInputTaxTransfer searchFields={searchFields(disabled,declare)} />
                </TabPane>
            </Tabs>
        )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
  }))(SimpleTaxInputTaxTransferredToTheAccount);