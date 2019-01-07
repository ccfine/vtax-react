/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React, { Component } from 'react';
import {SearchTable} from 'compoments';
import {composeBotton} from 'utils'
import PopModal from './createPopModal';
import ApplyDeclarationPopModal from './applyDeclarationPopModal'
import {withRouter} from 'react-router-dom';
const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields =(context) => [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        formItemStyle,
        span:8,
    },{
        label:'纳税申报期',
        type:'monthPicker',
        fieldName:'partTerm',
        formItemStyle,
        span:8,
    }/*,{
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
                        userPermissions:['1071002'],
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
        render:(text,record)=>{
            //1:申报办理,2:申报审核,3:申报审批,4:申报完成,5:归档,-1:流程终止
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
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
        render: (text, record) => (
            <span
                title="查看详情"
                style={{
                    ...pointerStyle,
                    marginLeft: 5
                }}
                onClick={() => {
                    context.setState({
                        modalConfig: {
                            type: "view",
                            id: record.id
                        }
                    },() => {
                        context.toggleModalVisible(true);
                    });
                }}
            >
                {text}
            </span>
        ),
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
        title: '纳税申报期',
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
            if(text===2){
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
class CreateADeclare extends Component{
    state={
        visible:false, // 控制Modal是否显示
        applyVisible:false,
        record:undefined,
        updateKey:Date.now(),
        addPopModalKey:Date.now()+1,
        applyDeclarationModalKey:Date.now()+2,
        modalConfig:{
            type:''
        },
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    toggleModalVisible = visible => {
        this.setState({
            visible
        });
    };
    showModal = type => {
        this.toggleModalVisible(true);
        this.setState({
            modalConfig: {
                type: type
            }
        });
    };
    toggleApplyVisible = applyVisible => {
        this.setState({
            applyVisible
        });
    };

    render(){
        const {updateKey,addPopModalKey,applyDeclarationModalKey,visible,modalConfig,record,applyVisible} = this.state;
        return(
                <SearchTable
                    searchOption={{
                        fields:searchFields(this),
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:getColumns(this),
                        cardProps:{
                            title:'创建申报'
                        },
                        url:'/tax/declaration/list',
                        scroll:{
                            x:1300
                        },
                        extra: <div>
                            {/*<Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                                <Icon type="plus" />
                                创建申报
                            </Button>
                            <Button size='small' style={{marginRight:5}} disabled={!selectedRowKeys} >
                                <Icon type="api" />
                                流程
                            </Button>
                            <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('view')}  disabled={!selectedRowKeys} >
                                <Icon type="search" />
                                查看申报
                            </Button>
                             <FileExport
                                 url='account/income/taxContract/adjustment/download'
                                 title="下载附件"
                                 size="small"
                                 setButtonStyle={{marginRight:5}}
                                 disabled={!selectedRowKeys}
                             />
                             <FileExport
                                 url='tax/declaration/export'
                                 title='导出'
                                 setButtonStyle={{marginRight:5}}
                                 disabled={!dataSource.length>0}
                                 params={{
                                 ...filters
                                 }}
                             />*/}

                            {
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    text:'创建申报',
                                    userPermissions:['1071003'],
                                    onClick: ()=>{
                                        this.setState({
                                            modalConfig: {
                                                type: "add",
                                                id: undefined
                                            }
                                        },() => {
                                            this.toggleModalVisible(true);
                                        });
                                    }
                                /*},{
                                    type:'fileExport',
                                    title:'下载附件',
                                    url:'account/income/taxContract/adjustment/download',
                                    onSuccess:this.refreshTable
                                },{
                                    type:'fileExport',
                                    title:'导出',
                                    url:'tax/declaration/export',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                 */
                                }])
                            }
                        </div>,
                    }}
                >

                    <PopModal
                        key={addPopModalKey}
                        visible={visible}
                        modalConfig={modalConfig}
                        refreshTable={this.refreshTable}
                        toggleModalVisible={this.toggleModalVisible}
                    />

                    {
                        record && <ApplyDeclarationPopModal
                            key={applyDeclarationModalKey}
                            visible={applyVisible}
                            title={`申报处理【${record.mainName}】 申报期间 【${record.partTerm}】`}
                            record={{...record,decAction:'look'}}
                            toggleApplyVisible={this.toggleApplyVisible}
                            style={{marginRight:5}}
                            url={'/tax/declaration/find'}
                        />
                    }

                </SearchTable>
        )
    }
}

export default withRouter(CreateADeclare)