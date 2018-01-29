/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {SearchTable} from '../../../compoments';
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        span:6,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
        span:6,
        options:[  //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            {
                text:'申报办理',
                value:'1'
            },{
                text:'申报审核',
                value:'2'
            },{
                text:'申报审批',
                value:'3'
            },{
                text:'申报完成',
                value:'4'
            },{
                text:'归档',
                value:'5'
            },{
                text:'流程终止',
                value:'-1'
            }
        ],
    },{
        label:'所属期起止',
        type:'rangePicker',
        fieldName:'subordinatePeriod',
        span:6,
    },{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
        span:6,
        options:[
            {
                text:'增值税',
                value:'1'
            },{
                text:'企业所得税',
                value:'2'
            }
        ],
    }
]
const getColumns =(context)=>[
    {
        title: '申报状态',
        dataIndex: 'status',
    }, {
        title: '上一步完成时间',
        dataIndex: 'lastModifiedDate',
    },{
        title: '大区',
        dataIndex: 'region',
    },{
        title: '组织架构',
        dataIndex: 'orgName',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '所属期',
        dataIndex: 'remark',
    },{
        title: '税（费）种',
        dataIndex: 'taxType',
        render:text=>{
            //1增值税、2企业所得税
            text = parseInt(text,0);
            if(text===1){
                return '增值税'
            }
            if(text ===2){
                return '企业所得税'
            }
            return text;
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    },{
        title: '所属流程',
        dataIndex: 'isProcess',
    },{
        title: '申报人',
        dataIndex: 'lastModifiedBy',
    },{
        title: '申报日期',
        dataIndex: 'month',
    }
];

export default class SearchDeclare extends Component{
    state={
        updateKey:Date.now(),
    }
    render(){
        return(
            <div>
                <SearchTable
                    searchOption={{
                        fields:searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    tableOption={{
                        key:this.state.updateKey,
                        pageSize:10,
                        columns:getColumns(this),
                        cardProps:{
                            title:'列表信息'
                        },
                        url:'/tax/declaration/list',
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}