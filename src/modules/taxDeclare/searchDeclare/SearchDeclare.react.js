/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {Badge} from 'antd'
import {SearchTable} from 'compoments';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        formItemStyle,
        span:6,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
        formItemStyle,
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
        formItemStyle,
        span:6,
    },{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
        formItemStyle,
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
        className:'text-center',
        render:text=>{
            //1:免抵退税;2:免税;3:减税;4:即征即退;5:财政返还;6:其他税收优惠; ,
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<Badge count='申报办理' style={{ backgroundColor: '#44b973' }} />;
                    break;
                case 2:
                    t=<Badge count='申报审核' style={{ backgroundColor: '#2783d8' }} />;
                    break;
                case 3:
                    t=<Badge count='申报审批' style={{ backgroundColor: '#373ac6' }} />;
                    break;
                case 4:
                    t=<Badge count='申报完成' style={{ backgroundColor: '#1795f6' }} />;
                    break;
                case 5:
                    t=<Badge count='归档' style={{ backgroundColor: '#7a7e91' }} />;
                    break;
                case -1:
                    t=<Badge count='流程终止' style={{ backgroundColor: '#ed2550' }} />;
                    break;

                default:
                //no default
            }
            return t
        }
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
            //1:增值税;2:企业所得税;
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
        dataIndex: 'declareBy',
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
                    url:'/tax/decConduct/queryList',
                }}
            >
            </SearchTable>
        )
    }
}