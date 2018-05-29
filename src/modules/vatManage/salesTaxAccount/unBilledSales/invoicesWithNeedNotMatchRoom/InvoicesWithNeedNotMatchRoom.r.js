/**
 * Created by liurunbin on 2018/1/16.
 */
import React,{Component} from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,getUrlParam} from '../../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
const searchFields = (disabled) => {
    return [
        {
            label: '开票时间',
            fieldName: 'billingDate',
            type: 'rangePicker',
            span:6,
            formItemStyle,
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
            formItemStyle,
            span:6,
            type: 'input',
        },
        {
            label: '购货单位名称',
            fieldName: 'purchaseName',
            formItemStyle,
            span:6,
            type: 'input',
        },
        {
            label: '发票号码',
            fieldName: 'invoiceNum',
            formItemStyle,
            span:6,
            type: 'input',
        },
        {
            label: '税率',
            fieldName: 'taxRate',
            formItemStyle,
            span:6,
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
        className:'text-right',
        render:text=>text? `${text}%`: text,
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
        totalSource:undefined,
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
        const {tableKey,totalSource} = this.state;
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
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/output/invoice/marry/unwanted/list',
                    extra:<div>
                            <TableTotal totalSource={totalSource} />
                        </div>,
                    scroll:{
                        x:'150%'
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(InvoicesWithNeedNotMatchRoom)