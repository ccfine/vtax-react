/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import { Tabs } from 'antd';
import DeductibleInputTaxAmount from './deductibleInputTaxAmount'
import FixedAssetsInputTaxDetails from './fixedAssetsInputTaxDetails'
import SelfBuiltTransferFixedAssetsInputTaxDetails from './selfBuiltTransferFixedAssetsInputTaxDetails'
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
            span:8,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && declare.mainId) || undefined,
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
            span:8,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
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
class RealEstateInputTaxCredit extends Component{
    state = {
        activeKey:'1',
        tabsKey:Date.now()
    }
    onTabChange = activeKey =>{
        this.setState({
            activeKey
        },()=>{
            this.refreshTabs()
        })
    }
    refreshTabs = ()=>{
        this.setState({
            tabsKey:Date.now()
        })
    }
    render(){
        const {tabsKey,activeKey} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} type="card" activeKey={activeKey}>
                <TabPane tab="固定资产进项税额明细" key="1">
                    <FixedAssetsInputTaxDetails declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="待抵扣进项税额" key="2">
                    <DeductibleInputTaxAmount declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="自建转自用固定资产进项税额明细" key="3">
                    <SelfBuiltTransferFixedAssetsInputTaxDetails declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
            </Tabs>
        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(RealEstateInputTaxCredit)