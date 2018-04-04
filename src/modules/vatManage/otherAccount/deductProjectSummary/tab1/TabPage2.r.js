/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable} from '../../../../../compoments'
import {Card} from 'antd'
import {fMoney} from '../../../../../utils'

const columns=[
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
    }, {
        title: '项目分期代码',
        dataIndex: 'stagesNum',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    },{
        title: '本期发生额',
        dataIndex: 'currentAmount',
        render:text=>fMoney(text),
    },{
        title: '本期实际扣除金额',
        dataIndex: 'actualDeductAmount',
        render:text=>fMoney(text),
    }
];

export default class TabPage extends Component{
    state={
        visible:false,
        updateKey:Date.now(),
    }
    hideModal(){
        this.setState({visible:false});
    }
    update(){
        this.setState({updateKey:Date.now()})
    }
    componentDidMount(){
        if(this.props.selectedRows.length >0 ) {
            this.setState({
                updateKey: Date.now()
            });
        }
    }
    render(){
        const props = this.props;
        return(
            <Card title="项目分期信息" style={{marginTop:10}} >
                <AsyncTable url="/account/land/price/deducted/stages/list"
                            updateKey={this.state.updateKey}
                            filters={{
                                ...props.filters,
                                projectId:props.selectedRows.length>0 && props.selectedRows[0].projectId
                            }}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:false,
                                size:'small',
                                columns:columns,
                            }} />
            </Card>
        )
    }
}