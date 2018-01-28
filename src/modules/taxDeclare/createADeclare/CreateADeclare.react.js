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
        span:6,
    },{
        label:'办理进度',
        type:'select',
        fieldName:'status',
        span:6,
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
        span:6,
    },{
        label:'税（费）种',
        type:'select',
        fieldName:'taxType',
        span:6,
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
        dataIndex: 'remark',
    },{
        title: '税（费）种',
        dataIndex: 'taxType',
        render:text=>{
            //1增值税、2企业所得税
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
    },{
        title: '所属流程',
        dataIndex: 'isProcess',
    },{
        title: '申报人',
        dataIndex: 'lastModifiedBy',
    },{
        title: '申报日期',
        dataIndex: 'month',
    }
];

export default class CreateADeclare extends Component{
    state={
        visible:false, // 控制Modal是否显示
        updateKey:Date.now(),

        searchFieldsValues:{},
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
    componentWillReceiveProps(nextProps){

    }
    render(){
        const {updateKey,selectedRowKeys,selectedRows,searchFieldsValues,visible,dataSource,modalConfig} = this.state;
        return(
            <div>
                <SearchTable
                    searchOption={{
                        fields:searchFields,
                        getFieldsValues:values=>{
                            this.setState({
                                searchFieldsValues:values
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
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                selectedRowKeys:selectedRowKeys[0],
                                selectedRows,
                            })
                        },
                        rowSelection:{
                            type:'radio',
                        },
                        url:'/tax/declaration/list',
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
                                url='/account/income/taxContract/adjustment/export'
                                title='导出'
                                setButtonStyle={{marginRight:5}}
                                disabled={!dataSource.length>0}
                                params={{
                                    ...searchFieldsValues
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
                </SearchTable>

                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </div>
        )
    }
}