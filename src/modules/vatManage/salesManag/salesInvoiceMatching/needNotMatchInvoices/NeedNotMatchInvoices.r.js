/**
 * Created by liurunbin on 2018/1/11.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-20 12:16:41
 *
 */
import React, { Component } from 'react'
import {fMoney,getUrlParam,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import ManualMatchRoomModal from './addDataModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields=(disabled)=> {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'mainId',
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
        },
        {
            label: '开票日期',
            type: 'monthPicker',
            span:6,
            fieldName: 'authMonth',
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票月份'
                    }
                ]
            }
        },
        {
            label: '货物名称',
            type: 'input',
            span:6,
            fieldName: 'commodityName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '购货单位名称',
            type: 'input',
            span:6,
            fieldName: 'purchaseName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '发票号码',
            type: 'input',
            span:6,
            fieldName: 'invoiceNum',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '税率',
            type: 'numeric',
            span:6,
            fieldName: 'taxRate',
            formItemStyle,
            componentProps: {
                valueType: 'int'
            }
        }
    ]
}
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum'
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票类型',
        dataIndex:'invoiceType',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },
    {
        title:'货物名称',
        dataIndex:'commodityName'
    },
    {
        title:'开票日期',
        dataIndex:'billingDate',
        width:'75px'
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'税率',
        dataIndex:'taxRate'
    },
    {
        title:'税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

class NeedNotMatchInvoices extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        filters:{

        },

        searchTableLoading:false,

        /**
         *修改状态
         * */
        statusParam:'',
        
        totalSource:undefined,
    }
    toggleModalVisible=visible=>{
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
    fetchResultStatus = ()=>{
        requestResultStatus('/output/invoice/collection/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {visible,tableKey,statusParam,totalSource,filters} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
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
                        },
                        className:''
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    onSuccess:(params,data)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    url:'/output/invoice/marry/unwanted/list',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" && composeBotton([{
                                type:'add',
                                onClick: ()=>this.toggleModalVisible(true)
                            }],statusParam)
                        }
                        <TableTotal totalSource={totalSource} />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:'180%'
                    },
                }}
            >
                <ManualMatchRoomModal title="新增信息" refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(NeedNotMatchInvoices)
