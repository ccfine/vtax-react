/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {message} from 'antd'
import { withRouter } from 'react-router'
import {request,fMoney,getUrlParam,listMainResultStatus,composeBotton} from 'utils'
import {SearchTable} from 'compoments'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'

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
            label:'标记类型',
            fieldName:'flag',
            span:6,
            formItemStyle,
            type:'select',
            options:[  //1-海关进口增值税专用缴款书;2-农产品收购发票或者销售发票;3-代扣代缴收缴款凭证;4-其他;0-无标记；不传则所有状态
                {
                    text:'海关进口增值税专用缴款书',
                    value:'1'
                },{
                    text:'农产品收购发票或者销售发票',
                    value:'2'
                },{
                    text:'代扣代缴收缴款凭证',
                    value:'3'
                },{
                    text:'其他',
                    value:'4'
                },{
                    text:'无标记',
                    value:'0'
                }
            ]
        },
    ]
}
const markFieldsData = [
    {
        label:'标记类型',
        fieldName:'flag',
        type:'select',
        notShowAll:true,
        span:'22',
        options:[  //1-海关进口增值税专用缴款书;2-农产品收购发票或者销售发票;3-代扣代缴收缴款凭证;4-其他;0-无标记；不传则所有状态
            {
                text:'海关进口增值税专用缴款书',
                value:'1'
            },{
                text:'农产品收购发票或者销售发票',
                value:'2'
            },{
                text:'代扣代缴收缴款凭证',
                value:'3'
            },{
                text:'其他',
                value:'4'
            },{
                text:'无标记',
                value:'0'
            }
        ],
    }
]
const columns = context =>[
    {
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">纳税主体名称</p>
            <p className="apply-form-list-p2">纳税主体代码</p>
        </div>,
        dataIndex: 'mainName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.mainNum}</p>
            </div>
        )

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
            <p className="apply-form-list-p2">记账日期</p>
        </div>,
        dataIndex: 'voucherDate',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.billingDate}</p>
            </div>
        )
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
        title: '凭证类型',
        dataIndex: 'voucherType',
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
        title: '标记',
        dataIndex: 'flag',
        width:'75px',
        render: text => {
            //1-海关进口增值税专用缴款书;2-农产品收购发票或者销售发票;3-代扣代缴收缴款凭证;4-其他;0-无标记；不传则所有状态
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color:'#b7eb8f'}}>海关进口增值税专用缴款书</span>;
                    break;
                case 2:
                    t=<span style={{color: '#f5222d'}}>农产品收购发票或者销售发票</span>;
                    break;
                case 3:
                    t=<span style={{color: "#f50"}}>代扣代缴收缴款凭证</span>;
                    break;
                case 4:
                    t=<span style={{color: "#91d5ff"}}>其他</span>;
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
class SalesInvoiceCollection extends Component{
    state={

        tableKey:Date.now(),
        visible:false,
        voucherNum:undefined,
        filters:{},
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    fetchResultStatus = ()=>{
        request.get('/income/financeDetails/controller/listMain',{
            params:this.state.filters
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
        const {visible,tableKey,filters,selectedRowKeys,voucherNum,statusParam} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns(this),
                    url:'/income/financeDetails/controller/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
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
                        title: "其他扣税凭证",
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/income/financeDetails/controller/upFlag",
                                        fields: markFieldsData,
                                        onSuccess: this.refreshTable,
                                    }
                                },{
                                    type:'submit',
                                    url:'/income/financeDetails/controller/submit',
                                    params:filters,
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/income/financeDetails/controller/revoke',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                        </div>,
                    },
                    /*scroll:{
                     x:'180%'
                     },*/
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
export default withRouter(SalesInvoiceCollection)