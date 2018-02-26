import React from "react";
import {Table,Card,Popconfirm,Icon,Button} from "antd";
import PopModal from "./sourcePopModal/popModal";
import {fMoney} from '../../../../../utils';

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    marginRight:'5px'
}

const renderContent =function(length){ return ((value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === length) {
      obj.props.colSpan = 0;
    }
    return obj;
  });
}

const getColumns =(context, length)=>[
    {
        title:'操作',
        key:'actions',
        render:(text,record,index)=>{
            if (index === length-1) {
                return <span>合计：</span>;
              }
            else {return (
            <div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({visible:true,source:record,readOnly:false,action:"modify"});}}>编辑</span>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({visible:true,source:record,readOnly:true,action:"modify"});}}>查看</span>
                 <Popconfirm placement="bottom" title={`是否确认删除？`} onConfirm={()=>{
                        context.props.deleteSource(record)}} okText="确认" cancelText="取消">
                    <span style={pointerStyle}>删除</span>
                    </Popconfirm>
            </div>);
        }
    },
        fixed:'left',
        width:"100px"
    },
    {
        title: '付款类型',
        dataIndex: 'priceClassTxt',
        render:renderContent(length)
    }, {
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '票据类型',
        dataIndex: 'billType',
        render:renderContent(length)
    }
];

export default class StageTable extends React.Component{
    state = {
        visible:false,
        source:{},
        action:"add",
        readOnly:false
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.setState({visible:false});
    }
    render(){
        const dataSource = this.props.dataSource && this.props.dataSource.filter((element)=>element.action!=="delete");
        return (
            <Card title="土地价款来源" extra={this.props.readOnly?<span></span>:<Button size='small' onClick={()=>{
                this.setState({visible:true,action:"add",source:{}})}}><Icon type="plus" />新增</Button>} style={{ width: "100%" }}>
                <Table 
                columns={getColumns(this,dataSource?dataSource.length:0)} 
                dataSource={dataSource} 
                size="small" pagination={false} 
                rowKey="id" 
                loading={this.props.loading} 
                />
                <PopModal 
                visible={this.state.visible} 
                hideModal={()=>this.hideModal()} 
                source={this.state.source} 
                action={this.state.action}
                update = {this.props.updateSource}
                add = {this.props.addSource}
                readOnly = {this.state.readOnly}
                />
            </Card>
        );
    }
}
