/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import RoomTransactionFilePage from './roomTransactionFile'
import InvoiceDataMatching from './invoiceDataMatching'
import UnmatcedData from './unmatchedData'
import NeedNotMatchInvoices from './needNotMatchInvoices'
import { getUrlParam } from 'utils'
const TabPane = Tabs.TabPane;

export default class SalesInvoiceMatching extends Component{
    state = {
        activeKey:'1',
        tabsKey:Date.now()
    }
    onTabChange = activeKey =>{
        this.setState({
            activeKey
        })
    }
    componentDidMount(){
        const activeKey = getUrlParam('tab');
        activeKey && this.setState({activeKey})
    }

    refreshTabs = ()=>{
        this.setState({
            tabsKey:Date.now()
        })
    }

    render(){
        const {tabsKey,activeKey} = this.state;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} type="card" activeKey={activeKey}>
                <TabPane tab="房间交易档案" key="1">
                    <RoomTransactionFilePage />
                </TabPane>
                <TabPane tab="销项发票数据匹配列表" key="2">
                    <InvoiceDataMatching refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="未匹配的发票列表" key="3">
                    <UnmatcedData refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="无需匹配的发票列表" key="4">
                    <NeedNotMatchInvoices  refreshTabs={this.refreshTabs} />
                </TabPane>
            </Tabs>
        )
    }
}