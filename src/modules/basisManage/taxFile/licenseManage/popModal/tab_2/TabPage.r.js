/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from './popModal'
import {composeBotton} from 'utils';
const getColumns = context=>[
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:[],
            onSuccess:()=>context.setState({visible:true,action:'modify',oprecord:record})
        }]),
        fixed:'left',
        width:'45px',
        dataIndex:'action',
        className:'text-center',
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
            <SearchTable
                searchOption={null}
                tableOption={{
                    columns:getColumns(this),
                    key:this.state.updateKey,
                    url:`/project/stage/list/${props.projectId}`,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    }
                }}
            >
                <PopModal
                    record={this.state.oprecord}
                    action={this.state.action}
                    visible={this.state.visible}
                    hideModal={()=>{this.hideModal()}}
                    update={()=>{this.update()}}
                />
            </SearchTable>
        )
    }
}