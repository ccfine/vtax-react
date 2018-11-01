/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
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
const searchFields=(disabled,declare)=> (getFieldValue) =>{
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'main',
            span:8,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
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
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'150px',
    },
    /*{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'150px',
    },*/
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'150px',
    },
    /*{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'150px',
    },*/
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: 'SAP凭证号',
        dataIndex: 'voucherNumSap',
        width:'100px',
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
        sorter: true,
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        //width:'300px',
    },
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'100px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        className: "table-money",
        render:(text,record)=>{
            if(!disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 10) === 1 && parseInt(record.deductionFlag, 10) === 1){
                   return <NumericInputCell
                        fieldName={`debitAmount_${record.id}`}
                        initialValue={text==='0' ? '0.00' : text}
                        getFieldDecorator={getFieldDecorator}
                        editAble={disabled}
                        componentProps={{
                            onBlur:(e)=>context.handleConfirmBlur(e,record)
                        }}
                    /> 
            }else{
                return fMoney(text)
            }
        },
        width:'100px',
    },
    /*{
        title: '借方辅助核算名称',
        dataIndex: 'debitProjectName',
        width:'150px',
    },*/
    {
        title: '借方辅助核算代码',
        dataIndex: 'debitProjectNum',
        width:'150px',
    },
    {
        title: '付款成本项目',
        dataIndex: 'paymentItem',
        width:'150px',
    },
    {
        title: '作为土地价款抵扣的凭证',
        dataIndex: 'deductionFlag',
        width:'150px',
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
            <div className='oneLine'>
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        className:'',
                        style:{borderTop:0}
                    },
                }}
                backCondition={(filters) => {
                    this.setState({
                        filters,
                        selectedRowKeys:[],
                    },() => {
                        this.fetchResultStatus();
                    });
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this,!disabled,getFieldDecorator),
                    url:'/land/price/manage/list',
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
                                }])
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
                         x:2100,
                         y:window.screen.availHeight-400-(disabled?50:0),
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    id={voucherInfo.voucherId}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
            </div>
        )
    }
}
export default Form.create()(LandPriceManage)