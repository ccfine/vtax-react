/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,listMainResultStatus,requestResultStatus,composeBotton} from 'utils'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

const searchFields = (disabled,declare) => {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && declare.mainId) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
        }
    ]
}
const columns=[
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
        width:'12%',
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
        width:'4%',
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
        width:'8%',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'4%',
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
        width:'12%',
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
        width:'4%',
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
        width:'12%',
    }
];
class FinancialDocumentsCollection extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/inter/financial/voucher/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {updateKey,filters,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare)
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/inter/financial/voucher/manageList',
                    scroll:{ x: 2400 ,y:window.screen.availHeight-420},
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: "财务凭证采集",
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    (disabled && declare.decAction==='edit') &&  composeBotton([{
                                        type:'submit',
                                        url:'/inter/financial/voucher/submit',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1231010'],
                                    },{
                                        type:'revoke',
                                        url:'/inter/financial/voucher/revoke',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1231011'],
                                    }],statusParam)
                                }
                                <TableTotal type={3} totalSource={totalSource} data={
                                    [
                                        {
                                            title:'合计',
                                            total:[
                                                {title: '贷方金额', dataIndex: 'creditAmount'},
                                            ],
                                        }
                                    ]
                                } />
                            </div>
                        )
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            />

        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(FinancialDocumentsCollection)