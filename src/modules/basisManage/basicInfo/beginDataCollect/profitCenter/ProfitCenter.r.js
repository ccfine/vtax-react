/**
 * Created by liuliyuan on 2018/11/6.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from '../popModal'
import {composeBotton} from 'utils';
const pointerStyle = {
    cursor: 'pointer',
    color : '#1890ff',
    margin: '0px 5px'
}

const searchFields =(getFieldValue)=> [
    {
        label         : '纳税主体',
        fieldName     : 'main',
        type          : 'taxMain',
        span          : 8,
        componentProps: {
            labelInValue: true,
            url:'/taxsubject/list/for/dataCollectionPc',
        },
        fieldDecoratorOptions:{
            //initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required: true,
                    message : '请选择纳税主体'
                }
            ]
        }
    }, {
        label         : '利润中心',
        fieldName     : 'profitCenterId',
        type          : 'asyncSelect',
        span          : 8,
        componentProps: {
            fieldTextName     : 'profitName',
            fieldValueName    : 'id',
            doNotFetchDidMount: true,
            fetchAble         : getFieldValue("main") && getFieldValue("main").key,
            url               : `/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
        }
    }
]
const getColumns = context =>[
    {
        title : '操作',
        key   : 'actions',
        render: (text,record)=>{
            let submit = [
                    {
                        type           : 'action',
                        title          : '编辑',
                        icon           : 'edit',
                        userPermissions: ['1121004'],
                        onSuccess      : ()=>context.showModal('modify',record)
                    },
                ]
            return parseInt(record.status, 0) !== 2 && composeBotton(submit)
        },
        fixed    : 'left',
        width    : '100px',
        className: 'text-center'
    },{
        title    : '利润中心',
        dataIndex: 'profitCenterName',
        render   : (text,record)=>(<span title='查看详情' style={pointerStyle} onClick={()=>context.showModal('look',record)}>{text}</span>),
    },{
        title    : '是否已采集',
        dataIndex: 'finish',
        render   : text=>{
            //是否处理1:已采集 0:未采集 ,
            let t = '';
            switch (parseInt(text,0)){
                case 0: 
                    t = <span style={{ color: '#44b973' }}>未采集</span>;
                    break;
                case 1: 
                    t = <span style={{ color: '#1795f6' }}>已采集</span>;
                    break;
                default: 
                //no default
            }
            return t
        }
    },{
        title    : '状态',
        dataIndex: 'status',
        render   : text=>{
            //是否处理2:已提交 1:未提交 ,
            let t = '';
            switch (parseInt(text,0)){
                case 1: 
                    t = <span style={{ color: '#44b973' }}>未提交</span>;
                    break;
                case 2: 
                    t = <span style={{ color: '#1795f6' }}>已提交</span>;
                    break;
                default: 
                //no default
            }
            return t
        }
    }
];

export default class ProfitCenter extends Component{
    state={
        visible    : false,
        modalConfig: {
            type: '',
        },
    }
    refreshTable = ()=>{
        this.setState({
            tableKey: Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=(type,record)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                record
            }
        })
    }
    render(){
        const {visible,modalConfig,tableKey} = this.state;
        return(
            <SearchTable
                style={{
                    marginTop: -16
                }}
                doNotFetchDidMount = {true}
                searchOption       = {{
                    fields: searchFields
                }}
                tableOption={{
                    key      : tableKey,
                    pageSize : 100,
                    columns  : getColumns(this),
                    url      : '/dataCollection/pc/list',
                    cardProps: {
                        title: <span>利润中心期初数据采集  <label style={{color: 'red',marginLeft:'20px'}}>(纳税主体期初数据采集提交时关联利润中心期初数据采集一起提交！)</label></span>,
                    },
                }}
            >
                <PopModal tab="2" visible={visible} refreshTable={this.refreshTable} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}