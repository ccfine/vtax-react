// Created by liuliyuan on 2018/6/20
// You should fork and save if you had updated this CodePend and want to send it to others.
// Note: antd.locales are only support by `dist/antd`
// 用来实现合计
import { Table, Icon } from "antd";
import React from "react";
import ReactDOM from "react-dom";
import TableSum from "./TableSum.jsx";
import "antd/dist/antd.css";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        width: 200
    },
    {
        title: "Age",
        dataIndex: "age",
        width: 200
    },
    {
        title: "Address",
        dataIndex: "address",
        width: 200
    }
];
const data = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park"
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park"
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "4",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "5",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "6",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "7",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "88",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    },
    {
        key: "9",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park"
    }
];
const summaryData = [
    {
        key: "6",
        name: "合计",
        age: 1000,
        address: 20000
    },
    {
        key: "7",
        name: "总计",
        age: 5000,
        address: 70000
    }
];
ReactDOM.render(
    <TableSum
        columns={columns}
        data={data}
        summaryData={summaryData}
        scroll={{ x: 900, y: 300 }}
        bordered
    />,
    document.getElementById("container")
);
