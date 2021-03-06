/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-11 10:25:21 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-11 10:55:00
 */
import React, { Component } from "react";
import {connect} from 'react-redux'
import { SearchTable } from "compoments";
import {composeBotton} from 'utils'
import PopModal from "./popModal";
import {Tooltip} from 'antd'

const searchFields = [
    {
        label: "科目代码",
        type: "input",
        fieldName: "code"
    }
];
const getColumns = (context) => [
    {
        title: "操作",
        className:'text-center',
        render(text, record, index) {
            return composeBotton([{
                type: 'action',
                icon: 'edit',
                title: '编辑',
                onSuccess: () => {
                    context.setState({
                        visible: true,
                        action: "modify",
                        opid: record.id
                    });
                }
            }])
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">科目代码</p>
                <p className="apply-form-list-p2">(末级明细科目)</p>
            </div>
        ),
        dataIndex: "code",
        render:(text,record)=>{
            return (
                <a  title="查看详情"
                    onClick={() => {
                        context.setState({
                            visible: true,
                            action: "look",
                            opid: record.id
                        });
                    }}
                >
                    {text}
                </a>
            )
        }
    },
    {
        title: '税收分类编码',
        dataIndex: 'classificationList',
        width: '200px',
        render: text => {
            if (text && text.length > 30) {
                return (<Tooltip placement="left" title={text}>
                    <span>{text.substr(0,30) + '...'}</span>
                </Tooltip>)
            } else {
                return text;
            }
        }
    },
    {
        title: "一级科目",
        dataIndex: "parentName"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">二级科目</p>
                <p className="apply-form-list-p2">(对应收入类型)</p>
            </div>
        ),
        dataIndex: "name",
    },
    {
        title: "辅助核算项",
        dataIndex: "accountingEntries",
    },
    {
        title: "税目",
        dataIndex: "taxItem",
    },
    {
        title:'不区分计税方法',
        dataIndex:'noTaxMethod',
        render:text=>text?'是':'否'
    },
    {
        title: "一般税率",
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

class SubjectRateRela extends Component {
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
                            {
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    onClick:()=>{
                                        this.setState({
                                            visible: true,
                                            action: "add",
                                            opid: undefined
                                        });
                                    }
                                }])
                            }
                        </div>
                    ),
                    cardProps: {
                        title: "科目税率对应表"
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
export default (connect(state=>({
    declare:state.user.get('declare')
}))(SubjectRateRela))
