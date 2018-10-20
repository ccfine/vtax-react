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

const TabPane = Tabs.TabPane;
const tabList = [{
    key: 'tab1',
    tab: '主表项目期初数据/其他项目期初数据'
}, {
    key: 'tab6',
    tab: '房间交易档案期初信息',
}, {
    key: 'tab2',
    tab: '税额抵减项目期初数据',
}, {
    key: 'tab5',
    tab: '土地价款期初数据',
}, {
    key: 'tab4',
    tab: '其他应税项目扣除（不含土地价款扣除）期初数据',
}, {
    key: 'tab3',
    tab: '减税项目期初数据',
}];

const getContent = (key,mainId,disabled,updateKey) => {
    const contentList = {
        tab1: <Tab1 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab2: <Tab2 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab3: <Tab3 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab4: <Tab4 mainId={mainId} disabled={disabled} updateKey={updateKey} />,
        tab5: <Tab5 mainId={mainId} disabled={disabled} updateKey={updateKey} />,
        tab6: <Tab6 mainId={mainId} disabled={disabled} updateKey={updateKey} />,
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
        updateKey:Date.now(),
        tabPosition: 'top',
    }
    onTabChange = (key, type) => {
        this.mounted && this.setState({ [type]: key });
    }
    componentDidMount(){
        this.setState({
            updateKey: Date.now()
        });
    }
    render(){
        const props = this.props;
        return(
            <Tabs tabPosition={this.state.tabPosition} size="small">
                {
                    tabList.map(ele=>(
                        <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                            {
                                getContent(ele.key, props.mainId, props.disabled, this.state.updateKey)
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}