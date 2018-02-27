/**
 * author       : liuliyuan
 * createTime   : 2018/2/11 15:02
 * description  :
 */
import React, { Component } from 'react'
import {CountTable} from '../../../../compoments'
import {request,fMoney} from '../../../../utils'

const columns = [
    {
        title: '数据来源',
        dataIndex: 'sourceType',
        width:100,
        fixed: 'left',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            if(text===3){
                return '本页金额'
            }
            if(text===4){
                return '总额'
            }
            return text;
        }
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
        width:100,
    }, {
        title: '发票类型',
        dataIndex: 'invoiceTypeName',
        width:100,
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:100,
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:100,
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:100,
    },{
        title: '认证月份',
        dataIndex: 'authMonth',
        width:100,
    },{
        title: '认证时间',
        dataIndex: 'authDate',
        width:100,
    },{
        title: '销售单位名称',
        dataIndex: 'sellerName',
        width:100,
    },{
        title: '纳税人识别号',
        dataIndex: 'sellerTaxNum',
        width:100,
    },{
        title: '金额',
        dataIndex: 'amount',
        width:200,
        //fixed: 'right',
        render:text=>fMoney(text)
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        width:200,
        //fixed: 'right',
        render:text=>fMoney(text)
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        width:200,
        fixed: 'right',
        render:text=>fMoney(text)
    }
];

class RoleManage extends Component{
    state= {
        dataSource: [],
        footerDate: [],
        pagination: {
            showSizeChanger:true,
            showQuickJumper:true,
            pageSize:10,
            showTotal:total => `总共 ${total} 条`,
            pageSizeOptions:['10','20','30','40','50','60','70','80','90','100']
        },
    }
    fetch = (params={}) => {
        const composeParams = {
            size: this.state.pagination.pageSize,
            ...params
        };
        request.get('/income/invoice/collection/list',{
            params:composeParams
        }).then(({data}) => {
            if(data.code===200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data.page.total;
                pagination.pageSize = data.data.page.size;
                console.log([{...data.data}])
                const list = data.data;
               this.setState({
                    dataSource:data.data.page.records,
                    footerDate:[{
                        id: '00001',
                        sourceType: 3,
                        mainName:'',
                        invoiceTypeName:'',
                        invoiceCode:'',
                        invoiceNum:'',
                        billingDate:'',
                        authMonth:'',
                        authDate:'',
                        sellerName:'',
                        sellerTaxNum:'',
                        amount:list.pageAmount,
                        taxAmount:list.pageTaxAmount,
                        totalAmount:list.pageTotalAmount,
                    },{
                        id: '00002',
                        sourceType: 4,
                        mainName:'',
                        invoiceTypeName:'',
                        invoiceCode:'',
                        invoiceNum:'',
                        billingDate:'',
                        authMonth:'',
                        authDate:'',
                        sellerName:'',
                        sellerTaxNum:'',
                        amount:list.allAmount,
                        taxAmount:list.allTaxAmount,
                        totalAmount:list.allTotalAmount,
                    }],
                    pagination
                });

            }
        }).catch(err=>{

        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            size: pagination.pageSize,
            current: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }

    componentDidMount(){
        this.fetch()
    }
    componentWillReceiveProps(nextProps){
    }
    render(){
        const {dataSource,footerDate,pagination} = this.state;
        const setting = {
            columns:columns,
            bordered:false,
            pagination:false,
            dataSource:dataSource,
            rowKey:record=>record.id,
            scroll:{x: '2000px', y: '240px'}  //
        }
        const setting2 = {
            columns:columns,
            bordered:false,
            showHeader:false,
            pagination:pagination,
            dataSource:footerDate,
            rowKey:record=>record.id,
            scroll:{x: '2000px', y: '240px'}
        }
        return (
            <div>
                <CountTable
                    id='roleManage'
                    setting={setting}
                    handleTableChange={this.handleTableChange}
                    setting2={setting2}
                />
            </div>

        )
    }

}

export default RoleManage