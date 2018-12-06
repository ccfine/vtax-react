/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 18:08
 * description  : 公告中心查询页
 */

import React, { Component } from 'react'
import {Button,message,Modal} from 'antd'
import { request,composeBotton } from "utils"
import { SearchTable } from "compoments"
import PopsModal from './popModal'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchNoticeNum} from '../../redux/ducks/user'
import './index.less'

const transformData = (data=[]) =>{
    return data.map(item=>{
        return {
            uid: item.fileUuid,
            name: item.srcFileName,
        }
    })
}

const getSearchFields = [
    {
        label: "公告标题",
        fieldName: "title",
        span: 8,
    },
    {
        label: "公告类型",
        fieldName: "sysDictId",
        type: "select",
        span: 8,
        options: [
            {
                text: "集团税务公告",
                value: "1"
            },
            {
                text: "税务政策解读",
                value:  "2"
            },
            {
                text: "平台更新公告",
                value: "3"
            },
            {
                text: "其他公告",
                value: "4"
            }
        ]
    },
    {
        label: "公告级别",
        fieldName: "level",
        type: "select",
        span: 8,
        options: [
            {
                text: "紧急公告",
                value: "1"
            },
            {
                text: "重要公告",
                value:  "2"
            },
            {
                text: "普通公告",
                value: "3"
            }
        ]
    },
    {
        label: "生效日期",
        fieldName: "takeDate",
        type: "datePicker",
        span: 8,
        componentProps:{
            format:'YYYY-MM-DD'
        }
    },
    {
        label: "发布日期",
        fieldName: "publishDate",
        type: "datePicker",
        span: 8,
        componentProps:{
            format:'YYYY-MM-DD'
        }
    },
    // {
    //     label: "阅读状态",
    //     fieldName: "readStatus",
    //     type: "select",
    //     span: 8,
    //     options: [
    //         {
    //             text: "已阅读",
    //             value: "1"
    //         },
    //         {
    //             text: "未阅读",
    //             value:  "2"
    //         }
    //     ]
    // },
    // {
    //     label: "发布人",
    //     fieldName: "createBy",
    //     span: 8,
    // },
]

const getColumns = context => [
    {
        title: "公告标题",
        dataIndex: "title",
        width:'100px',
        render: (text) => {
            return `标题：${text}`
        }
    },
    {
        title: "公告类型",
        dataIndex: "sysDictId",
        width:'100px',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '集团税务公告'
            } else if (parseInt(text,0) === 2) {
                return '税务政策解读'
            } else if (parseInt(text,0) === 3) {
                return '平台更新公告'
            } else if (parseInt(text,0) === 4) {
                return '其他公告'
            } else {
                return ''
            }
        }
    },
    {
        title: "公告级别",
        dataIndex: "level",
        width:'100px',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '紧急公告'
            } else if (parseInt(text,0) === 2) {
                return '重要公告'
            } else if (parseInt(text,0 === 3)) {
                return '普通公告'
            } else {
                return ''
            }
        }
    },
    {
        title: "生效日期",
        dataIndex: "takeDate",
        width:'100px',
    },
    {
        title: "发布时间",
        dataIndex: "publishDateStr",
        width:'100px',
    },
    {
        title: "发布状态",
        dataIndex: "publishStatus",
        width:'100px',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '已发布'
            } else if (parseInt(text,0) === 0) {
                return '未发布'
            } else {
                return '————'
            }
        }
    },
    // {
    //     title: "发布人",
    //     dataIndex: "publishBy",
    //     width:'100px',
    // },
    {
        title: "操作",
        dataIndex: "taxableProject9",
        width:'100px',
        render(text, record, index) {
            if (record.publishStatus === 1) {
                return <a href={`/messageDetail?id=${record.id}&readStatus=2`} target="_blank" onClick={() => context.handleGo()}>查看</a>
            }else {
                return composeBotton([{
                    type:'action',
                    title:'编辑',
                    icon:'edit',
                    onSuccess: () => {
                        context.fetchFile(`/sysNotice/accessoryList?id=${record.id}`).then(data => {
                            context.setState({
                                visible: true,
                                modalType: "edit",
                                defaultData: record,
                                fileList: transformData(data)
                            });
                        });
                    }
                },{
                    type:'action',
                    title:'删除',
                    icon:'delete',
                    style:{
                        cursor:'pointer',
                        color:'red',
                    },
                    onSuccess:()=>context.deleteRole(record.id)
                }]);
            }
        },
    },
]

class MessageCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableUpDateKey: Date.now(),
            visible: false,
            defaultData: undefined,
            messageLoading: false,
            modalType: 'add',
            fileList: []
        }
    }

    refreshTable = () => {
        this.setState({
            tableUpDateKey: Date.now(),
        });
    };

    toggleModalVisible = visible => {
        this.setState({
            visible
        })
    }

    async fetchFile(url) {
        return await request
            .get(url)
            .then(({ data }) => {
                if (data.code === 200) {
                    return Promise.resolve(data.data);
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message, 4);
            });
    }

    deleteRole = (id) => {
		const modalRef = Modal.confirm({
			title: '友情提醒',
			content: '该删除后将不可恢复，是否删除？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				modalRef && modalRef.destroy()
				request
					.delete(`/sysNotice/delete/${id}`)
					.then(({ data }) => {
						if (data.code === 200) {
							message.success('删除成功')
                            this.refreshTable();
						} else {
							message.error(data.msg)
						}
					})
					.catch(err => {
						message.error(err.message)
					})
			},
			onCancel() {
				modalRef.destroy()
			}
		})
	}

    handleGo = () => {
        this.refreshTable()
        if (this.props.noticeNum > 0) {
            this.props.fetchNoticeNum()
        }
    }

    handleReturn = () => {
        window.history.back()
    }

    render() {
        const { tableUpDateKey, visible, defaultData, messageLoading, modalType, fileList } = this.state;
        return (
            <div className="message-center">
                <span className="message-return" onClick={this.handleReturn}>返回</span>
                <div className="title">公告中心</div>
                <SearchTable
                    searchOption={{
                        fields: getSearchFields,
                        cardProps:{
                            style:{borderTop:0}
                        }
                    }}
                    tableOption={{
                        columns: getColumns(this),
                        url: "/sysNotice/msgList",
                        key: tableUpDateKey,
                        scroll: { x: 1000, y:window.screen.availHeight-380},
                        extra: (
                            <div>
                                <Button type="primary" onClick={() => {
                                    this.setState({
                                        visible: true,
                                        modalType: "add",
                                        defaultData: undefined
                                    })
                                }}>创建公告</Button>
                            </div>
                        )
                    }}
                >

                </SearchTable>
                <PopsModal
                    defaultData={defaultData}
                    visible={visible}
                    loading={messageLoading}
                    modalType={modalType}
                    fileList={fileList}
                    toggleModalVisible={visible => {
                        this.setState({
                            visible: visible,
                            tableUpDateKey: Date.now(),
                        });
                    }}
                />
            </div>
        )
    }
}

export default withRouter(connect(state=>({
    noticeNum:state.user.get('noticeNum'),
}),dispatch=>({
    fetchNoticeNum:fetchNoticeNum(dispatch)
}))(MessageCenter))