/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {message} from 'antd'
import { withRouter } from 'react-router'
import {request,fMoney,getUrlParam,listMainResultStatus} from 'utils'
import {SearchTable} from 'compoments'
import ButtonMarkModal from 'compoments/buttonMarkModal'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductibleInputTaxDetails/viewDocumentDetailsPopModal'

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
const searchFields=(disabled)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'mainId',
            span:6,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
            span:6,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
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
            span:6,
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
        label:'标记类型',
        fieldName:'deductionFlag',
        type:'select',
        notShowAll:true,
        span:'22',
        options:[  //1-标记;0-不标记；不传则所有状态
            {
                text:'标记',
                value:'1'
            },{
                text:'不标记',
                value:'0'
            }
        ],
    }
]
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',

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
        title: '凭证日期',
        dataIndex: 'voucherDate',
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherNum:text,
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
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
        title: '可抵扣土地价款',
        dataIndex: 'deductionFlag',
        width:'75px',
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

        tableKey:Date.now(),
        visible:false,
        voucherNum:undefined,
        searchFieldsValues:{

        },
        dataSource:[],
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    fetchResultStatus = ()=>{
        request.get('/land/price/manage/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam: data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    toggleViewModalVisible=visible=>{
        this.setState({
            visible
        })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {visible,tableKey,searchFieldsValues,selectedRowKeys,voucherNum,dataSource,statusParam} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        const disabled1 = statusParam && parseInt(statusParam.status, 0) === 2;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns(this),
                    url:'/land/price/manage/list',
                    onSuccess:(params)=>{
                        this.setState({
                            searchFieldsValues:params,
                            selectedRowKeys:[],
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    cardProps: {
                        title: "其他可抵扣进项税明细",
                        extra:<div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }

                            <ButtonMarkModal
                                style={{marginRight:5}}
                                formOptions={{
                                    disabled: !selectedRowKeys.length>0 || disabled1,
                                    filters: searchFieldsValues,
                                    selectedRowKeys: selectedRowKeys,
                                    url:"/land/price/manage/deductionFlag",
                                    fields: markFieldsData,
                                    onSuccess: this.refreshTable,
                                }}
                            />
                            <SubmitOrRecall disabled={disabled1} type={1} url="/land/price/manage/submit" onSuccess={this.refreshTable} />
                            <SubmitOrRecall disabled={!disabled1} type={2} url="/land/price/manage/revoke" onSuccess={this.refreshTable} />

                        </div>,
                    },
                    /*scroll:{
                     x:'180%'
                     },*/
                    onDataChange:(dataSource)=>{
                        this.setState({
                            dataSource
                        })
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    voucherNum={voucherNum}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(LandPriceManage)