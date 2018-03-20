/**
 * Created by liurunbin on 2018/1/16.
 */
import React,{Component} from 'react'
import {SearchTable} from '../../../../../compoments'
import {fMoney,getUrlParam} from '../../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment';

const searchFields = (disabled) => {
    return [
        {
            label: '开票时间',
            fieldName: 'billingDate',
            type: 'rangePicker',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && [moment(getUrlParam('authMonth'), 'YYYY-MM-DD'), moment(getUrlParam('authMonthEnd'), 'YYYY-MM-DD')]) || undefined,
            }
        },
        {
            label: '货物名称',
            fieldName: 'commodityName',
            type: 'input',
        },
        {
            label: '购货单位名称',
            fieldName: 'purchaseName',
            type: 'input',
        },
        {
            label: '发票号码',
            fieldName: 'invoiceNum',
            type: 'input',
        },
        {
            label: '税率',
            fieldName: 'taxRate',
            type: 'numeric',
            componentProps: {
                valueType: 'int'
            },
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
                return '增值税专用发票'
            }
            if(text ==='c'){
                return '增值税普通发票'
            }
            return ''
        }
    },
    {
        title:'货物名称',
        dataIndex:'commodityName',
    },
    {
        title:'开票日期',
        dataIndex:'billingDate',
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        render:text=>text? `${text}%` : ''
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

class InvoicesWithNeedNotMatchRoom extends Component{
    state={
        tableKey:Date.now(),
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
        }else{
            this.refreshTable()
        }
    }
    render(){
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        },
                    }
                }}
                tableOption={{
                    key:this.state.tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/output/invoice/marry/unwanted/list',
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div>
                                    <label>本页合计：</label>
                                    本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                    本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                    本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                </div>
                                <div>
                                    <label>总计：</label>
                                    总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                    总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                    总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'150%'
                    },
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(InvoicesWithNeedNotMatchRoom)