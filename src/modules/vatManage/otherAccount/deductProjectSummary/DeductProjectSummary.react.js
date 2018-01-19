/**
 * author       : liuliyuan
 * createTime   : 2018/1/19 11:42
 * description  :
 */
import React,{Component} from 'react'
import {Tabs} from 'antd'
import LandPriceDeduction from './tab1'
import OtherTaxableItemsDeductedList from './tab2'
const TabPane = Tabs.TabPane;

export default class DeductProjectSummary extends Component {
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
                <Tabs style={{background:'#fff'}} onChange={this.onTabChange} type="card" activeKey={activeKey}>
                    <TabPane tab="土地价款扣除界面" key="1">
                        <LandPriceDeduction />
                    </TabPane>
                    <TabPane tab="其他应税项目扣除列表界面" key="2">
                        <OtherTaxableItemsDeductedList />
                    </TabPane>
                </Tabs>
            )
    }
}