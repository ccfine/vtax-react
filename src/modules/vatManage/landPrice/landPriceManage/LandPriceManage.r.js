/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react';
import {SearchTable} from '../../../../compoments';
import PopModal from "./popModal";
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    }
]
const getColumns =(context)=>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({opid:record.id,visible:true});}}>编辑</span>
            </div>
        ),
        fixed:'left'

    },
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目编码',
        dataIndex: 'itemNum',
    },{
        title: '项目名称',
        dataIndex: 'itemName',
    },{
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    },{
        title: '合同建筑面积(m²)',
        dataIndex: 'coveredArea',
    },{
        title: '调整后建筑面积(m²)',
        dataIndex: 'buildArea',
    },{
        title: '可抵扣地价款',
        dataIndex: 'deductibleLandPrice',
    },{
        title: '实际已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
    },{
        title: '已售建筑面积(m²)',
        dataIndex: 'saleArea',
    }
];

export default class LandPriceManage extends Component{
    state={
        visible:false, // 控制Modal是否显示
        opid:"" // 当前操作的记录
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    render(){
        return(
            <div>
                <SearchTable
                    searchOption={{
                        fields:searchFields
                    }}
                    tableOption={{
                        columns:getColumns(this),
                        url:'/landPriceInfo/list'
                    }}
                >
                </SearchTable>
                <PopModal visible={this.state.visible} hideModal={()=>{this.hideModal()}} id={this.state.opid}/>
            </div>
        )
    }
}