/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
const columns = [
    {
        title: '建设用地规划许可证',
        dataIndex: 'licenseKey',
    }, {
        title: '用地位置',
        dataIndex: 'position',
    },{
        title: '用地性质',
        dataIndex: 'property',
    },{
        title: '用地面积(m²)',
        dataIndex: 'landArea',
    },{
        title: '建设规模(m²)',
        dataIndex: 'scale',
    },{
        title: '取证日期',
        dataIndex: 'evidenceDate',
    },{
        title: '合同编号',
        dataIndex: 'leaseContractNum',
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
                    url:`/card/build/list/${props.projectId}`,
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