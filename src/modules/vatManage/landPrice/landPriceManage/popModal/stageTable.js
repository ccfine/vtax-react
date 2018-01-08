import React from "react";
import {Table,Card} from "antd";
import StageModal from './stagePopModal';

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const getColumns =(context)=>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({visible:true,stageid:record.id});}}>编辑</span>
            </div>
        ),
        fixed:'left'
    },
    {
        title: '项目分期编码',
        dataIndex: 'itemNum',
    }, {
        title: '项目分期名称',
        dataIndex: 'itemName',
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
    },{
        title: '施工证面积（㎡）',
        dataIndex: 'upArea',
    },{
        title: '调整后施工证面积（㎡）',
        dataIndex: 'certificateArea',
    },{
        title: '可售面积（㎡）',
        dataIndex: 'upAreaSale',
    },{
        title: '调整后可售面积（㎡）',
        dataIndex: 'pageAblesalearea',
    },{
        title: '可分摊土地价款比例',
        dataIndex: 'apportionLandPriceProportion',
    },{
        title: '分摊后土地价款',
        dataIndex: 'apportionLandPrice',
    },{
        title: '可抵扣的土地价款比例',
        dataIndex: 'deductibleLandPriceProportion',
    },{
        title: '可抵扣的土地价款比例设置',
        dataIndex: 'setUp',
    },{
        title: '可抵扣土地价款',
        dataIndex: 'deductibleLandPrice',
    },{
        title: '已售建筑面积（㎡）',
        dataIndex: 'saleArea',
    },{
        title: '已实际抵扣土地价款',
        dataIndex: 'actualDeductibleLandPrice',
    },{
        title: '单方土地成本',
        dataIndex: 'singleLandCost',
    }
];

export default class StageTable extends React.Component{
    state = {
        updateKey:Date.now(),
        visible:false,
        stageid:""
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    componentWillReceiveProps(props){
        
    }
    render(){
        return (
            <Card title="项目分期信息" style={{ width: "100%" }}>
                <Table columns={getColumns(this)}  size="middle" dataSource={this.props.dataSource} pagination={false} scroll={{x:"300%"}} rowKey="id"/>
                <StageModal visible={this.state.visible} id={this.state.stageid} hideModal={()=>{this.hideModal()}}/>
            </Card>
        );
    }
}
