/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable,FileExport,FileImportModal} from '../../../../compoments'
import {Card,Modal,Icon,message,Button} from 'antd'
import {fMoney,request} from '../../../../utils'
const fields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
const getColumns=(context)=>[
    {
        title: '项目名称',
        dataIndex: 'projectName',
    }, {
        title: '项目分期',
        dataIndex: 'stagesName',
    },{
        title: '楼栋名称',
        dataIndex: 'buildingName',
    },{
        title: '单元',
        dataIndex: 'element',
    },{
        title: '房号',
        dataIndex: 'roomNumber',
    },{
        title: '客户名称',
        dataIndex: 'customerName',
    },{
        title: '身份证号码/纳税识别号',
        dataIndex: 'taxIdentificationCode',
    },{
        title: '合同价款（含税）',
        dataIndex: 'taxContractPrice',
        render:text=>fMoney(text),
    },{
        title: '建筑面积（实测）',
        dataIndex: 'actualBuildingArea',
    },{
        title: '收入确认金额',
        dataIndex: 'price',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积',
        dataIndex: 'salesBuildingArea',
    }
];

export default class TabPage extends Component{
    state={
        visible:false,
        updateKey:Date.now(),
        selectedRowKeys:[],
        dataSource:[],
    }
    refreshTable(){
        this.setState({updateKey:Date.now()})
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/carryover/incomeDetails/delete/${this.state.selectedRowKeys.toString()}`)
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    this.toggleSearchTableLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    componentWillReceiveProps(props){

        if(props.selectedRows.length >0 ){
            if(props.updateKey !== this.props.updateKey || props.id!==this.props.id){
                this.setState({updateKey:Date.now()});
            }
        }

    }
    render(){
        const {selectedRowKeys,updateKey,dataSource} = this.state;
        const props = this.props;
        return(
            <Card title="结转收入明细" extra={<div>
                <FileImportModal
                    url='/carryover/incomeDetails/upload'
                    title="导入"
                    fields={fields}
                    onSuccess={()=>{
                        this.refreshTable()
                    }}
                    style={{marginRight:5}} />
                <FileExport
                    url='/carryover/incomeDetails/download'
                    title="下载导入模板"
                    setButtonStyle={{marginTop:10,marginRight:5}}
                    size='small'
                />
                <FileExport
                    url='/carryover/incomeDetails/export'
                    title='导出'
                    setButtonStyle={{marginRight:5}}
                    disabled={!dataSource.length>0}
                    params={{
                        stagesId: props.selectedRows.length >0 && props.selectedRows[0].stagesId,
                        authMonth: props.filters.authMonth,
                    }}
                />
                <Button size="small" type='danger' onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
            </div>}
                  style={{marginTop:10}}
            >
                <AsyncTable url="/carryover/incomeDetails/list"
                            updateKey={updateKey}
                            filters={{
                                stagesId: props.selectedRows.length >0 && props.selectedRows[0].stagesId,
                                authMonth: props.filters.authMonth,
                            }}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:false,
                                size:'small',
                                columns:getColumns(this),
                                onRowSelect:(selectedRowKeys)=>{
                                    this.setState({
                                        selectedRowKeys:selectedRowKeys
                                    })
                                },
                                onDataChange:(dataSource)=>{
                                    this.setState({
                                        dataSource
                                    })
                                }
                            }} />

            </Card>
        )
    }
}