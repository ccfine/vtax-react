/**
 * Created by liurunbin on 2018/1/18.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-07 12:23:47
 *
 */
import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {SearchTable} from 'compoments'
import {fMoney,getUrlParam,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const searchFields =(disabled)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'纳税申报期',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税申报期'
                    }
                ]
            },
        },
    ]
}
const getColumns = context => [
    {
        title:'纳税主体名称',
        dataIndex:'mainName',
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目分期名称</p>
                <p className="apply-form-list-p2">项目分期代码</p>
            </div>
        ),
        dataIndex: 'projectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.projectNum}</p>
            </div>
        )
    }, {
        title:'凭证日期',
        dataIndex:'voucherDate',
    }, {
        title:'凭证类型',
        dataIndex:'voucherType',
    }, {
        title:'凭证号',
        dataIndex:'voucherNum',
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
    }, {
        title:'凭证摘要',
        dataIndex:'voucherAbstract',
    }, {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">贷方科目名称</p>
                <p className="apply-form-list-p2">贷方科目代码</p>
            </div>
        ),
        dataIndex: 'creditSubjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.creditSubjectCode}</p>
            </div>
        )
    }, {
        title:'贷方金额',
        dataIndex:'creditAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }, {
        title:'预缴税率',
        dataIndex:'taxRate',
        render:text=>fMoney(text),
        className:'table-money'
    }, {
        title:'预缴税款',
        dataIndex:'prepayAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];


class PrepayTax extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        visibleView:false,
        voucherNum:undefined,
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/prepaytax/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {searchTableLoading,tableKey,visibleView,voucherNum,statusParam,filters} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: "预缴税款台账",
                    },
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/account/prepaytax/prepayTaxList',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                type:'submit',
                                url:'/account/prepaytax/submit',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/prepaytax/revoke',
                                params:filters,
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                    </div>,
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visibleView}
                    voucherNum={voucherNum}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(PrepayTax)