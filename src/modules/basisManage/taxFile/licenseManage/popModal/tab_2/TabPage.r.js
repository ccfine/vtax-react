/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
const columns = [
    {
        title: '项目分期代码',
        dataIndex: 'itemNum',
    }, {
        title: '项目分期名称',
        dataIndex: 'itemName',
    },{
        title: '土地出让合同编号',
        dataIndex: 'leaseContractId',
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
                    url:`/project/stage/list/${props.projectId}`,
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