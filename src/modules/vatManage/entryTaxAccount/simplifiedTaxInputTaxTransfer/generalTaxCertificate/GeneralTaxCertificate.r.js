/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {message,Button,Icon} from 'antd'
import { withRouter } from 'react-router'
import {request,fMoney,getUrlParam,listMainResultStatus} from 'utils'
import {SearchTable} from 'compoments'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import PopModal from './popModal'
import ViewDocumentDetails from '../../../entryManag/otherDeductibleInputTaxDetails/viewDocumentDetailsPopModal'
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
        }
    ]
}
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
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
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: '简易计税',
        dataIndex: 'commonlyFlag',
        sorter: true,
        render: text => {
            //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
            let res = "";
            switch (parseInt(text, 0)) {
                case 1:
                    res = "标记";
                    break;
                case 0:
                    res = ""; //不标记
                    break;
                default:
            }
            return res;
        }
    }
];
class GeneralTaxCertificate extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        visibleView:false,
        voucherNum:undefined,
        searchFieldsValues:{},
        dataSource:[],
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }
    fetchResultStatus = ()=>{
        request.get('/account/incomeSimpleOut/controller/listMain',{
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

    showModal=()=>{
        this.setState({
            visible:true,
            searchFieldsValues:this.state.searchFieldsValues,
            selectedRows:this.state.searchFieldsValues,
        })
    }

    hideModal=()=>{
        this.setState({
            visible:false,
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
        const {visible,visibleView,voucherNum,tableKey,searchFieldsValues,selectedRowKeys,dataSource,statusParam} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        const {mainId,authMonth} = searchFieldsValues;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = statusParam && parseInt(statusParam.status, 0) === 2;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns(this),
                    url:'/account/incomeSimpleOut/controller/commonlyTaxList',
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
                        title: "一般计税凭证列表",
                        extra:<div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }

                            <Button size='small' disabled={!selectedRowKeys.length>0 || disabled1} style={{marginRight:5}} onClick={()=>this.showModal()} >
                                <Icon type="pushpin-o" />
                                标记
                            </Button>
                            <SubmitOrRecall disabled={disabled2} type={1} url="/income/financeDetails/controller/submit" onSuccess={this.refreshTable} />
                            <SubmitOrRecall disabled={!disabled1} type={2} url="/income/financeDetails/controller/revoke" onSuccess={this.refreshTable} />

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
                <PopModal refreshTable={this.refreshTable} visible={visible} searchFieldsValues={searchFieldsValues} selectedRowKeys={selectedRowKeys} hideModal={this.hideModal} />
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visibleView}
                    voucherNum={voucherNum}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(GeneralTaxCertificate)