/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
const columns = [
    {
        title: '合同编号',
        dataIndex: 'contractNum',
    }, {
        title: '宗地编号',
        dataIndex: 'parcelNum',
    },{
        title: '出让人',
        dataIndex: 'transferor',
    },{
        title: '取得方式',
        dataIndex: 'acquireWay',
    },{
        title: '项目类型',
        dataIndex: 'projectType',
    },{
        title: '宗地位置',
        dataIndex: 'position',
    },{
        title: '土地年限',
        dataIndex: 'landAgeLimit',
    },{
        title: '土地价款',
        dataIndex: 'landPrice',
    },{
        title: '建筑面积',
        dataIndex: 'coveredArea',
    },{
        title: '土地面积',
        dataIndex: 'landArea',
    },{
        title: '容积率',
        dataIndex: 'plotRatio',
    },{
        title: '合同签订日期',
        dataIndex: 'signingDate',
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
                    url:`/contract/land/list/${props.projectId}`,
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