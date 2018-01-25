/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../compoments'
import {fMoney} from '../../../../utils'
import PopModal from './popModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const searchFields = (getFieldValue,setFieldsValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            fieldDecoratorOptions:{

            },
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'楼栋名称',
            fieldName:'buildingName',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'buildingName',
                fieldValueName:'buildingName',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('stagesId') || false,
                url:`/output/room/files/queryListByStagesId?stagesId=${getFieldValue('stagesId') || ''}`,
            }
        },
        {
            label:'单元',
            fieldName:'element',
            type:'element',
            span:6
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            span:6
        },
        {
            label:'房间编码',
            fieldName:'roomCode',
            type:'input',
            span:6
        },
        {
            label:'客户名称',
            fieldName:'customerName',
            type:'input',
            span:6
        },
        {
            label:'纳税识别号',
            fieldName:'taxIdentificationCode',
            type:'input',
            span:6
        }
    ]
}
const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({
                        modalConfig:{
                            type:'edit',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }}>修改</span>
                <span style={{
                    ...pointerStyle,
                    marginLeft:5
                }} onClick={()=>{
                    context.setState({
                        modalConfig:{
                            type:'view',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }}>
                    查看
                </span>
            </div>
        ),
        fixed:'left',
        width:'70px',
        className:'text-center'
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName'
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '楼栋名称',
        dataIndex: 'buildingName'
    },{
        title: '单元',
        dataIndex: 'element',
    },{
        title: '房号',
        dataIndex: 'roomNumber',
    },{
        title: '客户名称',
        dataIndex: 'customerName',
    },{
        title: '身份证/纳税人识别号',
        dataIndex: 'taxIdentificationCode',
    },{
        title: '房间编码',
        dataIndex: 'roomCode',
    },{
        title: '营业税收款金额',
        dataIndex: 'businessTaxCollectionAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '营业税结转收入金额',
        dataIndex: 'turnoverOfBusinessTax',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '营业税开票金额',
        dataIndex: 'businessTaxInvoiceAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '操作员',
        dataIndex: 'realname',
    },{
        title: '操作时间',
        dataIndex: 'lastModifiedDate',
    }
];

const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class CampBeforeTheIncreaseInSales extends Component{
    state={
        visible:false,
        modalConfig:{
            type:''
        },
        tableKey:Date.now(),
        searchFieldsValues:{

        }
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type
            }
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    render(){
        const {visible,modalConfig,tableKey,searchFieldsValues} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    getFieldsValues:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                searchFieldsValues:{}
                            })
                        }else{
                            this.setState(prevState=>({
                                searchFieldsValues:{
                                    ...prevState.searchFieldsValues,
                                    ...values
                                }
                            }))
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/output/sellinghouse/list',
                    extra:<div>
                        <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                            <Icon type="file-add" />
                            新增
                        </Button>
                        <FileImportModal
                            url="output/sellinghouse/upload"
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
                            style={{marginRight:5}} />
                        <FileExport
                            url={`output/sellinghouse/export?${parseJsonToParams(searchFieldsValues)}`}
                            title="导出"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                    </div>,
                    scroll:{
                        x:'140%'
                    }
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}