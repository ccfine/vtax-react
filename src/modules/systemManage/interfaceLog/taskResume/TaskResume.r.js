/**
 * Created by liuliyuan on 2018/11/5.
 */
import React, {Component} from "react";
import {SearchTable} from "compoments";
import moment from 'moment';

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};

const searchFields = (disabled, declare) => getFieldValue => {
    return [
        {
            label: "创建期间",
            fieldName: "createTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format: "YYYY-MM-DD"
            }
        },
        {
            label: "修改期间",
            fieldName: "lastModifiedTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format: "YYYY-MM-DD"
            }
        },
        {
            label: "流水号",
            fieldName: "id",
            span: 8,
            formItemStyle
        },
        {
            label: "接口",
            fieldName: "apiKey",
            type: "input",
            span: 8,
            formItemStyle
        },
        {

            label: "状态",
            fieldName: "status",
            type: "select",
            span: 8,
            options: [
                {text: '待处理', value: '10'},
                {text: '处理中', value: '20'},
                {text: '处理成功', value: '30'},
                {text: '异常', value: '40'}
            ],
            formItemStyle,
            fieldDecoratorOptions: {
                rules: [
                    {
                        // required:true,
                        message: '请选择状态'
                    }
                ]
            },
            componentProps: {
                disabled
            }
        }
    ];
};

const getColumns = () => {
    return [
        {
            title: "流水号",
            dataIndex: "id",
            width: "200px"
        },
        {
            title: "接口",
            dataIndex: "apiKey",
            width: "200px"
        },
        {
            title: "参数",
            dataIndex: "param",
            width: "300px"
        },
        {
            title: "信息",
            dataIndex: "msg",
            width: "200px"
        },
        {
            title: "数据来源",
            dataIndex: "content",
            width: "200px"
        },
        {
            title: "状态",
            dataIndex: "status",
            className:'text-center',
            width: "100px"
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            className:'text-center',
            width: "200px",
            render(text) {
                return moment(text - '').format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: "任务结束时间",
            dataIndex: "lastModifiedTime",
            className:'text-center',
            width: "200px",
            render(text) {
                return moment(text - '').format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: "请求报文",
            dataIndex: "requestMsg"
        },
        {
            title: "响应报文",
            dataIndex: "responseMsg"
        }
    ];
};

export default class TaskResume extends Component {
    constructor() {
        super();
        this.state = {
            updateKey: Date.now()
        };
    }

    render() {
        return (
            <div className="oneline">
                <SearchTable
                    searchOption={{
                        fields: searchFields()
                    }}
                    tableOption={{
                        key: this.state.updateKey,
                        pageSize: 100,
                        columns: getColumns(),
                        url: "/api/queryJobRecord",
                        scroll: {y: window.screen.availHeight - 350, x: 3000},
                        cardProps: {
                            title: "任务履历"
                        }
                    }}
                />
            </div>
        );
    }
}