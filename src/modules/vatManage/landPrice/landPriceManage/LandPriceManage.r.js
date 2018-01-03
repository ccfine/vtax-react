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
        title: '项目编码',
        dataIndex: 'itemNum',
    },{
        title: '项目名称',
        dataIndex: 'itemName',
    },{
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    },{
        title: '合同建筑面积(m²)',
        dataIndex: 'coveredArea',
    },{
        title: '调整后建筑面积(m²)',
        dataIndex: 'buildArea',
    },{
        title: '可抵扣地价款',
        dataIndex: 'deductibleLandPrice',
    },{
        title: '实际已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
    },{
        title: '已售建筑面积(m²)',
        dataIndex: 'saleArea',
    }
];

export default class LandPriceManage extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/landPriceInfo/list'
                }}
            >
            </SearchTable>
        )
    }
}