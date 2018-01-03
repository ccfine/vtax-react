/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
const getSearchFields = projectId => [
    {
        label:'项目分期',
        type:'asyncSelect',
        fieldName:'stagesId',
        componentProps:{
            url:`/project/stages/${projectId}`,
            fieldTextName:"itemName",
            fieldValueName:"id"
        }
    }
]
const columns = [
    {
        title: '施工许可证编号 ',
        dataIndex: 'licenseKey',
    }, {
        title: '建设单位',
        dataIndex: 'organization',
    },{
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '建设位置',
        dataIndex: 'position',
    },{
        title: '建设规模m(²)',
        dataIndex: 'scale',
    },{
        title: '其中:地上建筑面积(m²)',
        dataIndex: 'upArea',
    },{
        title: '其中:地下建筑面积(m²)',
        dataIndex: 'downArea',
    },{
        title: '设计单位',
        dataIndex: 'designOrg',
    },{
        title: '施工单位',
        dataIndex: 'buildOrg',
    },{
        title: '监理单位',
        dataIndex: 'supervisionOrg',
    },{
        title: '合同开工日期',
        dataIndex: 'startDate',
    },{
        title: '合同竣工日期',
        dataIndex: 'endDate',
    }
];

export default class TabPage extends Component{
    render(){
        const {projectId} = this.props;
        return(
            <SearchTable
                searchOption={{
                    fields:getSearchFields(projectId),
                    cardProps:{
                        title:'',
                        bordered:false,
                        extra:null
                    }
                }}
                tableOption={{
                    columns,
                    url:`/card/project/build/list/${projectId}`,
                    cardProps:{
                        title:'',
                        bordered:false,
                        style:{
                            marginTop:0
                        },
                        bodyStyle:{
                            padding:0
                        }
                    }
                }}
            >
            </SearchTable>
        )
    }
}