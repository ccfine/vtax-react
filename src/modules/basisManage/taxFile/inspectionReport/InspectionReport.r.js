/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../compoments'
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    },
    {
        label:'纳税主体',
        type:'yearSelect',
        fieldName:'checkImplementYear',
    },
]
const columns = [{
    title: '编码',
    dataIndex: 'mainCode',
}, {
    title: '纳税主体',
    dataIndex: 'mainName',
},{
    title: '检查组',
    dataIndex: 'checkSets',
},{
    title: '检查类型',
    dataIndex: 'checkType',
},{
    title: '检查期间',
    dataIndex: 'checkStart',
    render:(text,record)=><span>{record.checkStart}-{record.checkEnd}</span>
},{
    title: '检查实施时间',
    dataIndex: 'checkImplementStart',
    render:(text,record)=><span>{record.checkImplementStart}-{record.checkImplementEnd}</span>
},{
    title: '文档编号',
    dataIndex: 'documentNum',
},{
    title: '补缴税款',
    dataIndex: 'taxPayment',
},{
    title: '滞纳金',
    dataIndex: 'lateFee',
},{
    title: '罚款',
    dataIndex: 'fine',
},{
    title: '是否有附件',
    dataIndex: 'isAttachment',
    render:text=>parseInt(text,0) === 1?'是':'否'
}]

export default class InspectionReport extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/report/list'
                }}
            >
            </SearchTable>
        )
    }
}