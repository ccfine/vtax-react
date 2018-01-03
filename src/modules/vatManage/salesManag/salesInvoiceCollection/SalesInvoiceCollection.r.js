/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,Modal} from 'antd'
import {SearchTable} from '../../../../compoments'
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
            </div>
        ),
        fixed:'left'

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
    },{
        title: '税额',
        dataIndex: 'taxAmount',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
    },{
        title: '税收分类编码',
        dataIndex: 'taxClassificationCoding',
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return ''
        }
    }
];

export default class Test extends Component{
    state={
        visible:false,
        modalConfig:{
            type:''
        },
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
                type
            }
        })
    }
    render(){
        const {visible,modalConfig} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    columns:getColumns(this),
                    url:'/output/invoice/collection/list',
                    extra:<Button size='small' onClick={()=>this.showModal('add')} >
                        <Icon type="file-add" />
                        新增
                    </Button>,
                    scroll:{
                        x:'180%'
                    }
                }}
            >
                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}