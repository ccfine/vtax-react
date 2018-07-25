/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {message,Form} from 'antd'
import {request,requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
import { NumericInputCell } from 'compoments/EditableCell'

import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'mainId',
            span:8,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && declare.mainId) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },

        }, {
            label:'凭证月份',
            type:'monthPicker',
            formItemStyle,
            span:8,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择凭证月份'
                    }
                ]
            }
        }, {
            label:'可抵扣土地价款',
            fieldName:'deductionFlag',
            span:8,
            formItemStyle,
            type:'select',
            options:[
                {
                    text:'是',
                    value:'1'
                },{
                    text:'否',
                    value:'0'
                }
            ]
        },
    ]
}
const markFieldsData = [
    {
        label:'作为土地价款抵扣的凭证',
        fieldName:'deductionFlag',
        type:'select',
        notShowAll:true,
        formItemStyle:{
            labelCol:{
                span:10
            },
            wrapperCol:{
                span:14
            }
        },
        span:22,
        options:[  //1-标记;0-不标记；不传则所有状态
            {
                text:'是',
                value:'1'
            },{
                text:'否',
                value:'0'
            }
        ],
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择标记类型'
                }
            ]
        }
    }
]
const getColumns = (context,disabled,getFieldDecorator) =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'12%',
    },
    {
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
    },
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:75,
    },
    /*{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'6%',
    },*/
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherInfo:{
                        voucherId:record.voucherId,
                    }
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        ),
        width:'6%',
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
    },
    {
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
        width:'12%',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        className: "table-money",
        render:(text,record)=>{
            if(disabled){
                return record.debitAmount ? fMoney(parseFloat(text)) : text
            }else{
                return ((context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) && parseInt(record.deductionFlag, 0) === 1) ?
                    <NumericInputCell
                        fieldName={`debitAmount_${record.id}`}
                        initialValue={text}
                        getFieldDecorator={getFieldDecorator}
                        editAble={disabled}
                        componentProps={{
                            onBlur:(e)=>context.handleConfirmBlur(e,record)
                        }}

                    /> : text
            }
        },
        width:'6%',
    },
    {
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
    },
    {
        title: '作为土地价款抵扣的凭证',
        dataIndex: 'deductionFlag',
        width:80,
        render: text => {
            //1-标记;0-无标记；不传则所有状态
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t='是';
                    break;
                case 0:
                    t=null;
                    break;
                default:
                //no default
            }
            return t
        }
    }
];
class LandPriceManage extends Component{
    state={
        searchTableLoading:false,
        tableKey:Date.now(),
        visible:false,
        voucherInfo:{},
        filters:{},
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/land/price/manage/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    toggleViewModalVisible=visible=>{
        this.setState({
            visible
        })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now(),
            selectedRowKeys:[]
        })
    }

    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }

    handleConfirmBlur = (e,record) => {
        const value = e.target.value;
        if(parseInt(value, 0) !== parseInt(record.debitAmount, 0)){
            request.put('/land/price/manage/update',{
                debitAmount:value,
                id:record.id
            })
                .then(({data})=>{
                    this.toggleSearchTableLoading(true)
                    if(data.code===200){
                        message.success('保存成功!');
                        this.toggleSearchTableLoading(false);
                        this.refreshTable()
                    }else{
                        message.error(`保存失败:${data.msg}`)
                    }
                })
                .catch(err => {
                    message.error(err.message)
                    this.toggleSearchTableLoading(true)
                })
        }
    }

    render(){
        const {searchTableLoading,visible,tableKey,filters,selectedRowKeys,voucherInfo,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        const {getFieldDecorator} = this.props.form;
        return(
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        className:''
                    },
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this,!disabled,getFieldDecorator),
                    url:'/land/price/manage/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                            selectedRowKeys:[],
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onRowSelect:(disabled && declare.decAction==='edit' && parseInt(statusParam.status,10)===1) ? (selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    } : undefined,
                    cardProps: {
                        title: "土地价款管理",
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'land/price/manage/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1541007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/land/price/manage/deductionFlag",
                                        fields: markFieldsData,
                                        onSuccess: this.refreshTable,
                                        userPermissions:['1545000'],
                                    }
                                },{
                                    type:'reset',
                                    url:'/land/price/manage/reset',
                                    params:filters,
                                    userPermissions:['1541009'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/land/price/manage/submit',
                                    params:filters,
                                    userPermissions:['1541010'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/land/price/manage/revoke',
                                    params:filters,
                                    userPermissions:['1541011'],
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '借方金额', dataIndex: 'debitAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>,
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                         x:1600,
                         y:window.screen.availHeight-400,
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    {...voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default Form.create()(connect(state=>({
    declare:state.user.get('declare')
}))(LandPriceManage))