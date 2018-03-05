/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React, { Component } from 'react';
import {Button,Icon,message} from 'antd'
import {request} from '../../../utils'
import {SearchTable,FileExport} from '../../../compoments';
import PopModal from './createPopModal';
import ApplyDeclarationPopModal from './applyDeclarationPopModal'

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
        span:8,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
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
        label:'所属期起止',
        type:'rangePicker',
        fieldName:'subordinatePeriod',
        span:8,
    },{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
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
    }
]
const getColumns =(context)=>[
    {
        title: '申报状态',
        dataIndex: 'status',
        render:text=>{
            //1:免抵退税;2:免税;3:减税;4:即征即退;5:财政返还;6:其他税收优惠; ,
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t='申报办理';
                    break;
                case 2:
                    t='申报审核';
                    break;
                case 3:
                    t='申报审批';
                    break;
                case 4:
                    t='申报完成';
                    break;
                case 5:
                    t='归档';
                    break;
                case -1:
                    t='流程终止';
                    break;

                default:
                //no default
            }
            return t
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
    },{
        title: '税（费）种',
        dataIndex: 'taxType',
        render:text=>{
            //1:增值税;2:企业所得税;
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t='增值税';
                    break;
                case 2:
                    t='企业所得税';
                    break;
                default:
                    t='增值税';
                    break;
            }
            return t
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    },{
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
export default class CreateADeclare extends Component{
    state={
        visible:false, // 控制Modal是否显示
        updateKey:Date.now(),

        filters:{},
        dataSource:[],
        selectedRowKeys:undefined,
        selectedRows:[],
        modalConfig:{
            type:''
        },
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }
    handelProcessStop=()=>{
        request.put('/tax/declaration/stop',{
            mainId: this.state.selectedRows[0].mainId,
            authMonth:this.state.selectedRows[0].month
        })
            .then(({data})=>{
                if (data.code === 200) {
                    message.success('流程终止成功!');
                    this.refreshTable();
                } else {
                    message.error(data.msg)
                }
            })
    }
    render(){
        const {updateKey,selectedRowKeys,selectedRows,filters,visible,dataSource,modalConfig} = this.state;
        return(
                <SearchTable
                    searchOption={{
                        fields:searchFields,
                        getFieldsValues:values=>{
                            this.setState({
                                filters:values
                            })
                        },
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
                            title:'列表信息'
                        },
                        url:'/tax/declaration/list',
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                selectedRowKeys:selectedRowKeys[0],
                                selectedRows,
                            })
                        },
                        rowSelection:{
                            type:'radio',
                        },
                        extra: <div>
                            <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                                <Icon type="file-add" />
                                创建申报
                            </Button>
                            <Button size='small' style={{marginRight:5}} disabled={!selectedRowKeys} >
                                <Icon type="api" />
                                流程
                            </Button>
                            <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('view')}  disabled={!selectedRowKeys} >
                                <Icon type="search" />
                                查看
                            </Button>
                            <ApplyDeclarationPopModal
                                title={selectedRows.length>0 && `申报处理【${selectedRows[0].mainName}】 申报期间 【${selectedRows[0].subordinatePeriodStart} 至 ${ selectedRows[0].subordinatePeriodEnd}】`}
                                disabled={!selectedRowKeys}
                                selectedRowKeys={selectedRowKeys}
                                selectedRows={selectedRows}
                                onSuccess={()=>{
                                    this.refreshTable()
                                }}
                                style={{marginRight:5}} />
                            <Button size='small' style={{marginRight:5}} onClick={this.handelProcessStop} disabled={!selectedRowKeys} >
                                <Icon type="exception" />
                                流程终止
                            </Button>
                            <FileExport
                                url='/account/income/taxContract/adjustment/download'
                                title="下载附件"
                                size="small"
                                setButtonStyle={{marginRight:5}}
                                disabled={!selectedRowKeys}
                            />
                            <FileExport
                                url='/tax/declaration/export'
                                title='导出'
                                setButtonStyle={{marginRight:5}}
                                disabled={!dataSource.length>0}
                                params={{
                                    ...filters
                                }}
                            />
                        </div>,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        }
                    }}
                >

                    <PopModal
                        visible={visible}
                        modalConfig={modalConfig}
                        selectedRowKeys={selectedRowKeys}
                        selectedRows={selectedRows}
                        refreshTable={this.refreshTable}
                        toggleModalVisible={this.toggleModalVisible}
                    />
                </SearchTable>


        )
    }
}