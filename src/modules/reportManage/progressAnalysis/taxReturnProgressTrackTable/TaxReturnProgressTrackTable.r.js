/**
 * Created by chenfeng on 2018/10/16.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {composeBotton} from "utils"


const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

const searchFields=(getFieldValue)=>{
    return [
        {
            label: "区域",
            fieldName: "parent",
            type: "asyncSelect",
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName:'name',
                fieldValueName:'id',
                url: `/sysOrganization/queryLoginAreas`,
                selectOptions:{
                    labelInValue:true,
                    showSearch:true,
                    optionFilterProp:'children',
                },
            },
            fieldDecoratorOptions: {
                initialValue: {key: '',label:'全部'} ,
            }
        },
        {
            label: "组织",
            fieldName: "org",
            type: "asyncSelect",
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: "name",
                fieldValueName: "id",
                fetchAble:(getFieldValue('parent') && getFieldValue('parent').key) || false,
                url:`/sysOrganization/queryLoginOrgs/${(getFieldValue('parent') && getFieldValue('parent').key)}`,
                selectOptions:{
                    labelInValue:true,
                    showSearch:true,
                    optionFilterProp:'children',
                },
            },
            fieldDecoratorOptions: {
                initialValue: {key: '',label:'全部'},
            }
        },
        {
            label: "纳税主体",
            fieldName: "main",
            type: "asyncSelect",
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: "name",
                fieldValueName: "id",
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('org') && getFieldValue('org').key) || false,
                url:`/taxsubject/listByOrgId/${(getFieldValue('org') && getFieldValue('org').key)}`,
                selectOptions:{
                    labelInValue:true,
                    showSearch:true,
                    optionFilterProp:'children',
                },
            },
            fieldDecoratorOptions: {
                initialValue: {key: '',label:'全部'} ,
            }
        },
        {
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
            },
        },
        {
            label: "纳税申报表提交",
            fieldName: "submitStatus",
            span: 8,
            type: "select",
            formItemStyle,
            options: [
                {
                    text: "未完成",
                    value: -1
                },
                {
                    text: "申报完成",
                    value: 1
                }
            ]
        },
        {
            label: "申报归档",
            fieldName: "fileStatus",
            span: 8,
            type: "select",
            formItemStyle,
            options: [
                {
                    text: "未归档",
                    value: -1
                },
                {
                    text: "已归档",
                    value: 1
                }
            ]
        }
    ]
}
const columns = [
    {
      title: "区域",
      dataIndex: "region",
      width: "200px"
    },
    {
      title: '纳税主体',
      dataIndex: 'mainName',
      width: "200px"
    },
    {
      title: "申报期间",
      dataIndex: "month",
      width: "200px"
    },
    {
      title: "操作用户名",
      dataIndex: "declareBy",
      width: "200px"
    },
    {
      title: "纳税申报表提交状态",
      dataIndex: "submitStatus",
      width: "200px"
    },
    {
      title: "申报归档",
      dataIndex: "fileStatus",
      width: "200px"
    }
]

export default class TaxReturnProgressTrackTable extends Component{
    state={
        updateKey:Date.now(),
        totalSource:undefined,
        filters:{},
        statusParam:{},
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    render(){
        const {updateKey, filters,statusParam} = this.state;
        return(
            <div className="oneLine">
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns,
                    cardProps:{
                        title:'纳税申报进度跟踪表'
                    },
                    url:'/taxDeclarationTrack/report/list',
                    onSuccess: (params) => {
                        this.setState({
                            filters: params,
                        });
                    },
                    extra:<div>
                        {
                            JSON.stringify(filters) !=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'taxDeclarationTrack/report/export',
                                params:filters,
                                title:'导出',
                                userPermissions:["2121007"],
                            }],statusParam)
                        }
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{ x: 1400, y:window.screen.availHeight-360,},
                }}
            />
            </div>
        )
    }
}
