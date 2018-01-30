/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {AsyncTable,FileExport,FileImportModal} from '../../../../compoments'
import {Card} from 'antd'
import {fMoney} from '../../../../utils'
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
        title: '项目分期编码',
        dataIndex: 'stagesNum',
    }, {
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '计税方法',
        dataIndex:'taxMethod',
    },{
        title: '金额',
        dataIndex: 'amount',
    }, {
        title: '分期税额',
        dataIndex: 'taxAmount',
    }, {
        title: '业务系统确认进项税额',
        children: [
            {
                title: '分摊比例',
                dataIndex: 'proScale',
            },{
                title: '转出',
                dataIndex: 'proOutAmount',
                render:text=>fMoney(text),
            }
        ]
    }, {
        title: '税务确认进项税额',
        children: [
            {
                title: '分摊比例',
                dataIndex: 'taxScale',
            },{
                title: '转出',
                dataIndex: 'taxOutAmount',
                render:text=>fMoney(text),
            }
        ]
    }, {
        title: '进项税额转出差异',
        dataIndex: 'taxDifference',
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
            <Card title="分期信息明细表" extra={
                <div>
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
                                scroll:{x:'150%'},
                            }} />
            </Card>
        )
    }
}