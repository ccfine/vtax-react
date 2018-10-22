/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react';
import moment from 'moment';
import {Tabs} from 'antd';
import External from './external';
import SelfUse from './selfUse';
import NewBuild from './newBuild';

const TabPane = Tabs.TabPane;

const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields =  (disabled,declare) => (getFieldValue) => {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        }, {
            label: '纳税申报期',
            fieldName: 'authMonth',
            type: 'monthPicker',
            formItemStyle,
            span: 6,
            componentProps: {
                format: 'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: disabled ? [
                    {
                        required: true,
                        message: '请选择查询期间'
                    }
                ] : []
            },
        }, {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        }, {
            label:'项目分期',
            fieldName:'stageId',
            type:'asyncSelect',
            span:6,
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

const tabList = [{
    key: 'tab1',
    tab: '外部获取固定资产',
}, {
    key: 'tab2',
    tab: '自建转自用固定资产',
}, {
    key: 'tab3',
    tab: '单独新建固定资产',
}];

const getContent = (key,updateKey,disabled,declare,context) => {
    const contentList = {
        tab1: <External updateKey={updateKey} declare={declare} searchFields={ searchFields(disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab2: <SelfUse updateKey={updateKey} declare={declare} searchFields={ searchFields(disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab3: <NewBuild updateKey={updateKey} declare={declare} searchFields={ searchFields(disabled,declare) } refreshTabs={context.refreshTabs}/>,
    };
    return contentList[key]
}
 class FixedAssetCollection extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'tab1',
            tabsKey:Date.now(),
            updateKey:Date.now(),
        };
        this.mounted = true;
    }

    onTabChange = (key) => {
        this.mounted && this.setState({ activeKey: key }, () => {
            this.refreshTabs();
        });
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
        const { tabsKey, activeKey, updateKey } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} activeKey={activeKey} type={'line'} tabBarStyle={{backgroundColor:'#FFF'}}>
                {
                    tabList.map(ele=>(
                        <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                            {
                                getContent(ele.key, updateKey, disabled, declare, this)
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}
export default FixedAssetCollection

