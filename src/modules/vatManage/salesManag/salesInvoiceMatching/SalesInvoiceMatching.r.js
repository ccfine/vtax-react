/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import RoomTransactionFilePage from './roomTransactionFile'
import InvoiceDataMatching from './invoiceDataMatching'
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}
export default class SalesInvoiceMatching extends Component{
    render(){
        return(
            <Tabs onChange={callback} type="card" activeKey={'2'}>
                <TabPane tab="房间交易档案" key="1">
                    <RoomTransactionFilePage />
                </TabPane>
                <TabPane tab="销项发票数据匹配列表" key="2">
                    <InvoiceDataMatching />
                </TabPane>
                <TabPane tab="未匹配的发票列表" key="3">Content of Tab Pane 3</TabPane>
                <TabPane tab="无需匹配的发票列表" key="4">Content of Tab Pane 3</TabPane>
            </Tabs>
        )
    }
}