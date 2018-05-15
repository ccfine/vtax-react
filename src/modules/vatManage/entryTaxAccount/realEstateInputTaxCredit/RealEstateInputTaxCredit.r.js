/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import DeductibleInputTaxAmount from './deductibleInputTaxAmount'
import FixedAssetsInputTaxDetails from './fixedAssetsInputTaxDetails'
import SelfBuiltTransferFixedAssetsInputTaxDetails from './selfBuiltTransferFixedAssetsInputTaxDetails'
const TabPane = Tabs.TabPane;

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
        return(
            <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey}>
                <TabPane tab="待抵扣进项税额" key="1">
                    <DeductibleInputTaxAmount />
                </TabPane>
                <TabPane tab="固定资产进项税额明细" key="2">
                    <FixedAssetsInputTaxDetails />
                </TabPane>
                <TabPane tab="自建转自用固定资产进项税额明细" key="3">
                    <SelfBuiltTransferFixedAssetsInputTaxDetails />
                </TabPane>
            </Tabs>
        )
    }
}