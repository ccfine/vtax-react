/**
 * Created by liurunbin on 2018/1/15.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import ConfirmCarryOverPage from './confirmCarryOver'
import AdvanceCarryOver from './advanceCarryOver'
import InvoicesWithNeedNotMatchRoom from './invoicesWithNeedNotMatchRoom'
const TabPane = Tabs.TabPane;

export default class UnbilledAales extends Component{
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
                <TabPane tab="确认结转收入" key="1">
                    <ConfirmCarryOverPage />
                </TabPane>
                <TabPane tab="预结转收入" key="2">
                    <AdvanceCarryOver />
                </TabPane>
                <TabPane tab="无需匹配房号的发票" key="3">
                    <InvoicesWithNeedNotMatchRoom />
                </TabPane>
            </Tabs>
        )
    }
}