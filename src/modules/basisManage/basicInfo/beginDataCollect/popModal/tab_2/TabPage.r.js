/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import {fMoney} from 'utils'
const getColumns = context=>[
    {
        title: '项目名称',
        dataIndex: 'contractNum',
    },{
        title: '金额',
        dataIndex: 'landPrice',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

export default class TabPage extends Component{
    state={
        updateKey:Date.now()
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
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
                actionOption={null}
                searchOption={null}
                tableOption={{
                    columns:getColumns(this),
                    url:`/contract/land/list/${props.mainId}`,
                    key:this.state.updateKey,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    }
                }}
            />

        )
    }
}