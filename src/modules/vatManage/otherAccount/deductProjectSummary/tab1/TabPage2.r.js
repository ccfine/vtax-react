/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable,FileExport,FileImportModal} from '../../../../../compoments'
import {Card} from 'antd'
import {fMoney} from '../../../../../utils'
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
        title: '项目分期名称',
        dataIndex: 'taxMethod',
    }, {
        title: '项目分期代码',
        dataIndex: 'name',
    },{
        title: '价税合计',
        dataIndex: 'invoiceTypeSNumber',
        render:text=>fMoney(text),
    },{
        title: '本期发生额',
        dataIndex: 'invoiceTypeSSale',
        render:text=>fMoney(text),
    },{
        title: '本期实际扣除金额',
        dataIndex: 'invoiceTypeSTaxAmount',
        render:text=>fMoney(text),
    }
];

export default class TabPage extends Component{
    state={
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

        if(props.selectedRows.length >0 ){
            if(props.updateKey !== this.props.updateKey || props.id!==this.props.id){
                this.setState({updateKey:Date.now()});
            }
        }

    }
    render(){
        const props = this.props;
        return(
            <Card title="项目分期信息" extra={
                <div>
                    <FileExport
                        url='/account/output/billingSale/export'
                        title="导出"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                    <FileImportModal
                        url="/account/income/taxContract/detail/upload"
                        title="导入"
                        fields={fields}
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        style={{marginRight:5}} />
                    <FileExport
                        url='/account/income/taxContract/detail/download'
                        title="下载导入模板"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                </div>
            }
                  style={{marginTop:10}}
            >
                <AsyncTable url="/account/income/taxContract/detail/list"
                            updateKey={this.state.updateKey}
                            filters={{
                                contractNum: props.selectedRows.length >0 && props.selectedRows[0].contractNum,
                                authMonth: props.filters.authMonth,
                            }}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:false,
                                size:'small',
                                columns:getColumns(this),
                            }} />
            </Card>
        )
    }
}