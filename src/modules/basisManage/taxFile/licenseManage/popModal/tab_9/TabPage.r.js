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
        title: '竣工备案编号 ',
        dataIndex: 'licenseNumber',
    }, {
        title: '工程名称',
        dataIndex: 'projectName',
    },{
        title: '工程编号',
        dataIndex: 'projectNum',
    },{
        title: '建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '工程地点',
        dataIndex: 'position'
    },{
        title: '工程类别',
        dataIndex: 'projectType',
    },{
        title: '结构形式',
        dataIndex: 'structuralStyle',
    },{
        title: '建设单位',
        dataIndex: 'developmentOrg',
    },{
        title: '勘察单位',
        dataIndex: 'surveyOrg',
    },{
        title: '设计单位',
        dataIndex: 'designOrg',
    },{
        title: '施工单位',
        dataIndex: 'builderOrg',
    },{
        title: '监理单位',
        dataIndex: 'constructionOrg',
    },{
        title: '监督机构',
        dataIndex: 'authorityOrg',
    },{
        title: '开工日期',
        dataIndex: 'startDate',
    },{
        title: '发证日期',
        dataIndex: 'issuingDate',
    },{
        title: '备注',
        dataIndex: 'remark',
    },{
        title: '项目分期',
        dataIndex: 'stagesId'
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
                    url:`/project/finish/acceptance/list/${projectId}`,
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