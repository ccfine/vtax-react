/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react';
import {Tabs} from 'antd';
import External from './external';
import SelfUse from './selfUse';
import NewBuild from './newBuild';

const TabPane = Tabs.TabPane;
 class FixedAssetCollection extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1',
            tabsKey:Date.now(),
        };
        this.mounted = true;
    }

    onTabChange = activeKey => {
        this.mounted && this.setState({
            activeKey
        });
        if (this.state.activeKey !== activeKey) {
            this.refreshTabs();
        }
    }

    refreshTabs = ()=>{
        this.mounted && this.setState({
            tabsKey:Date.now()
        });
    }

    componentWillUnmount(){
        this.mounted = null;
    }

    render(){
        const { tabsKey, activeKey } = this.state;
        const { declare } = this.props;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} type={!!declare?'line':"card"} tabBarStyle={!!declare?{backgroundColor:'#FFF'}:{}} activeKey={activeKey}>
                <TabPane tab="外部获取固定资产" key="1">
                    <External refreshTabs={this.refreshTabs} declare={declare} />
                </TabPane>
                <TabPane tab="自建转自用固定资产" key="2">
                    <SelfUse refreshTabs={this.refreshTabs} declare={declare} />
                </TabPane>
                <TabPane tab="单独新建固定资产" key="3">
                    <NewBuild refreshTabs={this.refreshTabs} declare={declare} />
                </TabPane>
            </Tabs>
        )
    }
}
export default FixedAssetCollection

