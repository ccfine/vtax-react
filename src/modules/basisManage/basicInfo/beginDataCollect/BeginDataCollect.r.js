/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react';
import {Tabs} from 'antd';
import TaxMain from './taxMain';
import ProfitCenter from './profitCenter';

const TabPane = Tabs.TabPane;

const tabList = [{
    key: 'tab1',
    tab: '纳税主体期初数据采集',
}, {
    key: 'tab2',
    tab: '利润中心期初数据采集',
}];

const getContent = (key) => {
    const contentList = {
        tab1: <TaxMain />,
        tab2: <ProfitCenter />,
    };
    return contentList[key]
}
export default class BeginDataCollect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'tab1',
            tabsKey:Date.now(),
        };
        this.mounted = true;
    }

    onTabChange = (key) => {
        this.mounted && this.setState(
            { activeKey: key }
            //     , () => {
            //     this.refreshTabs();
            // }
        );
    }

    refreshTabs = ()=>{
        this.mounted && this.setState({
            tabsKey:Date.now()
        })
    }

    componentWillUnmount(){
        this.mounted = null;
    }

    render(){
        const { tabsKey, activeKey} = this.state;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} activeKey={activeKey} type={'line'} tabBarStyle={{backgroundColor:'#FFF'}}>
                {
                    tabList.map(ele=>(
                        <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                            {
                                getContent(ele.key)
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}