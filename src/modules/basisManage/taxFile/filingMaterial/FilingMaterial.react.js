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
    }
]
const columns = [
    {
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '备案资料类型',
    dataIndex: 'recordType',
},{
    title: '备案日期',
    dataIndex: 'recordDate',
},{
    title: '备案资料名称',
    dataIndex: 'recordName',
},{
    title: '涉及税费种',
    dataIndex: 'taxFeeCategory',
},{
    title: '是否有附件',
    dataIndex: 'isAttachment',
    render:text=>parseInt(text,0) === 1 ?'有':'无'
}
];

export default class FilingMaterial extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/sys/recordInfo/list'
                }}
            >
            </SearchTable>
        )
    }
}