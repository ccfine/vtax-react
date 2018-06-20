// Created by liuliyuan on 2018/6/20
// You should fork and save if you had updated this CodePend and want to send it to others.
// Note: antd.locales are only support by `dist/antd`
// 用来实现合计
import React, { Component } from 'react'
/*import {message } from 'antd'
import {request} from 'utils'*/
import TableSum from "./TableSum.r"

/*const columns =[
    {
        title: '编码',
        dataIndex: 'code',
        width: 200,
        fixed: 'left'
    }, {
        title: '纳税主体',
        dataIndex: 'name',
        width: 200
    },{
        title: '社会信用代码',
        dataIndex: 'taxNum',
        width: 200
    },{
        title: '开业日期',
        dataIndex: 'openingDate',
        width: 200
    },{
        title: '税务经办人',
        dataIndex: 'operater',
        width: 200
    },{
        title: '经办人电话',
        dataIndex: 'operaterPhone',
        width: 200,
    },{
        title: '营业状态',
        dataIndex: 'operatingStatus',
        width: 200,
    },{
        title: '当前状态',
        dataIndex: 'status',
        width: 200,
        fixed: 'right'
    }];

const summaryData = [
    {
        key: "code",
        code: "合计",
        status: '20000',
        width: 200,
        fixed: 'left'
    },
    {
        key: "taxNum",
        code: "总计",
        status: '70000',
        width: 200,
        fixed: 'right'
    }
];*/

const columns = [
    { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
    { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
    { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
    { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
    { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
    { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
    { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
];

const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

const summaryData = [
    {
        key: "name",
        name: "合计",
        age: '20000',
    },
    {
        key: "8",
        name: "总计",
        age: '70000',
    }
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
};

// rowSelection object indicates the need for row selection
const rowSelections = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === '合计' || record.name === '总计', // Column configuration not to be checked
        name: record.name,
    }),
};

export default class TableSumDisplay extends Component {
    state = {
        data:[],
        isShow:false
    }
    fetchData(){
        /*setTimeout(()=>{
            this.setState({
                data:data,
            },()=>{
                this.setState({
                    isShow:true,
                })
            })
        },2000)*/
        /*request.get('/taxsubject/list')
            .then(({data})=>{
                if(data.code===200){
                   this.setState({
                        data:[...data.data.records],
                    },()=>{
                       this.setState({
                           isShow:true,
                       })
                   })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })*/
    }
    componentDidMount(){
        this.fetchData()
    }

    render() {
        return (
            <TableSum
                columns={columns}
                data={data}
                summaryData={summaryData}
                tableOneOption={{
                    rowSelection:rowSelection
                }}
                tableTwoOption={{
                    rowSelection:rowSelections
                }}
                scroll={{ x: 1600, y: 100 }}
                bordered
            />
        )
    }
}