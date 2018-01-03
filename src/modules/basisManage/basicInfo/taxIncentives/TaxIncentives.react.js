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
    }
]
const columns = [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '涉及税(费)种',
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
        title: '税收优惠分类',
        dataIndex: 'type',
        render:text=>{
            //1:免抵退税;2:免税;3:减税;4:即征即退;5:财政返还;6:其他税收优惠; ,
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t='免抵退税';
                    break;
                case 2:
                    t='免税';
                    break;
                case 3:
                    t='减税';
                    break;
                case 4:
                    t='即征即退';
                    break;
                case 5:
                    t='财政返还';
                    break;
                case 6:
                    t='其他税收优惠';
                    break;
                default:
                //no default
            }
            return t
        }
    },{
        title: '文号',
        dataIndex: 'documentNum',
    },{
        title: '有效期起',
        dataIndex: 'validityDateStart',
    },{
        title: '有效期止',
        dataIndex: 'validityDateEnd',
    },{
        title: '是否有附件',
        dataIndex: 'isAttachment',
        render:text=>parseInt(text,0)===1?'有':'无'
    }
];

export default class TaxIncentives extends Component{
    render(){
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns,
                    url:'/tax/preferences/list'
                }}
            >
            </SearchTable>
        )
    }
}