/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {message,Modal} from 'antd'
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
        label: '记账月份',
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
                    message: '请选择记账月份'
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
            fieldDecoratorOptions:{
                rules:[{
                    required:true,
                    message:'请选择纳税主体',
                }]
            },
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
            }
        },{
            label:'借方科目名称',
            fieldName:'debitSubjectName',
            span:8,
            formItemStyle,
        },{
            label:'借方科目代码',
            fieldName:'debitSubjectCode',
            span:8,
            formItemStyle,
        },{
            label:'贷方科目名称',
            fieldName:'creditSubjectName',
            span:8,
            formItemStyle,
        },{
            label:'贷方科目代码',
            fieldName:'creditSubjectCode',
            span:8,
            formItemStyle,
        },{
            label:'凭证号',
            fieldName:'voucherNum',
            span:8,
            formItemStyle,
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
            // userPermissions:['1891008'],
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
        ),
        width:'10%',
    },{
        title: '项目名称',
        dataIndex: 'projectName',
        width:'8%',
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
        ),
        width:'10%',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">凭证日期</p>
            <p className="apply-form-list-p2">记账日期</p>
        </div>,
        dataIndex: 'voucherDate',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.billingDate}</p>
            </div>
        ),
        width:75,
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
        ),
        width:'6%',
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
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
        ),
        width:'10%',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'5%',
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
        ),
        width:'8%',
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
        ),
        width:'10%',
    },{
        title: '贷方金额',
        dataIndex: 'creditAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'5%',
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
        ),
        width:'8%',
    }
];
export default class FinancialDocuments extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        totalSource: undefined
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
        const {updateKey,filters,totalSource} = this.state;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/inter/financial/voucher/report/list',
                    scroll:{ x: 2200,y:window.screen.availHeight-450 },
                    onSuccess: (params) => {
                        this.setState({
                            filters: params,
                        });
                    },
                    onTotalSource: totalSource => {
                        this.setState({
                            totalSource
                        });
                    },
                    cardProps: {
                        title: "财务凭证",
                        extra: (
                            <div>
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'inter/financial/voucher/report/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1891002'],
                                    },{
                                        type:'fileImport',
                                        url:'/inter/financial/voucher/report/upload',
                                        onSuccess:this.refreshTable,
                                        fields:fields,
                                        // userPermissions:['1891005'],
                                    }])
                                }
                                {
                                    composeBotton([{
                                        type: 'fileExport',
                                        url: 'inter/financial/voucher/report/download',
                                        // onSuccess: this.refreshTable,
                                    }])
                                }
                                <TableTotal totalSource={totalSource} type={3} data={[
                                    {
                                        title:'总计',
                                        total:[
                                            {title: '借方金额', dataIndex: 'debitAmount'},
                                            {title: '贷方金额', dataIndex: 'creditAmount'},
                                        ],
                                    }
                                ]}/>
                            </div>
                        )
                    },
                }}
            />

        )
    }
}