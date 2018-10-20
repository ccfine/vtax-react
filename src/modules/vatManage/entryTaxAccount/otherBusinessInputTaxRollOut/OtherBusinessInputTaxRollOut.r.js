/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-08 11:03:59
 */
import React, { Component } from "react";
import { message,Form } from "antd";
import {SearchTable,TableTotal} from "compoments";
import { request, fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import moment from "moment";
import PopModal from "./popModal";
import { NumericInputCell } from 'compoments/EditableCell'

const getFields = (disabled,declare) => getFieldValue => [
    {
        label: "纳税主体",
        type: "taxMain",
        span:8,
        fieldName: "main",
        componentProps: {
            labelInValue:true,
            disabled
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
    },
    {
        label: "利润中心",
        fieldName: "profitCenterId",
        type: "asyncSelect",
        span: 8,
        componentProps: {
            fieldTextName: "profitName",
            fieldValueName: "id",
            doNotFetchDidMount: false,
            fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    }
];

const getColumns = (context,isEdit) => {
    return [
        {
            title: "利润中心",
            dataIndex: "profitCenterName",
            width: "200px"
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
                        initialValue={text==='0' ? '0.00' : text}
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
            <div className='oneLine'>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    backCondition={(filters)=>{
                        this.setState({
                            filters,
                        },()=>{
                            this.updateStatus(filters);
                        })
                    }}
                    tableOption={{
                        key: this.state.updateKey,
                        url: "/account/income/taxout/list",
                        pagination: false,
                        columns: getColumns(this,noSubmit && disabled && declare.decAction==='edit' ),
                        rowKey: "id",
                        // onSuccess:(params,dataSource)=>{
                        //   this.setState({
                        //       filters:params,
                        //       dataSource,
                        //   });  
                        //   this.updateStatus(params);
                        // },
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        onDataChange: dataSource => {
                            this.setState({
                                dataSource
                            });
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-380-(disabled?50:0),
                        },
                        cardProps: {
                            title: "进项税额转出台账",
                            extra: (
                                <div>
                                    {listMainResultStatus(statusParam)}
                                    {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'account/income/taxout/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1401007'],
                                        }])
                                    }
                                    {
                                        (disabled && declare.decAction==='edit' && noSubmit) && composeBotton([{
                                            type:'save',
                                            text:'保存',
                                            icon:'save',
                                            userPermissions:['1401003'],
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
                                            type:'reset',
                                            url:'/account/income/taxout/reset',
                                            params:filters,
                                            userPermissions:['1401009'],
                                            onSuccess:this.refreshTable,
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
                                                title: "合计",
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
                        fields: getFields(disabled,declare),
                        cardProps:{style:{
                            borderTop:0,
                        }}
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

export default Form.create()(OtherBusinessInputTaxRollOut);
