/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 18:08
 * description  : 公告中心查询页
 */

import React, { Component } from 'react'
import {Button,message,Modal,Icon} from 'antd'
import { request,composeBotton, requestDict, setFormat } from "utils"
import { SearchTable } from "compoments"
import PopsModal from './popModal'
import './index.less'

const transformData = (data=[]) =>{
    return data.map(item=>{
        return {
            uid: item.fileUuid,
            name: item.srcFileName,
            noticeId: item.noticeId,
            gglxDict: []
        }
    })
}

const getSearchFields = context => [
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
        options: context.state.gglxDict
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
        dataIndex: "sysDictName",
        width:'100px',
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
    {
        title: "操作",
        dataIndex: "taxableProject9",
        width:'100px',
        render(text, record, index) {
            if (record.publishStatus === 1) {
                return composeBotton([{
                    type:'action',
                    icon:'search',
                    title:'查看',
                    onSuccess:()=>{
                        window.open(`/messageDetail?id=${record.id}&readStatus=0`)
                    }
                }])
                // return <a href={`/messageDetail?id=${record.id}&readStatus=0`} target="_blank">查看</a>
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
            fileList: [],
            gglxDict: []
        }
    }

    componentDidMount() {
        //公告类型字典
        requestDict('gglglx', result => {
            this.setState({
                gglxDict: setFormat(result)
            });
        });
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

    handleReturn = () => {
        window.history.back()
    }

    render() {
        const { tableUpDateKey, visible, defaultData, messageLoading, modalType, fileList, gglxDict } = this.state;
        return (
            <div className="message-center">
                {/* <span className="message-return" onClick={this.handleReturn}>返回</span> */}
                <div style={{ margin: "0px 0 6px 6px" }} onClick={this.handleReturn}>
					<span style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12}}>
						<Icon type="left" /><span>返回</span>
					</span>
				</div>
                <div className="title">公告中心</div>
                <SearchTable
                    searchOption={{
                        fields: getSearchFields(this),
                        cardProps:{
                            style:{borderTop:0}
                        }
                    }}
                    tableOption={{
                        columns: getColumns(this),
                        url: "/sysNotice/msgList",
                        key: tableUpDateKey,
                        scroll: { x: 1000, y:window.screen.availHeight-500},
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
                    gglxDict={gglxDict}
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

export default MessageCenter