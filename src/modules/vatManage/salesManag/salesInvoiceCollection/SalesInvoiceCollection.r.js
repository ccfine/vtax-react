/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,Modal} from 'antd'
import {SearchTable,FileExport} from '../../../../compoments'
import {fMoney} from '../../../../utils'
import FileImportModal from './fileImportModal'
import PopModal from './popModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    },
    {
        label:'发票号码',
        type:'input',
        fieldName:'invoiceNum',
        fieldDecoratorOptions:{},
        componentProps:{}
    },
    {
        label:'税收分类编码',
        type:'input',
        fieldName:'taxClassificationCoding',
        fieldDecoratorOptions:{}
    },
    {
        label:'开票日期',
        type:'rangePicker',
        fieldName:'billingDate',
        fieldDecoratorOptions:{}
    },
    {
        label:'税率',
        type:'input',
        fieldName:'taxRate',
        fieldDecoratorOptions:{}
    },
    {
        label:'商品名称',
        type:'input',
        fieldName:'commodityName',
    },
    {
        label:'发票类型',
        fieldName:'invoiceType',
        type:'select',
        options:[
            {
                text:'专票',
                value:'s'
            },
            {
                text:'普票',
                value:'c'
            }
        ]
    },
]
const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <div>
                <span style={pointerStyle} onClick={()=>{
                    const type = parseInt(record.sourceType,0);
                    if(type!==1){
                        Modal.warning({
                            title: '友情提示',
                            content: '只能修改手工新增的数据',
                        });
                        return false;
                    }

                    context.setState({
                        modalConfig:{
                            type:'edit',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }}>编辑</span>
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
        width:'70px'

    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '发票类型',
        dataIndex: 'invoiceType'
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum'
    },{
        title: '发票明细号',
        dataIndex: 'invoiceDetailNum',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'70px'
    },{
        title: '购货单位',
        dataIndex: 'purchaseName',
    },{
        title: '购方税号',
        dataIndex: 'purchaseTaxNum',
    },{
        title: '商品名称',
        dataIndex: 'commodityName',
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '税收分类编码',
        dataIndex: 'taxClassificationCoding',
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'60px',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return text
        }
    }
];

const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class Test extends Component{
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
                        this.setState({
                            searchFieldsValues:values
                        })
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:20,
                    columns:getColumns(this),
                    url:'/output/invoice/collection/list',
                    extra:<div>
                        <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                            <Icon type="file-add" />
                            新增
                        </Button>
                        <FileImportModal style={{marginRight:5}} />
                        <FileExport
                            url={`output/invoice/collection/export?${parseJsonToParams(searchFieldsValues)}`}
                            title="导出"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <FileExport
                            url='output/invoice/collection/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                    </div>,
                    scroll:{
                        x:'180%'
                    }
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}