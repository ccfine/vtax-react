import React from 'react'
import Table from './FetchTable.r'
import {fMoney} from 'utils'
const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        dataIndex:'actions',
        render: (text, record) => (
            <span style={{
                color:'#f5222d',
                cursor:'pointer'
            }}>
                删除
            </span>
        )
    },
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别号',
        dataIndex:'taxIdentificationCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName'
    },
    {
        title:'单元',
        dataIndex:'element'
    },
    {
        title:'房号',
        dataIndex:'roomNumber'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode'
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'房间面积',
        dataIndex:'roomArea'
    },
    {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? '未匹配' : '已匹配' //0:未匹配,1:已匹配
    },
    {
        title:'交易日期',
        dataIndex:'transactionDate'
    },
]

  export default class extends React.Component{
    state={
        current:1,
        pageSize:10,
        tableUpDateKey:Date.now()
    }
    render(){
        return <Table url={'/output/room/files/list'}
        updateKey={this.state.tableUpDateKey}
        //filters={{mainId:'950212281515552770'}}
        tableProps={{
            rowKey:record=>record.id,
            pagination:false,
            pageSize:10,
            size:'small',
            renderCount:data=>[
                {
                    selectDisabled:true,
                    id:'-1',
                    actions:'本页总价：',
                    totalPrice:fMoney(data.pageTotalPrice)
                },{id:'-2',selectDisabled:true,actions:'全部总价：',totalPrice:fMoney(data.allTotalPrice)}],
            columns:getColumns(this),
            // rowSelection:{}
        }} />
    }
  }
  