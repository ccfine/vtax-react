/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
import SelfBuiltToSelfUse from './selfBuiltToSelfUse'
import ExternalAccess from './externalAccess'
import NewlyBuilt from './newlyBuilt'
import Summary from './summary'
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
const searchFields=(disabled,declare) => (getFieldValue) => {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'main',
            span:6,
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
            label:'纳税申报期',
            type:'monthPicker',
            formItemStyle,
            span:6,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required:true,
                        message:`请选择查询期间`
                    }
                ]
            }
        }, {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        },{
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
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
            <Tabs key={tabsKey} onChange={this.onTabChange} tabBarStyle={{backgroundColor:'#FFF'}} activeKey={activeKey}>
                <TabPane tab="不动产进项税额抵扣汇总" key="1">
                    <Summary declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="外部获取不动产进项税额抵扣" key="2">
                    <ExternalAccess declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="自建转自用自不动产进项税额抵扣" key="3">
                    <SelfBuiltToSelfUse declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
                <TabPane tab="单独新建不动产进项税额抵扣" key="4">
                    <NewlyBuilt declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs} />
                </TabPane>
            </Tabs>
        )
    }
}
export default RealEstateInputTaxCredit