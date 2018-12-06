/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {message,Modal} from 'antd'
import {SearchTable} from 'compoments';
import ApplyDeclarationPopModal from '../createADeclare/applyDeclarationPopModal'
import {request,composeBotton} from 'utils'
import {withRouter} from 'react-router-dom';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
//纳税申报系统进度
const status = [ 
    {value:'1',text:'申报办理'},
    {value:'2',text:'申报审核'},
    {value:'3',text:'申报审批'},
    {value:'4',text:'申报完成'},
    {value:'5',text:'归档'},
    {value:'-1',text:'流程终止'}
]
//申报状态
const approvalStatus = [
    {value: '-1', text: '审批失败'},
    {value: '0', text: '审批中'},
    {value: '1', text: '审批成功'},
    {value: '2', text: '已申报'},
]
//扣款状态
const deductionStatus= [
    {value: '0', text: '未扣款'},
    {value: '3', text: '扣款中'},
    {value: '4', text: '扣款已受理'},
    {value: '5', text: '扣款已受理'},
    {value: '6', text: '税局扣款处理中'},
    {value: '7', text: '扣款成功'},
    {value: '8', text: '税局扣款处理中'},
    {value: '9', text: '无需扣款'},
    {value: '10', text: '税局自动扣款'},
    {value: '11', text: '人工扣款成功'},
]
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        formItemStyle,
        span:8,
    },
    {
        label:'纳税申报期',
        type:'monthPicker',
        fieldName:'month',
        formItemStyle,
        span:8,
    },
    {
        label:'纳税申报系统进度',
        type:'select',
        fieldName:'approvalStatus',
        formItemStyle,
        span:8,
        options:approvalStatus
    },
]
const getColumns =(context)=>[
    {
        title: "操作",
        className:'text-center',
        render:(text,record)=>{ //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            let t = undefined;
            let status = parseInt(record.status,0);
            let deductionStatus = parseInt(record.deductionStatus,0);
             //申报完成 && 税局审批结果 === 空 && 税局审批结果 === 审核失败
            if((status === 4 && record.approvalStatus === '') || (status === 4 && parseInt(record.approvalStatus,0)===-1)){
                t = composeBotton([{
                    type: 'action',
                    icon: 'check',
                    title: '提交审批',
                    userPermissions: ['1085001'],
                    onSuccess: () => {
                        context.handelArchiving(record,'/tax/decConduct/query/submit','提交审批')
                    }
                }])
            }
             //扣款状态 === 扣款成功 || 扣款状态   === 人工扣款成功
             if((status === 4 && deductionStatus === 7) || (status === 4 && deductionStatus===11)){
                t = composeBotton([{
                    type:'action',
                    icon:'folder',
                    title:'申报归档',
                    userPermissions:['1085001'],
                    onSuccess:()=>{ context.handelArchiving(record,'/tax/decConduct/query/record','申报归档') }
                }])
            }
            return <span>
                        {
                            composeBotton([{
                                type:'action',
                                icon:'search',
                                title:'查看申报',
                                onSuccess:()=>{
                                    context.props.history.push(`${context.props.match.url}/lookDeclare/${record.id}`)
                                    /*context.setState({
                                        record: record
                                    },() => {
                                        context.toggleApplyVisible(true);
                                    });*/
                                }
                            },{
                                type:'action',
                                icon:'file-search',
                                title:'查询最新审批状态',
                                userPermissions:['1085001'],
                                onSuccess:()=>{ context.handelArchiving(record,'/tax/decConduct/query/getResult','查询最新审批状态') }
                            
                            }])
                        }
                        {t}
                    </span>;
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },{
        title: '纳税申报系统申报进度',
        dataIndex: 'status',
        className:'text-center',
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    }, {
        title: '税局审批结果',
        dataIndex: 'approvalStatusInfo',
    },{
        title: '税局审批结果说明',
        dataIndex: 'errorMessage',
    },{
        title: '扣款状态',
        dataIndex: 'deductionStatus',
        render:text=>{
            deductionStatus.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '纳税申报期',
        dataIndex: 'month',
    },{
        title: '申报人',
        dataIndex: 'declareBy',
    },{
        title: '申报日期',
        dataIndex: 'declarationDate',
    }
];

class SearchDeclare extends Component{
    state={
        updateKey:Date.now(),
        applyDeclarationModalKey:Date.now(),
        applyVisible:false,
        record:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    toggleApplyVisible = applyVisible => {
        this.setState({
            applyVisible
        });
    };
    handelArchiving=(record,url,m)=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: `是否确定要${m}？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`${url}/${record.id}`)
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success(`${m}成功!`);
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    render(){
        const {updateKey,record,applyVisible,applyDeclarationModalKey} = this.state
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
                    key:updateKey,
                    pageSize:100,
                    columns:getColumns(this),
                    cardProps:{
                        title:'查询申报'
                    },
                    url:'/tax/decConduct/query/list',
                    scroll:{
                        x:1300
                    }
                }}
            >
                {
                    record && <ApplyDeclarationPopModal
                        key={applyDeclarationModalKey}
                        visible={applyVisible}
                        title={`申报处理【${record.mainName}】 申报期间 【${record.partTerm}】`}
                        record={{...record,decAction:'look'}}
                        toggleApplyVisible={this.toggleApplyVisible}
                        style={{marginRight:5}}
                        url='tax/decConduct/query/find'
                    />
                }
            </SearchTable>
        )
    }
}

export default withRouter(SearchDeclare)