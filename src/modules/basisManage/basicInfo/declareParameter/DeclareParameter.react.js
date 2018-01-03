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
    },
    {
        label:'税(费)种',
        fieldName:'taxType',
        type:'select',
        options:[
            {
                text:'增值税',
                value:'1'
            },
            {
                text:'企业所得税',
                value:'2'
            }
        ]
    },
    {
        label:'所属期起止',
        type:'rangePicker',
        fieldName:'subordinatePeriod',
        fieldDecoratorOptions:{}
    },
]
const columns = [
    {
        title: '编码',
        dataIndex: 'mainCode',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '税(费)种',
        dataIndex: 'taxType',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '企业所得税'
            }
            if(text===2){
                return '增值税'
            }
            return ''
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    },{
        title: '纳税申报',
        dataIndex: 'taxDeclarationTxt'
    },{
        title: '纳税形式',
        dataIndex: 'taxModality',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '独立纳税'
            }
            return ''
        }
    }
];

export default class DeclareParameter extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/sys/declarationParam/list'
                }}
            >
            </SearchTable>
        )
    }
}