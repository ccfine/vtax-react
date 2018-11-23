/**
 * Created by liuliyuan on 2018/10/20.
 */
import React, { Component } from 'react'
import {Tabs} from 'antd';
import Tab1 from './tab_1';
import Tab2 from './tab_2';
import Tab3 from './tab_3';
import Tab4 from './tab_4';
import Tab5 from './tab_5';
import Tab6 from './tab_6';
//import Tab7 from './tab_7';
import Tab8 from './tab_8';

const TabPane = Tabs.TabPane;
const tabList = [{
    key: 'tab1',
    tab: '主表项目期初数据/其他项目期初数据'
}, {
    key: 'tab2',
    tab: '税额抵减项目期初数据',
}, {
    key: 'tab3',
    tab: '减免税项目期初数据',
}, {
    key: 'tab4',
    tab: '其他应税项目扣除（不含土地价款扣除）期初数据',
}, {
    key: 'tab5',
    tab: '土地价款期初数据',
}, {
    key: 'tab6',
    tab: '房间交易档案期初信息',
/*}, {
    key: 'tab7',
    tab: '自建转自用固定资产期初数据',*/
}, {
    key: 'tab8',
    tab: '非地产未开票期初数据',
}];

const getContent = (key,filters,disabled,beginType) => {
    const contentList = {
        tab1: <Tab1 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab2: <Tab2 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab3: <Tab3 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab4: <Tab4 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab5: <Tab5 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab6: <Tab6 filters={filters} disabled={disabled} beginType={beginType}/>,
        tab8: <Tab8 filters={filters} disabled={disabled} beginType={beginType}/>,
    };
    return contentList[key]
}
export default class TabPage extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state = {
        key: 'tab1',
        tabPosition: 'top',
    }
    onTabChange = (key, type) => {
        this.mounted && this.setState({ [type]: key });
    }
    render(){
        const props = this.props;
        return(
            <Tabs tabPosition={this.state.tabPosition} size="small">
                {
                    tabList.map(ele=>{
                        return !((ele.key === 'tab6') && props.beginType==='2') && (
                            <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                                {
                                    getContent(ele.key, props.filters, props.disabled, props.beginType)
                                }
                            </TabPane>
                        )
                    })
                }
            </Tabs>
        )
    }
}