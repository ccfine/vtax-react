/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import DeductibleInputTaxAmount from './deductibleInputTaxAmount'
import FixedAssetsInputTaxDetails from './fixedAssetsInputTaxDetails'
import SelfBuiltTransferFixedAssetsInputTaxDetails from './selfBuiltTransferFixedAssetsInputTaxDetails'
import {getUrlParam} from 'utils'
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
const searchFields=(disabled)=> {
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
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
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
export default class RealEstateInputTaxCredit extends Component{
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
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey}>
                <TabPane tab="固定资产进项税额明细" key="1">
                    <FixedAssetsInputTaxDetails searchFields={searchFields(disabled)} />
                </TabPane>
                <TabPane tab="待抵扣进项税额" key="2">
                    <DeductibleInputTaxAmount searchFields={searchFields(disabled)} />
                </TabPane>
                <TabPane tab="自建转自用固定资产进项税额明细" key="3">
                    <SelfBuiltTransferFixedAssetsInputTaxDetails searchFields={searchFields(disabled)} />
                </TabPane>
            </Tabs>
        )
    }
}