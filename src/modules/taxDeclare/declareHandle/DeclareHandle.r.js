/**
 * Created by liuliyuan on 2018/5/14.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {message,Modal} from 'antd'
import {SearchTable} from 'compoments';
import ApplyDeclarationPopModal from '../createADeclare/applyDeclarationPopModal'
import {request,composeBotton} from 'utils'
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
                text:'申报完成',
                value:'4'
            }
        ],
    },{
        label:'所属期',
        type:'monthPicker',
        fieldName:'partTerm',
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
        title: "操作",
        className:'text-center',
        render:(text,record)=>{ //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            let t = undefined;
            let status = parseInt(record.status,0);
            switch (status){
                case 1: //申报办理
                    t = composeBotton([{
                                type:'action',
                                icon:'form',
                                title:'申报办理',
                                userPermissions:[],
                                onSuccess:()=>{
                                    context.setState({
                                        record: {...record,decAction:'edit'},
                                    },() => {
                                        context.toggleApplyVisible(true);
                                    });
                                }
                            },{
                                type:'action',
                                icon:'exception',
                                title:'流程终止',
                                userPermissions:[],
                                onSuccess:()=>{ context.handelProcessStop(record) }
                            }])
                    break
                case 2: //申报审核
                    break
                case 3: //申报审批
                    break
                case 4: //申报完成
                    t = composeBotton([{
                            type: 'action',
                            icon: 'folder',
                            title: '申报归档',
                            userPermissions: [],
                            onSuccess: () => {
                                context.handelArchiving(record)
                            }
                        },{
                            type:'action',
                            icon:'rollback',
                            title:'申报撤回',
                            userPermissions:[],
                            onSuccess:()=>{
                                context.setState({
                                    record: {...record,decAction:'edit'},
                                },() => {
                                    context.toggleApplyVisible(true);
                                });
                            }
                        }])
                    break
                case 5: //归档
                    t = composeBotton([{
                            type:'action',
                            icon:'folder',
                            title:'申报归档',
                            userPermissions:[],
                            onSuccess:()=>{ context.handelArchiving(record) }
                        }])
                    break
                case -1: //流程终止
                    break
                default:
                    /*break*/
            }
            return <span>
                        {
                            composeBotton([{
                                type:'action',
                                icon:'search',
                                title:'查看申报',
                                onSuccess:()=>{
                                    context.setState({
                                        record: {...record,decAction:'look'}
                                    },() => {
                                        context.toggleApplyVisible(true);
                                    });
                                }
                            }])
                        }
                        {t}
                    </span>;
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },{
        title: '申报状态',
        dataIndex: 'status',
        className:'text-center',
        render:text=>{
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{ color: '#44b973' }}>申报办理</span>;
                    break;
                case 2:
                    t=<span style={{ color: '#2783d8' }}>申报审核</span>;
                    break;
                case 3:
                    t=<span style={{ color: '#373ac6' }}>申报审批</span>;
                    break;
                case 4:
                    t=<span style={{ color: '#1795f6' }}>申报完成</span>;
                    break;
                case 5:
                    t=<span style={{ color: '#7a7e91' }}>归档</span>;
                    break;
                case -1:
                    t=<span style={{ color: '#ed2550' }}>流程终止</span>;
                    break;
                default:
                //no default
            }
            return t;
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
        dataIndex: 'partTerm',
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

class DeclareHandle extends Component{
    state={
        updateKey:Date.now(),
        record:undefined,
        applyVisible:false,
        applyDeclarationModalKey:Date.now()+2,
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
    handelArchiving=(record)=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否确定要归档？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`/tax/decConduct/record/${record.id}`,{
                    mainId: record.mainId,
                    authMonth:record.month
                })
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success('流程归档成功!');
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
    handelProcessStop=(record)=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否确定要流程终止？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put('/tax/declaration/stop',{
                    mainId: record.mainId,
                    authMonth:record.month
                })
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success('流程终止成功!');
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
        const {updateKey,applyDeclarationModalKey,applyVisible,record} = this.state;
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
                    pageSize:10,
                    columns:getColumns(this),
                    cardProps:{
                        title:'申报办理'
                    },
                    url:'/tax/decConduct/decList',
                }}
            >
                {
                    record && <ApplyDeclarationPopModal
                        key={applyDeclarationModalKey}
                        visible={applyVisible}
                        title={`申报处理【${record.mainName}】 申报期间 【${record.subordinatePeriodStart} 至 ${ record.subordinatePeriodEnd}】`}
                        record={record}
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        toggleApplyVisible={this.toggleApplyVisible}
                        style={{marginRight:5}}
                    />
                }
            </SearchTable>
        )
    }
}
export default connect(state=>({
    options:state.user.getIn(['personal','options']),
}))(DeclareHandle)