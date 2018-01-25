/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable,FileExport,PopUploadModal} from '../../../../compoments'
import {Card,Modal,Icon,message,Button} from 'antd'
import {fMoney,request} from '../../../../utils'
const getColumns=(context)=>[
    {
        title: '项目名称',
        dataIndex: 'taxMethod',
    }, {
        title: '项目分期',
        dataIndex: 'name',
    },{
        title: '楼栋名称',
        dataIndex: 'invoiceTypeSNumber',
    },{
        title: '单元',
        dataIndex: 'invoiceTypeSSale',
    },{
        title: '房号',
        dataIndex: 'invoiceTypeSTaxAmount',
    },{
        title: '客户名称',
        dataIndex: 'invoiceTypeCNumber',
    },{
        title: '身份证号码/纳税识别号',
        dataIndex: 'invoiceTypeCSale',
    },{
        title: '合同价款（含税）',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '建筑面积（实测）',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '收入确认金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积',
        dataIndex: 'invoiceTypeCTaxAmount',
    }
];

export default class TabPage extends Component{
    state={
        visible:false,
        updateKey:Date.now(),
        selectedRowKeys:[],
    }
    hideModal(){
        this.setState({visible:false});
    }
    update(){
        this.setState({updateKey:Date.now()})
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey || props.titleCertificateId!==this.props.titleCertificateId){
            this.setState({updateKey:Date.now()});
        }
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
                request.delete(`/account/other/reduceTaxDetail/delete/${this.state.selectedRowKeys.toString()}`)
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
    render(){
        const {selectedRowKeys} = this.state;
        const props = this.props;
        return(
            <Card title="结转收入明细" extra={<div>
                <FileExport
                    url='/account/output/billingSale/export'
                    title="导出"
                    size="small"
                    setButtonStyle={{marginRight:5}}
                />
                <PopUploadModal
                    url="/income/invoice/collection/upload"
                    title="导入"
                    onSuccess={()=>{
                        this.refreshTable()
                    }}
                    style={{marginRight:5}}
                />
                <FileExport
                    url='/account/income/fixedAssets/download'
                    title="下载导入模板"
                    setButtonStyle={{marginTop:10,marginRight:5}}
                    size='small'
                />
                <Button size="small" type='danger' onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
            </div>}
                  style={{marginTop:10}}
            >
                <AsyncTable url="/account/output/billingSale/list?isEstate=0"
                            updateKey={props.updateKey}
                            tableProps={{
                                rowKey:record=>record.sysTaxRateId,
                                pagination:false,
                                size:'small',
                                columns:getColumns(this),
                                onRowSelect:(selectedRowKeys)=>{
                                    this.setState({
                                        selectedRowKeys
                                    })
                                },
                                scroll:{x:'150%'},
                            }} />

            </Card>
        )
    }
}