/**
 * Created by liuliyuan on 2018/6/4.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {Modal,message} from 'antd'
import {fMoney,composeBotton,request} from 'utils'
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const fields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
const searchFields =[
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:8,
        formItemStyle,
    },{
        label:'查询期间',
        fieldName:'authMonth',
        type:'monthPicker',
        formItemStyle,
        span:8,
        componentProps:{
            format:'YYYY-MM',
        }
    }
]
const getColumns = context =>[
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            //userPermissions:['1891008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    },
    {
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">纳税主体名称</p>
            <p className="apply-form-list-p2">纳税主体编码</p>
        </div>,
        dataIndex: 'mainName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.mainNum}</p>
            </div>
        )
    },{
        title: '项目名称',
        dataIndex: 'projectName',
        width:'75px'
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">项目分期名称</p>
            <p className="apply-form-list-p2">项目分期代码</p>
        </div>,
        dataIndex: 'stagesName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.stagesNum}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">凭证日期</p>
            <p className="apply-form-list-p2">过账日期</p>
        </div>,
        dataIndex: 'voucherDate',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.billingDate}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">凭证号</p>
            <p className="apply-form-list-p2">凭证类型</p>
        </div>,
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.voucherType}</p>
            </div>
        )
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:'75px'
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">借方科目名称</p>
            <p className="apply-form-list-p2">借方科目代码</p>
        </div>,
        dataIndex: 'debitSubjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.debitSubjectCode}</p>
            </div>
        )
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        width:'75px',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">借方辅助核算名称</p>
            <p className="apply-form-list-p2">借方辅助核算代码</p>
        </div>,
        dataIndex: 'debitProjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.debitProjectNum}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">贷方科目名称</p>
            <p className="apply-form-list-p2">贷方科目代码</p>
        </div>,
        dataIndex: 'creditSubjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.creditSubjectCode}</p>
            </div>
        )
    },{
        title: '贷方金额',
        dataIndex: 'creditAmount',
        width:'75px',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">贷方辅助核算名称</p>
            <p className="apply-form-list-p2">贷方辅助核算代码</p>
        </div>,
        dataIndex: 'creditProjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.creditProjectNum}</p>
            </div>
        )
    }
];
export default class FinancialDocumentsBeginData extends Component{
    state={
        updateKey:Date.now(),
        filters:{}
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    deleteRecord(record){
        request.delete(`/inter/financial/voucher/report/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }
    render(){
        const {updateKey} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/inter/financial/voucher/report/list',
                    onSuccess: (params) => {
                        this.setState({
                            filters: params,
                        });
                    },
                    cardProps: {
                        title: "财务凭证",
                        extra: (
                            <div>
                                {
                                    composeBotton([{
                                        type: 'fileExport',
                                        url: 'inter/financial/voucher/report/download',
                                        onSuccess: this.refreshTable,
                                    },{
                                        type:'fileImport',
                                        url:'/inter/financial/voucher/report/upload',
                                        onSuccess:this.refreshTable,
                                        fields:fields,
                                        //userPermissions:['1891005'],
                                    }])
                                }
                            </div>
                        )
                    },
                }}
            />

        )
    }
}
