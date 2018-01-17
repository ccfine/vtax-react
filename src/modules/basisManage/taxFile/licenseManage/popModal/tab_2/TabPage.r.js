/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from '../../../../../../compoments'
import PopModal from './popModal'
const getColumns = context=>[
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                <a style={{marginRight:"5px"}} onClick={()=>{
                    context.setState({visible:true,action:'modify',oprecord:record});
                }}>修改</a>
                </span>
            );
        },
        fixed:'left',
        width:'50px',
        dataIndex:'action'
    },
    {
        title: '项目分期代码',
        dataIndex: 'itemNum',
    }, {
        title: '项目分期名称',
        dataIndex: 'itemName',
    },{
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    }
];

export default class TabPage extends Component{
    state={
        action:undefined,
        opid:undefined,
        visible:false,
        updateKey:Date.now()
    }
    hideModal(){
        this.setState({visible:false});
    }
    update(){
        this.setState({updateKey:Date.now()})
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const props = this.props;
        return(
            <div>
            <SearchTable
                tableOption={{
                    columns:getColumns(this),
                    scroll:{x:'100%'},
                    key:this.state.updateKey,
                    url:`/project/stage/list/${props.projectId}`,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"},
                        bodyStyle:{width:'600px'}
                    }
                }}
            >
            </SearchTable>
            
            <PopModal 
                record={this.state.oprecord}
                action={this.state.action} 
                visible={this.state.visible} 
                hideModal={()=>{this.hideModal()}}
                update={()=>{this.update()}}
                ></PopModal>
            </div>
        )
    }
}