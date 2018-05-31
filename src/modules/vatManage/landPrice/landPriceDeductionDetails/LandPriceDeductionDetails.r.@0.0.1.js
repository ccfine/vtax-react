/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:42:14 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-31 17:14:28
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Tabs} from 'antd'
import HasDeduct from './hasDeduct'
import ShouldDeduct from './shouldDeduct'
import moment from 'moment'

const TabPane = Tabs.TabPane;
const formItemStyle = {
    labelCol: {
        sm: { span: 10 },
        xl: { span: 8 }
    },
    wrapperCol: {
        sm: { span: 14 },
        xl: { span: 16 }
    }
}
const searchFields = (disabled,declare) => getFieldValue => {
    return [
        {
            label: '纳税主体',
            fieldName: 'mainId',
            type: 'taxMain',
            span: 6,
            formItemStyle,
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && declare.mainId) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税主体'
                    }
                ]
            }
        },
        {
            label: '纳税申报期',
            fieldName: 'authMonth',
            type: 'monthPicker',
            span: 6,
            formItemStyle,
            componentProps: {
                format: 'YYYY-MM',
                disabled: disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                (disabled && moment(declare.authMonth, 'YYYY-MM')) ||
                undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税申报期'
                    }
                ]
            }
        },
        {
            label: '项目名称',
            fieldName: 'projectId',
            type: 'asyncSelect',
            span: 6,
            formItemStyle,
            componentProps: {
                fieldTextName: 'itemName',
                fieldValueName: 'id',
                doNotFetchDidMount: true,
                fetchAble: getFieldValue('mainId') || false,
                url: `/project/list/${getFieldValue('mainId')}`
            }
        },
        {
            label: '项目分期',
            fieldName: 'stagesId',
            type: 'asyncSelect',
            span: 6,
            formItemStyle,
            componentProps: {
                fieldTextName: 'itemName',
                fieldValueName: 'id',
                doNotFetchDidMount: true,
                fetchAble: getFieldValue('projectId') || false,
                url: `/project/stages/${getFieldValue('projectId') || ''}`
            }
        }
    ]
}

class DeductProjectSummary extends Component {
    state = {
        activeKey:'1'
    }
    onTabChange = activeKey =>{
        this.setState({
            activeKey
        })
    }
    refreshTabs = ()=>{
        this.setState({
            tabsKey:Date.now()
        })
    }
    render(){
        const {activeKey,tabsKey} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
                <Tabs key={tabsKey} onChange={this.onTabChange} type="card" activeKey={activeKey}>
                    <TabPane tab="土地价款当期应抵扣" key="1">
                        <ShouldDeduct declare={declare} searchFields={searchFields(disabled,declare)}/>
                    </TabPane>
                    <TabPane tab="土地价款当期实际扣除" key="2">
                        <HasDeduct declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs}/>
                    </TabPane>
                </Tabs>
            )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
}))(DeductProjectSummary)