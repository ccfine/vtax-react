/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-11 10:25:21 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-11 17:27:34
 */
import React, { Component } from "react";
import { Button, Icon, Tooltip } from "antd";
import { SearchTable } from "compoments";
import PopModal from "./popModal";
const buttonStyle = {
    margin: "0 5px"
};
const searchFields = [
    {
        label: "科目代码",
        type: "input",
        fieldName: "code"
    }
];
const getColumns = context => [
    {
        title: "操作",
        className:'text-center',
        render(text, record, index) {
            return (
                <span className="table-operate">
                    <a
                        onClick={() => {
                            context.setState({
                                visible: true,
                                action: "look",
                                opid: record.id
                            });
                        }}
                    >
                        <Tooltip placement="top" title="查看">
                            <Icon type="search" />
                        </Tooltip>
                    </a>
                    <a
                        onClick={() => {
                            context.setState({
                                visible: true,
                                action: "modify",
                                opid: record.id
                            });
                        }}
                    >
                        <Tooltip placement="top" title="编辑">
                            <Icon type="edit" />
                        </Tooltip>
                    </a>
                </span>
            );
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">科目代码</p>
                <p className="apply-form-list-p2">末级明细科目</p>
            </div>
        ),
        dataIndex: "code"
    },
    {
        title: "一级科目",
        dataIndex: "parentName"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">二级科目</p>
                <p className="apply-form-list-p2">对应收入类型</p>
            </div>
        ),
        dataIndex: "name"
    },
    {
        title: "税目",
        dataIndex: "taxItem"
    },
    {
        title: "税率",
        dataIndex: "commonlyTaxRate",
        render: text => (text ? `${text}%` : text)
    },
    {
        title: "简易征收率",
        dataIndex: "simpleTaxRate",
        render: text => (text ? `${text}%` : text)
    },
    {
        title: "最后修改人",
        dataIndex: "lastModifiedBy"
    },
    {
        title: "最后修改时间",
        dataIndex: "lastModifiedDate"
    }
];

export default class SubjectRateRela extends Component {
    state = {
        updateKey: Date.now(),
        visible: false,
        action: undefined,
        opid: undefined
    };
    hideModal = () => {
        this.setState({ visible: false });
    };
    update = () => {
        this.setState({ updateKey: Date.now() });
    };
    render() {
        let { updateKey } = this.state;
        return (
            <SearchTable
                searchOption={{
                    fields: searchFields
                }}
                tableOption={{
                    columns: getColumns(this),
                    url: "/incomeAndTaxRateCorrespondence/list",
                    key: updateKey,
                    extra: (
                        <div>
                            <Button
                                size="small"
                                style={buttonStyle}
                                onClick={() => {
                                    this.setState({
                                        visible: true,
                                        action: "add",
                                        opid: undefined
                                    });
                                }}
                            >
                                <Icon type="plus" />新增
                            </Button>
                        </div>
                    ),
                    cardProps: {
                        title: "主营业收入科目税率对应表"
                    },
                    scroll: {
                        x: "100%"
                    }
                }}
            >
                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => {
                        this.hideModal();
                    }}
                    id={this.state.opid}
                    update={this.update}
                />
            </SearchTable>
        );
    }
}
