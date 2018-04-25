import React from "react";
import {Table,Card} from "antd";
import StageModal from './stagePopModal';
import {fMoney,toPercent} from 'utils';

const getColumns =(context,length)=>[
    {
        title:'操作',
        key:'actions',
        render:(text,record,index)=>{
            if(index === length-1){
                return (<span>合计：</span>)
            }else if(context.props.readOnly){
                return (<div>
                    <a style={{margin:'0 5px'}} onClick={()=>{
                        context.setState({visible:true,readOnly:true,type:'look',stage:record});}}>查看</a>
                </div>);
            }else{
            return (<div>
                <a style={{margin:'0 5px'}} onClick={()=>{
                    context.setState({visible:true,readOnly:true,type:'look',stage:record});}}>查看</a>
                <a style={{marginRight:5}} onClick={()=>{
                    context.setState({visible:true,readOnly:false,type:'edit',stage:record});}}>编辑</a>
            </div>);
            }
        },
        fixed:'left',
        width:context.props.readOnly?"50px":"75px"
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
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            switch(text){
                case 1:
                case '1':
                    return '一般计税方法';
                case 2:
                case '2':
                    return '简易计税方法';
                default:
                    return '';
            }
        }
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
        dataIndex: 'ableSaleArea',
    },{
        title: '可分摊土地价款比例',
        dataIndex: 'apportionLandPriceProportion',
        render:text=>toPercent(text),
    },{
        title: '分摊后土地价款',
        dataIndex: 'apportionLandPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '可抵扣的土地价款比例',
        dataIndex: 'deductibleLandPriceProportion',
        render:text=>toPercent(text),
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
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '已售建筑面积（㎡）',
        dataIndex: 'saleArea',
    },{
        title: '已实际抵扣土地价款',
        dataIndex: 'actualDeductibleLandPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '单方土地成本',
        dataIndex: 'singleLandCost',
        render:text=>{
            return (text==='' || text ===undefined)?'':fMoney(text)
        },
        className:'table-money'
    }
];

export default class StageTable extends React.Component{
    state = {
        visible:false,
        readOnly:false,
        stage:{},
        type:undefined
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    render(){
        return (
            <Card title="项目分期信息" style={{ width: "100%" }}>
                <Table columns={getColumns(this,this.props.dataSource?this.props.dataSource.length:0)}  size="small" dataSource={this.props.dataSource} pagination={false} scroll={{x:"250%"}} rowKey="id"/>
                <StageModal
                type={this.state.type}
                visible={this.state.visible}
                readOnly={this.state.readOnly}
                hideModal={()=>{this.hideModal()}}
                update={(stage)=>{this.props.update(stage)}}
                stage = {this.state.stage}
                />
            </Card>
        );
    }
}
