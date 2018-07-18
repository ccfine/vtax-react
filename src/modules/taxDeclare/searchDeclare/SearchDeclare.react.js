/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {SearchTable} from 'compoments';
import ApplyDeclarationPopModal from '../createADeclare/applyDeclarationPopModal'
import {composeBotton} from 'utils'
import {withRouter} from 'react-router-dom';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        formItemStyle,
        span:8,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
        formItemStyle,
        span:8,
        options:[  //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            {
                text:'申报办理',
                value:'1'
            },{
                text:'申报审核',
                value:'2'
            },{
                text:'申报审批',
                value:'3'
            },{
                text:'申报完成',
                value:'4'
            },{
                text:'归档',
                value:'5'
            },{
                text:'流程终止',
                value:'-1'
            }
        ],
    },{
        label:'所属期',
        type:'monthPicker',
        fieldName:'partTerm',
        formItemStyle,
        span:8,
    },/*{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
        formItemStyle,
        span:8,
        options:[
            {
                text:'增值税',
                value:'1'
            },{
                text:'企业所得税',
                value:'2'
            }
        ],
    }*/
]
const getColumns =(context)=>[
    {
        title: "操作",
        className:'text-center',
        render:(text,record)=>{ //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
            return composeBotton([{
                type:'action',
                icon:'search',
                title:'查看申报',
                onSuccess:()=>{
                    
                    context.props.history.push(`${context.props.match.url}/lookDeclare/${record.id}`)
                            
                    /*context.setState({
                        record: record
                    },() => {
                        context.toggleApplyVisible(true);
                    });*/
                }
            }])
        },
        fixed: "left",
        width: "50px",
        dataIndex: "action"
    },{
        title: '申报状态',
        dataIndex: 'status',
        className:'text-center',
        render:text=>{
            //1:免抵退税;2:免税;3:减税;4:即征即退;5:财政返还;6:其他税收优惠;
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{ color: '#44b973' }}>申报办理</span>;
                    break;
                case 2:
                    t=<span style={{ color: '#2783d8' }}>申报审核</span>;
                    break;
                case 3:
                    t=<span style={{ color: '#373ac6' }}>申报审批</span>;
                    break;
                case 4:
                    t=<span style={{ color: '#1795f6' }}>申报完成</span>;
                    break;
                case 5:
                    t=<span style={{ color: '#7a7e91' }}>归档</span>;
                    break;
                case -1:
                    t=<span style={{ color: '#ed2550' }}>流程终止</span>;
                    break;
                default:
                //no default
            }
            return t;
        }
    }, {
        title: '上一步完成时间',
        dataIndex: 'lastModifiedDate',
    },{
        title: '大区',
        dataIndex: 'region',
    },{
        title: '组织架构',
        dataIndex: 'orgName',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '所属期',
        dataIndex: 'partTerm',
    }/*,{
        title: '税（费）种',
        dataIndex: 'taxType',
        render:text=>{
            //1:增值税;2:企业所得税;
            text = parseInt(text,0);
            if(text===1){
                return '增值税'
            }
            if(text ===2){
                return '企业所得税'
            }
            return text;
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    }*/,{
        title: '所属流程',
        dataIndex: 'isProcess',
    },{
        title: '申报人',
        dataIndex: 'declareBy',
    },{
        title: '申报日期',
        dataIndex: 'declarationDate',
    }
];

class SearchDeclare extends Component{
    state={
        updateKey:Date.now(),
        applyDeclarationModalKey:Date.now(),
        applyVisible:false,
        record:undefined,
    }
    toggleApplyVisible = applyVisible => {
        this.setState({
            applyVisible
        });
    };
    render(){
        const {updateKey,record,applyVisible,applyDeclarationModalKey} = this.state
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:10,
                    columns:getColumns(this),
                    cardProps:{
                        title:'查询申报'
                    },
                    url:'/tax/decConduct/query/list',
                    scroll:{
                        x:1300
                    }
                }}
            >
                {
                    record && <ApplyDeclarationPopModal
                        key={applyDeclarationModalKey}
                        visible={applyVisible}
                        title={`申报处理【${record.mainName}】 申报期间 【${record.partTerm}】`}
                        record={{...record,decAction:'look'}}
                        toggleApplyVisible={this.toggleApplyVisible}
                        style={{marginRight:5}}
                        url='tax/decConduct/query/find'
                    />
                }
            </SearchTable>
        )
    }
}

export default withRouter(SearchDeclare)