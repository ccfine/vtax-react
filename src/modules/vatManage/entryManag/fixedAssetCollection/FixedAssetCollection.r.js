/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react';
import moment from 'moment';
import {Tabs} from 'antd';
import External from './external';
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
const list = (disabled,declare,getFieldValue) => [
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:8,
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
    },
    {
        label: '纳税申报期',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span:8,
        formItemStyle,
        componentProps: {
            format: 'YYYY-MM',
            disabled
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
            rules: [
                {
                    required: true,
                    message: '请选择查询期间'
                }
            ]
        },
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount: !declare,
            fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    },
    {
        label:'项目分期',
        fieldName:'stageId',
        type:'asyncSelect',
        span:8,
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
const searchFields =  (key,disabled,declare) => (getFieldValue) => {
    let result = [];
    switch (key) {
        case 'tab1':
            result = [
                ...list(disabled,declare,getFieldValue),
                {
                    label: "取得方式",
                    fieldName: "acquisitionMode",
                    span:8,
                    formItemStyle,
                    type: "select",
                    options: [ //0-外部获取,1-单独新建，2-自建转自用
                        {
                            text: "外部获取",
                            value: "0"
                        },
                        {
                            text: "自建转自用",
                            value: "2"
                        }
                    ]
            
                },
            ];
            break;
        case 'tab2':
            result = [...list(disabled,declare,getFieldValue)];
            break;
        default:
            break;
    }
    return result;
}

const tabList = [{
    key: 'tab1',
    tab: '不动产卡片',
}, {
    key: 'tab2',
    tab: '自持产品清单',
}];

const getContent = (key,disabled,declare,context) => {
    const contentList = {
        tab1: <External declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab2: <NewBuild declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
    };
    return contentList[key]
}
 class FixedAssetCollection extends Component{
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
        const { tabsKey, activeKey } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Tabs key={tabsKey} onChange={this.onTabChange} activeKey={activeKey} type={'line'} tabBarStyle={{backgroundColor:'#FFF'}}>
                {
                    tabList.map(ele=>(
                        <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                            {
                                getContent(ele.key, disabled, declare, this)
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}
export default FixedAssetCollection

