/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-11 17:34:55
 */
import React, { Component } from "react";
import {connect} from 'react-redux';
import { message,Form } from "antd";
import {SearchTable,TableTotal} from "compoments";
import { request, fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import moment from "moment";
import PopModal from "./popModal";
import { NumericInputCell } from 'compoments/EditableCell'

const getFields = (disabled,declare) => [
    {
        label: "纳税主体",
        type: "taxMain",
        span:8,
        fieldName: "mainId",
        componentProps: {
            disabled
        },
        fieldDecoratorOptions: {
            initialValue:
                (disabled && declare["mainId"]) || undefined,
            rules: [
                {
                    required: true,
                    message: "请选择纳税主体"
                }
            ]
        }
    },
    {
        label: `查询月份`,
        fieldName: "authMonth",
        type: "monthPicker",
        span:8,
        componentProps: {
            format: "YYYY-MM",
            disabled
        },
        fieldDecoratorOptions: {
            initialValue:
                (disabled && moment(declare["authMonth"], "YYYY-MM")) ||
                undefined,
            rules: [
                {
                    required: true,
                    message: `请选择查询月份`
                }
            ]
        }
    }
];

const getColumns = (context,isEdit) => {
    return [
    {
        title: "纳税主体",
        dataIndex: "mainName",
        width:'40%',
    },
    {
        title: "转出项目",
        dataIndex: "outProjectName",
        width:'40%',
    },
    {
        title: "转出税额",
        dataIndex: "outTaxAmount",
        render: (text,record,index) => {
            if(isEdit){
                return <NumericInputCell
                fieldName={`outTaxAmount[${index}]`}
                initialValue={text}
                getFieldDecorator={context.props.form.getFieldDecorator} />
            }else{
                return fMoney(text);
            }
        },
        className: "table-money",
        width:'20%',
    }
];
}

class OtherBusinessInputTaxRollOut extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        statusParam: undefined,
        filters: {},
        saveLoding:false,
        dataSource:[],
    };
    hideModal() {
        this.setState({ visible: false });
    }
    updateStatus = (values) => {
        requestResultStatus('/account/income/taxout/listMain',values,result=>{
            this.setState({
                statusParam: result,
            })
        })
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(!values.outTaxAmount){return}
                const {dataSource} = this.state;
                let params = dataSource.map((ele,index)=>{
                    return {
                        id:ele.id,
                        outTaxAmount:values.outTaxAmount[index],
                        taxDate:ele.taxDate,
                        mainId:ele.mainId,
                    }
                })
                this.setState({saveLoding:true})
                request.put('/account/income/taxout/update',params)
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.props.form.resetFields(this.state.dataSource.map((ele,index)=>`outTaxAmount[${index}]`))
                            this.refreshTable()
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({saveLoding:false})
                    })
            }
        })
    }
    render() {
        const { totalSource,saveLoding } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        
        let { filters, statusParam } = this.state;
        const noSubmit = statusParam && parseInt(statusParam.status, 0) !== 2;
        return (
            <div>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    tableOption={{
                        key: this.state.updateKey,
                        url: "/account/income/taxout/list",
                        pagination: false,
                        columns: getColumns(this,noSubmit && disabled && declare.decAction==='edit' ),
                        rowKey: "id",
                        onSuccess:(params,dataSource)=>{
                          this.setState({
                              filters:params,
                              dataSource,
                          });  
                          this.updateStatus(params);
                        },
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-380,
                        },
                        cardProps: {
                            title: "其他类型进项税额转出台账",
                            extra: (
                                <div>
                                    {listMainResultStatus(statusParam)}
                                    {
                                         (disabled && declare.decAction==='edit' && noSubmit) && composeBotton([{
                                            type:'save',
                                            text:'保存',
                                            icon:'save',
                                            userPermissions:['1401004'],
                                            onClick:this.save,
                                            loading:saveLoding
                                        }],statusParam)
                                    }
                                    {
                                         (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'submit',
                                            url:'/account/income/taxout/submit',
                                            // monthFieldName:"authMonth",
                                            params:filters,
                                            userPermissions:['1401010'],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            // monthFieldName:"authMonth",
                                            url:'/account/income/taxout/revoke',
                                            params:filters,
                                            userPermissions:['1401011'],
                                            onSuccess:this.refreshTable,
                                        }],statusParam)
                                    }
                                    <TableTotal
                                        type={3}
                                        totalSource={totalSource}
                                        data={[
                                            {
                                                title: "本页合计",
                                                total: [
                                                    {
                                                        title: "转出税额",
                                                        dataIndex: "pageOutTaxAmount"
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                </div>
                            )
                        }
                    }}
                    searchOption={{
                        fields: getFields(disabled,declare)
                    }}
                />
                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => {
                        this.hideModal();
                    }}
                    id={this.state.opid}
                    update={this.refreshTable}
                />
            </div>
        );
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
  }))(Form.create()(OtherBusinessInputTaxRollOut));
