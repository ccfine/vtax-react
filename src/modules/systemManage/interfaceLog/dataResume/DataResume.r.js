/**
 * Created by liuliyuan on 2018/11/5.
 */
import React, { Component } from "react"
import { SearchTable } from "compoments"
import moment from 'moment'

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}


const searchFields =(disabled,declare)=> getFieldValue => {
    return [
        {
            label: "接口",
            fieldName: "apiKey",
            type: "input",
            span: 8,
            formItemStyle,
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请输入接口'
                    }
                ]
            },
        },
        {
            label: "创建期间",
            fieldName: "createTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format:"YYYY-MM-DD"
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择创建期间'
                    }
                ]
            },
        },
        {
            label: "修改期间",
            fieldName: "lastModifiedTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format:"YYYY-MM-DD"
            }
        },
        {
            label: "流水号",
            fieldName: "id",
            span: 8,
            formItemStyle
        },
        {
            label: "任务流水号",
            fieldName: "jobId",
            span: 8,
            formItemStyle
        },
        {

            label: "状态",
            fieldName: "status",
            type: "select",
            span: 8,
            options:[
                {text:'待处理',value:'10'},
                {text:'处理中',value:'20'},
                {text:'处理成功',value:'30'},
                {text:'异常',value:'40'},
            ],
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: getFieldValue('status'),
                rules:[
                    {
                        // required:true,
                        message:'请选择状态'
                    }
                ]
            },
            componentProps:{
                disabled
            }
        }
    ]
}


const getColumns = () => {
    
    return [
        {
            title: "接口",
            dataIndex: "apiKey",
            width: "200px"
        },
        {
            title: "流水号",
            dataIndex: "id",
            width: "200px"
        },
        {
            title: "任务流水号",
            dataIndex: "jobId",
            width: "200px"
        },
        {
            title: "数据来源",
            dataIndex: "baseSource",
            width: "200px"
        },
        {
            title: "状态",
            dataIndex: "baseStatus",
            className:'text-center',
            width: "100px"
        },
        {
            title: "描述",
            dataIndex: "baseMsg",
            width: "300px",
        },
        {
            title: "接口字段报文",
            dataIndex: "apiData",
            render(obj){
                if(obj.constructor === Object || obj.constructor === Array){
                    return JSON.stringify(obj);
                }else{
                    return obj;
                }
            }
        },
        {
            title: "创建时间",
            dataIndex: "baseCreateTime",
            className:'text-center',
            width: "200px",
            render(text){
                return moment(text-'').format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: "任务结束时间",
            dataIndex: "baseLastModifiedTime",
            className:'text-center',
            width: "200px",
            render(text){
                return moment(text - '').format('YYYY-MM-DD HH:mm:ss');
            }
        }
    ]
}

export default class DataResume extends Component {
    constructor () {
        super()
        this.state = {
            updateKey: Date.now()
        }
    }

    render () {
        return (
            <div className="oneline">
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields: searchFields()
                    }}
                    tableOption={{
                        key: this.state.updateKey,
                        pageSize: 100,
                        columns: getColumns(),
                        url: "/api/queryDataRecord",
                        scroll:{ y:window.screen.availHeight-350, x: 2000},
                        cardProps: {
                            title: "数据履历"
                        },
                    }}
                />
            </div>
        )
    }
}