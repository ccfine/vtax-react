/**
 * Created by liuliyuan on 2018/5/13.
 */
import React,{Component} from 'react'
import { Tabs } from 'antd';
//import SelfBuiltToSelfUse from './selfBuiltToSelfUse'
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

const list = (disabled,declare,getFieldValue) => [
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
    },
    {
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
            doNotFetchDidMount: !declare,
            fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
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
];

const searchFields=(key,disabled,declare) => (getFieldValue) => {
    let result = [];
    switch (key) {
        case 'tab1':
            result = [...list(disabled,declare,getFieldValue)];
            break;
        case 'tab2':
            result = [
                ...list(disabled,declare,getFieldValue),
                {
                    label: "取得方式",
                    fieldName: "acquisitionMode",
                    span:6,
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
        case 'tab3':
            // result = [
            //     ...list(disabled,declare,getFieldValue),
            //     {
            //         label: "转固单号",
            //         fieldName: "rotaryNum",
            //         type: "input",
            //         span: 6,
            //         formItemStyle,
            //         componentProps: {},
            //         fieldDecoratorOptions: {}
            //     },
            //     {
            //         label: "产品编码",
            //         fieldName: "productNum",
            //         type: "input",
            //         span: 6,
            //         formItemStyle,
            //         componentProps: {},
            //         fieldDecoratorOptions: {}
            //     }
            // ];
            result = [...list(disabled,declare,getFieldValue)];
            break;
        // case 'tab4':
        //     result = [...list(disabled,declare,getFieldValue)];
        //     break;
        default:
        //break;
    }
    return result;
}
const tabList = [{
    key: 'tab1',
    tab: '不动产进项税额抵扣汇总',
}, {
    key: 'tab2',
    tab: '不动产卡片进项税额抵扣',
}, {
    key: 'tab3',
    tab: '单独新建不动产进项税额抵扣',
// }, {
//     key: 'tab4',
//     tab: '自建转自用不动产进项税额抵扣',
}];

const getContent = (key,disabled,declare,context) => {
    const contentList = {
        tab1: <Summary declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab2: <ExternalAccess declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        tab3: <NewlyBuilt declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
        //tab4: <SelfBuiltToSelfUse declare={declare} searchFields={ searchFields(key,disabled,declare) } refreshTabs={context.refreshTabs}/>,
    };
    return contentList[key]
}
class RealEstateInputTaxCredit extends Component{
    state = {
        activeKey:'tab1',
        tabsKey:Date.now(),
    }
    onTabChange = (key) => {
        this.mounted && this.setState({ activeKey: key }
            // , () => {
            //     this.refreshTabs();
            // }
        );
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
export default RealEstateInputTaxCredit