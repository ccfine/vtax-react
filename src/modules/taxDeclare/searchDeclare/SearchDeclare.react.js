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
import PopModal from './popModal';

const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
//申报状态
const approvalStatus = [
    {value: '-2', text: '未发起审批'},
    {value: '-1', text: '审批失败'},
    {value: '0', text: '审批中'},
    {value: '1', text: '审批成功'},
]
//扣款状态
const deductionStatus= [
    {value: '-1', text: '扣款失败'},
    {value: '0', text: '未扣款'},
    {value: '1', text: '扣款中'},
    {value: '2', text: '扣款成功'},
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
        fieldName:'partTerm',
        formItemStyle,
        span:8,
    },
    {
        label:'纳税申报系统进度',
        type:'select',
        fieldName:'status',
        formItemStyle,
        span:8,
        options:[  //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            {
                text:'申报完成',
                value:'4'
            },{
                text:'申报归档',
                value:'5'
            }
        ],
    },
    {
        label:'申报状态',
        type:'select',
        fieldName:'approvalStatus',
        formItemStyle,
        span:8,
        options:approvalStatus
    },
    {
        label:'扣款状态',
        type:'select',
        fieldName:'deductionStatus',
        formItemStyle,
        span:8,
        options:deductionStatus
    },
]
const getColumns =(context)=>[
    {
        title: "操作",
        className:'text-center',
        render:(text,record)=>{ //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            let t = undefined;
            let q = undefined;
            let deductionStatus = parseInt(record.deductionStatus,0);
            if((deductionStatus === 2 && record.keyDeclare === '1')){
                t = composeBotton([{
                    type:'action',
                    icon:'folder',
                    title:'申报归档',
                    userPermissions:['1085001'],
                    onSuccess:()=>{ context.handelArchiving(record,'/tax/decConduct/query/record','申报归档') }
                }])
            }
            if(record.keyDeclare === '1'){
                q = composeBotton([{
                    type:'action',
                    icon:'file-search',
                    title:'查询最新审批进度',
                    userPermissions:['1935004'],
                    onSuccess: () => {
                        context.setState({searchData: record},() => {
                            context.toggleModal(true)
                        })
                    }
                }])
            }
            return <span>
                        {
                            composeBotton([{
                                type:'action',
                                icon:'search',
                                title:'查看申报',
                                userPermissions:['1931002'],
                                onSuccess:()=>{
                                    context.props.history.push(`${context.props.match.url}/lookDeclare/${record.id}`)
                                    /*context.setState({
                                        record: record
                                    },() => {
                                        context.toggleApplyVisible(true);
                                    });*/
                                }
                            }])
                        }
                        {t}
                        {q}
                    </span>;
        },
        fixed: "left",
        width: "100px",
        dataIndex: "action"
    },{
        title: '纳税申报系统进度',
        dataIndex: 'status',
        className:'text-center',
        render:text=>{
            let t = '';
            switch (parseInt(text,0)){
                case 4:
                    t=<span style={{ color: '#1795f6' }}>申报完成</span>;
                    break;
                case 5:
                    t=<span style={{ color: '#7a7e91' }}>申报归档</span>;
                    break;
                default:
                //no default
            }
            return t;
        }
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
    },{
        title: '申报状态',
        dataIndex: 'approvalStatusInfo',
        className:'text-center',
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
        title: '扣款金额',
        dataIndex: 'taxAmount',
        className: "table-money",
    }
];

class SearchDeclare extends Component{
    state={
        updateKey:Date.now(),
        applyDeclarationModalKey:Date.now(),
        applyVisible:false,
        record:undefined,
        visible:false,
        searchData: {}
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
    toggleModal = visible => {
        this.setState({
            visible
        })
    }
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
        const {updateKey,record,applyVisible,applyDeclarationModalKey,visible,searchData} = this.state
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
                <PopModal
                    visible={visible}
                    record={searchData}
                    toggleModalVisible={this.toggleModal}
                />
            </SearchTable>
        )
    }
}

export default withRouter(SearchDeclare)