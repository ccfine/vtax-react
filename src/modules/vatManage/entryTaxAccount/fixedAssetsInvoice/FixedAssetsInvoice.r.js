/**
 * Created by liuliyuan on 2018/10/12.
 */
import React,{Component} from 'react';
import moment from 'moment';
import {Tabs} from 'antd';
import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';

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
const list =(disabled,declare,getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:6,
        formItemStyle,
        componentProps:{
            labelInValue:true,
            disabled,
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
    {
        label:'纳税申报期',
        fieldName:'authMonth',
        type:'monthPicker',
        span:6,
        formItemStyle,
        componentProps:{
            format:'YYYY-MM',
            disabled:disabled
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            rules: disabled ? [
                {
                    required:true,
                    message:'请选择查询期间'
                }
            ] : []
        },
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:6,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount:false,
            fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    },
    {
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
const searchFields =(key,disabled,declare)=>(getFieldValue)=> {
    let result = [];
    switch (key){
        case 'tab1':
            result = [
                ...list(disabled,declare,getFieldValue),
                {
                    label: "发票号码",
                    fieldName: "invoiceNum",
                    type: "input",
                    span: 6,
                    formItemStyle,
                    componentProps: {},
                    fieldDecoratorOptions: {}
                }
            ]
            break
        case 'tab2':
            result = [
                ...list(disabled,declare,getFieldValue),
                {
                    label: "固定资产名称",
                    fieldName: "assetName",
                    type: "input",
                    span: 6,
                    formItemStyle,
                    componentProps: {},
                    fieldDecoratorOptions: {}
                },
                {
                    label: "固定资产编号",
                    fieldName: "assetNo",
                    type: "input",
                    span: 6,
                    formItemStyle,
                    componentProps: {},
                    fieldDecoratorOptions: {}
                },
                {
                    label: "发票号码",
                    fieldName: "invoiceNum",
                    type: "input",
                    span: 6,
                    formItemStyle,
                    componentProps: {},
                    fieldDecoratorOptions: {}
                }
            ]
            break
        case 'tab3':
            result = list(disabled,declare,getFieldValue)
            break
        default:
        //break
    }
    return result
}

const tabList = [{
    key: 'tab1',
    tab: '单独新建自持类进项发票',
}, {
    key: 'tab2',
    tab: '自建转自用自持类进项发票',
}, {
    key: 'tab3',
    tab: '自建转自用综合税率',
}];

const getContent = (key,updateKey,disabled,declare,context) => {
    const contentList = {
        tab1: <Tab1 updateKey={updateKey} declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab2: <Tab2 updateKey={updateKey} declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab3: <Tab3 updateKey={updateKey} declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
    };
    return contentList[key]
}


export default class FixedAssetsInvoice extends Component{
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
    render() {
        const { activeKey, tabsKey, updateKey } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return (
            <Tabs key={tabsKey} onChange={this.onTabChange} activeKey={activeKey} tabPosition="top" tabBarStyle={{backgroundColor:'#FFF'}}>
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
        );
    }
}