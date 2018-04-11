/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button, Icon } from 'antd'
import { SearchTable } from '../../../../compoments'
import { fMoney } from '../../../../utils'
import PopModal from './popModal'
const buttonStyle = {
    margin: '0 5px'
}
const searchFields = [
    {
        label: '纳税主体',
        type: 'taxMain',
        fieldName: 'mainId',
    },
    {
        label: '纳税主体',
        type: 'yearSelect',
        fieldName: 'checkImplementYear',
    },
]
const getColumns = context => ([
    {
        title: '操作',
        render(text, record, index) {
            return (<span>
                <a style={{margin:"0 5px" }} onClick={() => {
                    context.setState({ visible: true, action: 'modify', opid: record.id });
                }}>修改</a>
                <a style={{marginRight:5}} onClick={() => {
                    context.setState({ visible: true, action: 'look', opid: record.id });
                }}>查看</a>
            </span>)
        },
        fixed: 'left',
        width: '75px',
        dataIndex: 'action'
    }, {
        title: '纳税主体编码',
        dataIndex: 'mainCode',
    }, {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '检查组',
        dataIndex: 'checkSets',
    }, {
        title: '检查类型',
        dataIndex: 'checkTypeName',
    }, {
        title: '检查期间',
        dataIndex: 'checkStart',
        className:'text-center',
        render: (text, record) => <span>{record.checkStart} ~ {record.checkEnd}</span>
    }, {
        title: '检查实施时间',
        dataIndex: 'checkImplementStart',
        className:'text-center',
        render: (text, record) => <span>{record.checkImplementStart} ~ {record.checkImplementEnd}</span>
    }, {
        title: '文档编号',
        dataIndex: 'documentNum',
    }, {
        title: '补缴税款',
        dataIndex: 'taxPayment',
        render: text => fMoney(text),
        className: 'table-money'
    }, {
        title: '滞纳金',
        dataIndex: 'lateFee',
        render: text => fMoney(text),
        className: 'table-money'
    }, {
        title: '罚款',
        dataIndex: 'fine',
        render: text => fMoney(text),
        className: 'table-money'
    }, {
        title: '是否有附件',
        dataIndex: 'attachment',
        className:'text-center',
        render: text => text ? '是' : '否'
    }])

export default class InspectionReport extends Component {
    state={
        updateKey:Date.now(),
        visible:false,
        action:undefined,
        opid:undefined,
    }
    hideModal = ()=>{
        this.setState({ visible:false });
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    render() {
        let { updateKey } = this.state; 
        return (
            <SearchTable
                searchOption={{
                    fields: searchFields
                }}
                tableOption={{
                    columns: getColumns(this),
                    url: '/report/list',
                    key:updateKey,
                    extra: <div>
                        <Button size='small' style={buttonStyle} onClick={() => { this.setState({ visible: true, action: 'add', opid: undefined }) }}><Icon type="plus" />新增</Button>
                    </div>,
                    cardProps: {
                        title: '稽查报告'
                    },
                    scroll:{
                        x:'130%'
                    }
                }}
            >
                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => { this.hideModal() }}
                    id={this.state.opid}
                    update={this.update} />
            </SearchTable>
        )
    }
}