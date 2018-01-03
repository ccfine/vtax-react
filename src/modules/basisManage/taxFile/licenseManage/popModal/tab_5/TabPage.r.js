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
        title: '土地证编号 ',
        dataIndex: 'licenseKey',
    }, {
        title: '用地单位',
        dataIndex: 'organization',
    },{
        title: '地块位置',
        dataIndex: 'position',
    },{
        title: '土地用途',
        dataIndex: 'landUse',
    },{
        title: '取得方式',
        dataIndex: 'acquireWay',
    },{
        title: '土地年限',
        dataIndex: 'ageLimit',
    },{
        title: '使用权面积(m²)',
        dataIndex: 'rightArea',
    },{
        title: '其中:分摊面积(m²)',
        dataIndex: 'shareArea',
    },{
        title: '其中:独有面积(m²)',
        dataIndex: 'ownArea',
    },{
        title: '取证日期',
        dataIndex: 'evidenceDate',
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
                    url:`/card/land/use/list/${projectId}`,
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