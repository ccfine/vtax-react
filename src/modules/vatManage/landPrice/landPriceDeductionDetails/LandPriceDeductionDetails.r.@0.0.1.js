/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:42:14 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-19 16:22:40
 */
import React,{Component} from 'react'
import {Tabs} from 'antd'
import HasDeduct from './hasDeduct'
import ShouldDeduct from './shouldDeduct'
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
                <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey}>
                    <TabPane tab="土地价款当期应抵扣" key="1">
                        <ShouldDeduct />
                    </TabPane>
                    <TabPane tab="土地价款当期实际扣除" key="2">
                        <HasDeduct />
                    </TabPane>
                </Tabs>
            )
    }
}