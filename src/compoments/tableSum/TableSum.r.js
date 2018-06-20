// Created by liuliyuan on 2018/6/20
import React from "react";
import ReactDOM from "react-dom";
import { Table } from "antd";
import "./index.css";
export default class TableSum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const dom = ReactDOM.findDOMNode(this);
        const table = dom.querySelectorAll(".ant-table-body");
        let l = table[0];
        l.style.overflowX = "hidden";
        let r = table[1];
        r.addEventListener("scroll", function() {
            l.scrollLeft = r.scrollLeft;
        });
    }
    render() {
        return (
            <Table
                columns={this.props.columns}
                dataSource={this.props.data}
                scroll={this.props.scroll}
                bordered
                footer={() => (
                    <div>
                        <Table
                            columns={this.props.columns}
                            dataSource={this.props.summaryData}
                            pagination={false}
                            showHeader={false}
                            scroll={this.props.scroll}
                            bordered
                        />
                    </div>
                )}
                className="ant-table-body"
            />
        );
    }
}
