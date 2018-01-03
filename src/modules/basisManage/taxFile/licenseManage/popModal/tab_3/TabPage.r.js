/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
const columns = [
    {
        title: '批复文号',
        dataIndex: 'reply',
    }, {
        title: '占地面积(m²)',
        dataIndex: 'coveredArea',
    },{
        title: '总建筑面积(m²)',
        dataIndex: 'totalBuildingArea',
    },{
        title: '业态',
        dataIndex: 'type',
    },{
        title: '投资总额',
        dataIndex: 'totalAmount',
    },{
        title: '开发商',
        dataIndex: 'developers',
    },{
        title: '有效期',
        dataIndex: 'validityDate',
    },{
        title: '批复日期',
        dataIndex: 'approvalDate',
    },{
        title: '批复部门',
        dataIndex: 'approvalDepartment',
    }
];

export default class TabPage extends Component{
    render(){
        const props = this.props;
        return(
            <SearchTable
                searchOption={undefined}
                tableOption={{
                    columns,
                    url:`/project/approval/list/${props.projectId}`,
                    cardProps:{
                        bordered:false,
                        title:'',
                    }
                }}
            >
            </SearchTable>
        )
    }
}