/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import InputTaxCertificate from './inputTaxCertificate'
import SimpleTaxCertificate from './simpleTaxCertificate'
import GeneralTaxCertificate from './generalTaxCertificate'
import SimplifiedTaxInputTaxTransfer from './simplifiedTaxInputTaxTransfer'
const TabPane = Tabs.TabPane;

export default class SimpleTaxInputTaxTransferredToTheAccount extends Component{
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
                <TabPane tab="进项税额凭证" key="1">
                    <InputTaxCertificate />
                </TabPane>
                <TabPane tab="简易计税凭证" key="2">
                    <SimpleTaxCertificate />
                </TabPane>
                <TabPane tab="一般计税凭证" key="3">
                    <GeneralTaxCertificate />
                </TabPane>
                <TabPane tab="简易计税进项税额转出" key="4">
                    <SimplifiedTaxInputTaxTransfer />
                </TabPane>
            </Tabs>
        )
    }
}