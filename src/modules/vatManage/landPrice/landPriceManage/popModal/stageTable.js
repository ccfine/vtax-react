import React from "react";
import {Table,Card} from "antd";
import StageModal from './stagePopModal';

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    marginRight:"5px"
}

const getColumns =(context,length)=>[
    {
        title:'操作',
        key:'actions',
        render:(text,record,index)=>{
            if(index === length-1){
                return (<span>合计：</span>)
            }else{
            return (<div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({visible:true,readOnly:false,stageid:record.id});}}>编辑</span>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({visible:true,readOnly:true,stageid:record.id});}}>查看</span>
            </div>);
            }
        },
        fixed:'left',
        width:"75px"
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
        render:(text,record,index)=>{
            if(text === 1 || text === "1"){
                return (<span>100%</span>);
            }else if(text === 2 || text === "2"){
                return (<span>按调整后可售面积（㎡）/调整后施工证面积（㎡）计算</span>);
            }
        }
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
        stageid:"",
        readOnly:false
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    render(){
        console.log(this.props.dataSource)
        return (
            <Card title="项目分期信息" style={{ width: "100%" }}>
                <Table columns={getColumns(this,this.props.dataSource?this.props.dataSource.length:0)}  size="small" dataSource={this.props.dataSource} pagination={false} scroll={{x:"250%"}} rowKey="id"/>
                <StageModal visible={this.state.visible} id={this.state.stageid} readOnly={this.state.readOnly} hideModal={()=>{this.hideModal()}} update={this.props.update}/>
            </Card>
        );
    }
}
