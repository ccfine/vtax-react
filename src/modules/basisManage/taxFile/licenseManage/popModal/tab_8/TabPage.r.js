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
        title: '预售许可证编号 ',
        dataIndex: 'licenseNumber',
    }, {
        title: '发证日期',
        dataIndex: 'issueDate',
    },{
        title: '坐落地',
        dataIndex: 'position',
    },{
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '房屋产权证编号',
        dataIndex: 'certificate',
    },{
        title: '土地、规划用途',
        dataIndex: 'landUse',
    },{
        title: '预售建筑面积(m²)',
        dataIndex: 'buildingArea',
    },{
        title: '地上建筑面积(m²)',
        dataIndex: 'upArea',
    },{
        title: '地下建筑面积(m²)',
        dataIndex: 'downArea',
    },{
        title: '幢号',
        dataIndex: 'buildingNum',
    },{
        title: '层数',
        dataIndex: 'pliesNum',
    },{
        title: '房屋类型',
        dataIndex: 'houseType',
    },{
        title: '备注',
        dataIndex: 'remark',
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
                    url:`/card/house/sales/list/${projectId}`,
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