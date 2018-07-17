/**
 * Created by liurunbin on 2018/1/18.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-17 14:17:34
 *
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {SearchTable} from 'compoments'
import {fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
import moment from 'moment';
const searchFields =(disabled,declare)=> {
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
                initialValue: (disabled && declare.mainId) || undefined,
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
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
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
        title:'纳税主体',
        dataIndex:'mainName',
        width:'20%',
    },{
        title:'项目分期',
        dataIndex:'stagesName',
    }, {
        title:'金额（不含税）',
        dataIndex:'withOutAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'15%',
    }, {
        title:'金额（含税）',
        dataIndex:'withTaxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'15%',
    }, {
        title:'预缴税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text && `${text}%`,
        width:80,
    }, {
        title:'预缴税款',
        dataIndex:'prepayAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'15%',
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
    fetchResultStatus = ()=>{
        requestResultStatus('/account/prepaytax/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {searchTableLoading,tableKey,visibleView,voucherNum,statusParam,filters} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        className:''
                    },
                }}
                doNotFetchDidMount={!disabled}
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
                    scroll:{
                        x:1000,
                        y:window.screen.availHeight-380,
                    },
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/account/prepaytax/prepayTaxList',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }{
                            JSON.stringify(filters) !=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'account/prepaytax/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1331007'],
                            }],statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'submit',
                                url:'/account/prepaytax/submit',
                                params:filters,
                                userPermissions:['1331010'],
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/prepaytax/revoke',
                                params:filters,
                                userPermissions:['1331011'],
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
export default PrepayTax