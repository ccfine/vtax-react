/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import DeductibleInputTaxAmount from './deductibleInputTaxAmount'
import FixedAssetsInputTaxDetails from './fixedAssetsInputTaxDetails'
import SelfBuiltTransferFixedAssetsInputTaxDetails from './selfBuiltTransferFixedAssetsInputTaxDetails'
import moment from 'moment';
const TabPane = Tabs.TabPane;

const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'main',
            span:8,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },

        }, {
            label:'查询期间',
            type:'monthPicker',
            formItemStyle,
            span:8,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:`请选择查询期间`
                    }
                ]
            }
        }
    ]
}
class RealEstateInputTaxCredit extends Component{
    state = {
        activeKey:'1',
        tabsKey:Date.now()
    }
    onTabChange = activeKey =>{
        this.mounted && this.setState({
            activeKey
        },()=>{
            this.refreshTabs()
        })
    }
    refreshTabs = ()=>{
        this.mounted && this.setState({
            tabsKey:Date.now()
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tabsKey,activeKey} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} type={!!declare?'line':"card"} tabBarStyle={!!declare?{backgroundColor:'#FFF'}:{}} activeKey={activeKey}>
                <TabPane tab="固定资产进项税额明细" key="1">
                    <FixedAssetsInputTaxDetails declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="待抵扣进项税额" key="2">
                    <DeductibleInputTaxAmount declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="自建转自用固定资产进项税额明细" key="3">
                    <SelfBuiltTransferFixedAssetsInputTaxDetails declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
            </Tabs>
        )
    }
}
export default RealEstateInputTaxCredit