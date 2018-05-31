/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import { SearchTable } from 'compoments'
import {composeBotton} from 'utils'
import PopModal from './popModal'
const searchFields = [
    {
        label: '纳税主体',
        type: 'taxMain',
        fieldName: 'mainId',
    }
]
const getColumns = context => [
    {
        title: '操作',
        render:(text, record)=>composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:[],
            onSuccess:()=>context.setState({
                visible: true,
                action: 'modify',
                opid: record.id
            })
        }]),
        fixed: 'left',
        width: '70px',
        dataIndex: 'action'
    }, {
        title: '纳税主体',
        dataIndex: 'mainName',
        render:(text,record)=>{
            return (
                <a  title="查看详情" style={{ marginRight: "5px" }}
                   onClick={() => {
                    context.setState({
                        visible: true,
                        action: 'look',
                        opid: record.id
                    });
                }}>
                    {text}
                </a>
            )
        }
    }, {
        title: '档案类型',
        dataIndex: 'fileType',
    }, {
        title: '归档日期',
        dataIndex: 'fileDate',
    }, {
        title: '归档资料名称',
        dataIndex: 'fileName',
    }]

export default class OtherFiles extends Component {
    state = {
        updateKey: Date.now(),
        visible: false,
        action: undefined,
        opid: undefined,
    }
    hideModal = () => {
        this.setState({ visible: false });
    }
    update = () => {
        this.setState({ updateKey: Date.now() });
    }
    render() {
        let { updateKey } = this.state;
        return (
            <div>
                <SearchTable
                    searchOption={{
                        fields: searchFields
                    }}
                    tableOption={{
                        columns: getColumns(this),
                        url: '/other/file/list',
                        key: updateKey,
                        extra: <div>
                            {
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    userPermissions:[],
                                    onClick:()=>{
                                        this.setState({
                                            visible: true,
                                            action: "add",
                                            opid: undefined
                                        });
                                    }
                                }])
                            }
                        </div>,
                        cardProps: {
                            title: '其他档案'
                        }
                    }}
                >
                </SearchTable>

                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => { this.hideModal() }}
                    id={this.state.opid}
                    update={this.update} />
            </div>
        )
    }
}