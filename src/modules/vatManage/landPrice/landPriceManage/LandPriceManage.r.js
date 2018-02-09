/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react';
import { SearchTable } from '../../../../compoments';
import PopModal from "./popModal";
import { fMoney } from '../../../../utils'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
const pointerStyle = {
    cursor: 'pointer',
    color: '#1890ff',
    marginRight: '5px'
}

const searchFields = [
    {
        label: '纳税主体',
        type: 'taxMain',
        fieldName: 'mainId',
    }
]
const getColumns = (context) => [
    {
        title: '操作',
        key: 'actions',
        render: (text, record) => (
            <div>
                <span style={pointerStyle} onClick={() => {
                    context.setState({ opid: record.id, readOnly: false, visible: true, updateKey: Date.now() });
                }}>编辑</span>
                <span style={pointerStyle} onClick={() => {
                    context.setState({ opid: record.id, readOnly: true, visible: true, updateKey: Date.now() });
                }}>查看</span>
            </div>
        ),
        fixed: 'left',
        width: '75px'
    }, {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目编码',
        dataIndex: 'itemNum',
    }, {
        title: '项目名称',
        dataIndex: 'itemName',
    }, {
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    }, {
        title: '合同建筑面积(m²)',
        dataIndex: 'coveredArea',
    }, {
        title: '调整后建筑面积(m²)',
        dataIndex: 'buildArea',
    }, {
        title: '可抵扣地价款',
        dataIndex: 'deductibleLandPrice',
        render: text => fMoney(text),
        className: 'table-money'
    }, {
        title: '实际已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
        render: text => fMoney(text),
        className: 'table-money'
    }, {
        title: '已售建筑面积(m²)',
        dataIndex: 'saleArea',
    }
];

export default class LandPriceManage extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        tableUpdateKey: Date.now()
    }
    hideModal() {
        this.setState({ visible: false });
    }
    updateTable = () => {
        this.setState({ tableUpdateKey: Date.now() })
    }
    render() {
        return (
            <div>
                <SearchTable
                    searchOption={{
                        fields: searchFields
                    }}
                    tableOption={{
                        pageSize: 10,
                        columns: getColumns(this),
                        url: '/landPriceInfo/list',
                        key: this.state.tableUpdateKey,
                        cardProps: {
                            title: '土地价款管理',
                            extra: (<div>
                                <SubmitOrRecall monthFieldName='authMonth' type={1} url="/landPriceInfo/submit" onSuccess={this.updateTable} />
                                <SubmitOrRecall monthFieldName='authMonth' type={2} url="/landPriceInfo/revoke" onSuccess={this.updateTable} />
                            </div>)
                        }
                    }}
                >
                </SearchTable>
                <PopModal
                    visible={this.state.visible}
                    readOnly={this.state.readOnly}
                    hideModal={() => { this.hideModal() }}
                    id={this.state.opid}
                    onSuccess={this.updateTable}
                    updateKey={this.state.updateKey} />
            </div>
        )
    }
}