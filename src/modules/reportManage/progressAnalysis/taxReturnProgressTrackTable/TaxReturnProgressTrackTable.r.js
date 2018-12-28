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
const status = [
    {text:'未完成',value:'0'},
    {text:'已完成',value:'1'},
]
const searchFields=(getFieldValue)=>{
    return [
        {
            label: "区域",
            fieldName: "parent",
            type: "asyncSelect",
            span: 6,
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
            span: 6,
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
            span: 6,
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
            span:6,
            componentProps:{
                format:'YYYY-MM',
            },
        },
        {
            label: "销项管理",
            fieldName: "outputStatus",
            span: 6,
            type: "select",
            formItemStyle,
            options: status
        },
        {
            label: "进项管理",
            fieldName: "incomeStatus",
            span: 6,
            type: "select",
            formItemStyle,
            options: status
        },
        {
            label: "其他管理",
            fieldName: "otherStatus",
            span: 6,
            type: "select",
            formItemStyle,
            options: status
        },
        {
            label: "纳税申报表",
            fieldName: "submitStatus",
            span: 6,
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
            span: 6,
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
        title: "纳税主体编码",
        dataIndex: "taxNum",
        width: "100px",
    },
    {
      title: '纳税主体',
      dataIndex: 'mainName',
    //   width: "200px"
    },
    {
        title: "纳税人识别号",
        dataIndex: "code",
        width: "100px",
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
        title: "销项管理",
        dataIndex: "outputStatus",
        width: "200px",
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },
    {
        title: "进项管理",
        dataIndex: "incomeStatus",
        width: "200px",
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },
    {
        title: "其他管理",
        dataIndex: "otherStatus",
        width: "200px",
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },
    {
      title: "纳税申报表",
      dataIndex: "submitStatus",
      width: "200px"
    },
    {
      title: "申报归档",
      dataIndex: "fileStatus",
      width: "200px"
    },
    {
        title: "应纳税额合计",
        dataIndex: "totalAddedAmountCommonly",
        width: "150px"
    },
    {
        title: "预征税款合计",
        dataIndex: "totalPreTaxAmount",
        width: "150px"
    },
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
            <SearchTable
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
                    scroll:{ x: 2350, y:window.screen.availHeight-450},
                }}
            />
        )
    }
}
