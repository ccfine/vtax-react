/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../compoments'
const searchFields = [
    {
        label: '纳税主体',
        type: 'taxMain',
        fieldName: 'mainId',
    }
]
const columns = [{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '档案类型',
    dataIndex: 'taxType',
},{
    title: '归档日期',
    dataIndex: 'type',
},{
    title: '归档资料名称',
    dataIndex: 'documentNum',
}];

export default class OtherFiles extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/tax/preferences/list'
                }}
            >
            </SearchTable>
        )
    }
}