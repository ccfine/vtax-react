
import React from "react";
import {Modal} from "antd";
import SourceTable from '../sourceTable';
import {request} from '../../../../../../utils';
export default class SourceModal extends React.Component{
    state={
        sourceTable:null,
        loaded:false
    }
    updateSource(source){
        let sourceTable = this.state.sourceTable;
        let index = sourceTable.findIndex(item=>(item.id === source.id));
        sourceTable[index] = source;
        this.setState({sourceTable:this.state.sourceTable});
    }
    addSource(source){
        let sourceTable = this.state.sourceTable;
        sourceTable.push(source);
        this.setState({sourceTable:this.state.sourceTable});
    }
    componentWillReceiveProps(props){
        if(this.props.id !== props.id){
            request.get(`/land/priceSource/list/${props.id}`).then(({data}) => {
                if(data.code===200){
                    // 计算总共金额并放置在数据的最后一条
                    let allAmount = data.data.page.records.reduce((pre,cur)=>{
                        return pre+cur.amount;
                     })
                    data.data.page.records.push({amount:allAmount,id:"-1"});

                    this.setState({sourceTable:data.data.page.records,loaded:true});
                }});
        }
    }
    render(){
        return (<Modal
            title="土地价款来源"
            visible={this.props.visible}
            onOk={()=>{
                this.props.update || this.props.update(this.state.sourceTable);
                this.props.hideModal();
            }}
            onCancel={this.props.hideModal}
            style={{maxWidth:'90%',position:"absolute",top:"0",left:"0",bottom:"0",right:"0",margin:"auto",height:"50%"}}
            width={520}
            bodyStyle={{}}
          >
          <SourceTable
                    dataSource={this.state.sourceTable} 
                    loading={!this.state.loaded} 
                    updateSource={(source)=>{this.updateSource(source)}} 
                    addSource={(source)=>{this.addSource(source)}}
                >
                </SourceTable>
          </Modal>);
    }
}
