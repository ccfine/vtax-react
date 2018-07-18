/**
 * Created by liuliyuan on 2018/5/17.
 */
import React,{Component} from 'react'
import {SearchTable} from 'compoments'
import {getUrlParam} from 'utils'
import moment from 'moment';

const searchFields =(disabled)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'项目分期',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选项目分期'
                    }
                ]
            },
        },
    ]
}

const getColumns = context => [
    {
        title:'纳税主体名称',
        dataIndex:'mainName',
    },{
        title: "项目名称",
        dataIndex: "projectName"
    },{
        title: "项目代码",
        dataIndex: "projectNum"
    },{
        title: "项目分期名称",
        dataIndex: "stageName"
    },{
        title: "项目分期代码",
        dataIndex: "stageNum"
    },{
        title: "土地总可售面积（总数）",
        dataIndex: "builtArea"
    },{
        title: "分期总可售面积",
        dataIndex: "totalArea"
    },{
        title: "分期地上可售面积",
        dataIndex: "groundArea"
    },{
        title: "分期地下可售面积",
        dataIndex: "undergroundArea"
    }
];


class LandArea extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    cardProps: {
                        title: "分期可售土地面积",
                    },
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/interAvailableBuildingAreaInformation/inter/list',
                }}
            />
        )
    }
}
export default LandArea