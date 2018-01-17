/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component} from 'react'
import {Button,Popconfirm,message} from 'antd'
import {SearchTable} from '../../../../compoments'
import PopModal from './popModal'
import {request} from '../../../../utils'
const buttonStyle = {
    margin:'0 5px'
}

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        span:6,
        fieldName:'mainId',
        fieldDecoratorOptions:{
            rules:[
            {
                required:true,
                message:'必录'
            }
            ]
        }
    },
    {
        label:'调整日期',
        fieldName:'adjustDate',
        type:'monthPicker',
        span:6,
        componentProps:{
        },
        fieldDecoratorOptions:{
            rules:[
            {
                required:true,
                message:'必录'
            }
            ]
        }
    }
]
const getColumns =(context)=>[{
    title:'操作',
    render(text, record, index){
        return(
            <span>
            <a style={{marginRight:"5px"}} onClick={()=>{
                context.setState({visible:true,action:'modify',opid:record.id});
            }}>修改</a>
            <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                <a style={{marginRight:"5px"}}>删除</a>
            </Popconfirm>
            </span>
        );
    },
    fixed:'left',
    width:'100px',
    dataIndex:'action'
},{
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '调整日期',
        dataIndex: 'adjustDate',
    },{
        title: '项目',
        dataIndex: 'project',
        render(text, record, index){
            switch(text){
                case '1':
                    return '涉税调整';
                case '2':
                    return '纳税检查调整';
                default:
                    return text;
            }
        }
    },{
        title: '应税项目',
        dataIndex: 'taxableProjectName',
    },{
        title: '业务类型',
        dataIndex: 'taxRateName',
    },{
        title: '税率',
        dataIndex: 'taxRate',
    },{
        title: '销售额（不含税）',
        dataIndex: 'amountWithoutTax',
    },{
        title: '销项（应纳）税额',
        dataIndex: 'taxAmountWithTax',
    },{
        title: '服务、不动产和无形资产扣除项目本期实际扣除金额（含税）',
        dataIndex: 'deductionAmount',
    },{
        title: '调整原因',
        dataIndex: 'adjustReason',
        render(text, record, index){
            switch(text){
                case '1':
                    return '尾款调整';
                case '2':
                    return '非地产业务（租金，水电费等）相关调整';
                case '3':
                    return '未开票收入差异调整';
                default:
                    return text;
            }
        }
    },{
        title: '具体调整说明',
        dataIndex: 'adjustDescription',
    }
];

export default class OtherTaxAdjustment extends Component{
    state={
        visible:false, // 控制Modal是否显示
        opid:"", // 当前操作的记录
        action:'add',
        updateKey:Date.now()
    }
    hideModal(){
        this.setState({visible:false});
    }
    update = ()=>{
        this.setState({updateKey:Date.now()});
    }
    deleteRecord=(record)=>{
        request.delete(`/account/output/othertax/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.setState({updateKey:Date.now()});
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(err => {
            message.error(err.message);
        })
    }
    render(){
        return(
            <div>
                <SearchTable
                    searchOption={{
                        fields:searchFields
                    }}
                    
                    tableOption={{
                        scroll:{x:'100%'},
                        pageSize:10,
                        columns:getColumns(this),
                        key:this.state.updateKey,
                        url:'/account/output/othertax/list',
                        cardProps:{
                            extra:(<div>
                                <Button size='small' style={buttonStyle} onClick={()=>{this.setState({visible:true,action:'add',opid:undefined})}}>添加</Button>
                            </div>)
                        }
                    }}
                >
                </SearchTable>
                <PopModal 
                visible={this.state.visible} 
                action={this.state.action}
                hideModal={()=>{this.hideModal()}} 
                id={this.state.opid}
                update = {this.update}/>
            </div>
        )
    }
}