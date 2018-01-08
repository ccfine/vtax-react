import React from "react";
import {Table,Card} from "antd";
import PopModal from "./sourcePopModal/popModal";

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    marginRight:'10px'
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
                    context.setState({visible:true,sourceid:record.id,action:"modify"});}}>编辑</span>
                <span style={pointerStyle} onClick={()=>{
                        context.setState({visible:true});}}>删除</span>
            </div>);
        }
    },
        fixed:'left'
    },
    {
        title: '付款类型',
        dataIndex: 'priceClassTxt',
        render:renderContent(length)
    }, {
        title: '金额',
        dataIndex: 'amount'
    },{
        title: '票据类型',
        dataIndex: 'billType',
        render:renderContent(length)
    }
];

export default class StageTable extends React.Component{
    state = {
        updateKey:Date.now(),
        visible:false,
        sourceid:"",
        action:"add"
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
            <Card title="" extra={<a  onClick={()=>{
                this.setState({visible:true,action:"add",sourceid:""})}}>新增</a>} style={{ width: "100%" }}>
                <Table 
                columns={getColumns(this,this.props.dataSource?this.props.dataSource.length:0)} 
                dataSource={this.props.dataSource} 
                size="middle" pagination={false} 
                rowKey="id" 
                loading={this.props.loading} 
                />
                <PopModal 
                visible={this.state.visible} 
                hideModal={()=>this.hideModal()} 
                id={this.state.sourceid} 
                action={this.state.action}
                update = {this.props.updateSource}
                add = {this.props.addSource}
                />
            </Card>
        );
    }
}
