
import React from "react";
import {Modal} from "antd";
import SourceTable from '../sourceTable';
import {request} from 'utils';
import findIndex from 'lodash/findIndex'
import {BigNumber} from 'bignumber.js'
export default class SourceModal extends React.Component{
    state={
        sourceTable:null,
        loaded:false
    }
    updateSource(source){
        let sourceTable = this.state.sourceTable;
        let index = findIndex(sourceTable,item=>(
            item.id === source.id
        ));
        sourceTable[index] = source;
        sourceTable.pop();
        sourceTable = this.countAmount(sourceTable);
        this.setState({sourceTable:this.state.sourceTable});
    }
    addSource(source){
        let sourceTable = this.state.sourceTable;
        // 最后一条为统计信息
        sourceTable.pop();
        sourceTable.push(source);
        sourceTable = this.countAmount(sourceTable);
        this.setState({sourceTable:this.state.sourceTable});
    }
    deleteSource(source){
        let sourceTable = this.state.sourceTable;
        // 最后一条为统计信息
        sourceTable.pop();
        let index = findIndex(sourceTable,item=>(item.id === source.id));
        if(sourceTable[index].action === "add"){
            sourceTable.splice(index,1);
        }else{
            sourceTable[index].action = "delete";
        }
        sourceTable = this.countAmount(sourceTable);
        this.setState({sourceTable:this.state.sourceTable});
    }
    countAmount(sourceTable){ // 计算合计
        let allAmount=new BigNumber('0');
        sourceTable.forEach(element => {
            if(element.action !== "delete"){
                allAmount=allAmount.plus(element.amount);
            }
        });
        sourceTable.push({amount:allAmount,id:"-1"});
        return sourceTable;
    }
    componentWillReceiveProps(props){
        if(this.props.updateKey !== props.updateKey){
            request.get(`/land/priceSource/list/${props.id}`).then(({data}) => {
                if(data.code===200){
                    // 计算总共金额并放置在数据的最后一条
                    let sourceTable = this.countAmount(data.data.items);
                    this.setState({sourceTable:sourceTable, loaded:true});
                }});
        }
    }
    render(){
        return (<Modal
            destroyOnClose={true}
            title="土地价款来源"
            visible={this.props.visible}
            onOk={()=>{
                this.props.update && this.props.update(this.state.sourceTable);
                this.props.hideModal();
            }}
            onCancel={()=>{
                this.props.update && this.props.update(this.state.sourceTable);
                this.props.hideModal();
            }}
            width={520}
            bodyStyle={{overflow:"auto",height:"400px"}}
            maskClosable={false}
          >
          <SourceTable
                    readOnly = {this.props.readOnly}
                    dataSource={this.state.sourceTable} 
                    loading={!this.state.loaded} 
                    updateSource={(source)=>{this.updateSource(source)}} 
                    addSource={(source)=>{this.addSource(source)}}
                    deleteSource = {(source)=>{this.deleteSource(source)}}
                >
                </SourceTable>
          </Modal>);
    }
}
