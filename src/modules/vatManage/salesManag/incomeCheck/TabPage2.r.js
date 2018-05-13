/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable,FileExport,FileImportModal} from 'compoments'
import {Card,Modal,Icon,message,Button} from 'antd'
import {fMoney,request} from 'utils'

import {SearchTable} from 'compoments'

const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目分期名称',
        dataIndex: 'contractNum',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesName',
    },{
        title: '交易期间 ',
        dataIndex: 'voucherDate',
    },{
        title: '人民币成交总价',
        dataIndex: 'creditSubjectName',
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '税率',
        dataIndex: 'creditSubjectCode',
        render: text => (text ? `${text}%` : text),
    },{
        title: '税额',
        dataIndex: 'creditAmount',
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '不含税金额',
        dataIndex: 'creditAmount',
        render:text=>fMoney(text),
        className: "table-money"
    }
];

export default class TabPage extends Component{
    state={
        visible:false,
        updateKey:Date.now(),
        selectedRowKeys:[],
    }
    refreshTable(){
        this.setState({updateKey:Date.now()})
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }

    componentDidMount(){
        this.setState({
            updateKey: Date.now()
        });
    }
    render(){
        const {selectedRowKeys,updateKey} = this.state;
        const props = this.props;
        return(
            <Card title="房间交易信息" style={{marginTop:10}}>

                <AsyncTable url="/income/financeDetails/controller/incomeCheck"
                            updateKey={updateKey}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:true,
                                size:'small',
                                columns:columns,
                            }} />

            </Card>
        )
    }
}