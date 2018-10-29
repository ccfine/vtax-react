/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import RoomTransactionFilePage from './roomTransactionFile'
import InvoiceDataMatching from './invoiceDataMatching'
import UnmatcedData from './unmatchedData'
import NeedNotMatchInvoices from './needNotMatchInvoices'
// import { getUrlParam } from 'utils'
const TabPane = Tabs.TabPane;
class SalesInvoiceMatching extends Component{
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
        this.setState({activeKey:this.props.activeTab || '1'})
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.activeTab && nextProps.activeTab!==this.props.activeTab){
            this.setState({activeKey:nextProps.activeTab})
        }
    }

    refreshTabs = ()=>{
        this.setState({
            tabsKey:Date.now()
        })
    }

    render(){
        const {tabsKey,activeKey} = this.state,
        {declare} = this.props;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} type={'line'} tabBarStyle={{backgroundColor:'#FFF'}} activeKey={activeKey}>
                <TabPane tab="房间交易档案" key="1">
                    <RoomTransactionFilePage declare={declare}/>
                </TabPane>
                <TabPane tab="销项发票数据匹配" key="2">
                    <InvoiceDataMatching refreshTabs={this.refreshTabs} declare={declare}/>
                </TabPane>
                <TabPane tab="未匹配的发票列表" key="3">
                    <UnmatcedData refreshTabs={this.refreshTabs} declare={declare}/>
                </TabPane>
                <TabPane tab="无需匹配的发票列表" key="4">
                    <NeedNotMatchInvoices  refreshTabs={this.refreshTabs} declare={declare}/>
                </TabPane>
            </Tabs>
        )
    }
}

export default SalesInvoiceMatching