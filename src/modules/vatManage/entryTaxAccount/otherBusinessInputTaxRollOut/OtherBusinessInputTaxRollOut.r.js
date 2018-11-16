/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-25 14:43:14
 */
import React, { Component } from "react";
import { message,Form } from "antd";
import {SearchTable,TableTotal,PopDetailsModal} from "compoments";
import { request, fMoney, listMainResultStatus,composeBotton,requestResultStatus, parseJsonToParams } from "utils";
import moment from "moment";
import PopModal from "./popModal";
import AdjustPopModal from "./adjustPopModal"
// import { NumericInputCell } from 'compoments/EditableCell'

const pointerStyle = {
    cursor: 'pointer',
    color: '#1890ff'
};

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
            doNotFetchDidMount: !declare,
            fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    }
];

const getColumns = (context,isEdit) => {
    const {statusParam={}} = context.state;
    const {declare} = context.props;
    return [
        {
            title: "利润中心",
            dataIndex: "profitCenterName",
            width: "200px",
            align: 'center',
            render: (text, row, index) => {
                const obj = {
                    children: text,
                    props: {}
                };
                obj.props.rowSpan = index % 9 === 0 ? 9 : 0;
                return obj;
            }
        },
        {
            title: "转出项目",
            dataIndex: "outProjectName",
            width:'300px',
            render: (text, record, index) => {
                return (<span title="查看发票信息详情" onClick={() => {
                    context.setState({
                        voucherParams: {
                            profitCenterId: record.profitCenterId,
                            outProjectName: record.outProjectName,
                        }
                    }, () => {
                        context.toggleModalVisible(true);
                    });
                }} style={pointerStyle}>{text}</span>);
            }
        },
        {
            title: "转出发票份数",
            dataIndex: "invoiceCount",
            width:'200px',
            // render: (text,record,index) => {
            //     if(isEdit){
            //         return <NumericInputCell
            //             fieldName={`invoiceCount[${index}]`}
            //             initialValue={text=== '0' ? '0' : text}
            //             getFieldDecorator={context.props.form.getFieldDecorator} />
            //     }else{
            //         return text;
            //     }
            // },
        },
        {
            title: "转出税额",
            dataIndex: "outTaxAmount",
            // render: (text,record,index) => {
            //     if(isEdit){
            //         return <NumericInputCell
            //             fieldName={`outTaxAmount[${index}]`}
            //             initialValue={text==='0' ? '0.00' : text}
            //             getFieldDecorator={context.props.form.getFieldDecorator} />
            //     }else{
            //         return fMoney(text);
            //     }
            // },
            className: "table-money",
            width:'200px',
        },
        ...((!!declare && declare.decAction === 'edit') && statusParam.status && statusParam.status === 1 ? [
            {
                title: '操作',
                render: (text, record) => (
                    <span style={pointerStyle} onClick={()=>{context.toggleModal({editFilters: {detailId: record.id}, popModalEdit: true})}}>{'调整'}</span>
                ),
                width: '45px',
                dataIndex: 'action',
                className: 'text-center'
            }
        ] : [])
    ];
}

const invoiceSearchFields = [
    {
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
];

const invoiceColumns = [
    {
        title: '转出项目',
        dataIndex: 'zcxmName',
        width:'100px',
    },{
        title: '发票类型',
        dataIndex: 'zefplx',
        width:'100px',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'100px',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'100px',
    },{
        title: '开票日期',
        dataIndex: 'zekprq',
        width:'100px',
    },{
        title: '认证所属期',
        dataIndex: 'zerzshq',
        width:'100px',
    },{
        title: '认证时间',
        dataIndex: 'zerzsj',
        width:'100px',
    },{
        title: '金额',
        dataIndex: 'zebhsje',
        className: "table-money",
        width:'100px',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'zese',
        className: "table-money",
        width:'100px',
        render:text=>fMoney(text),

    },{
        title: '含税金额',
        dataIndex: 'zehsje',
        className: "table-money",
        width:'100px',
        render:text=>fMoney(text),
    }
];

const invoiceTotalData = [
    [
        {
            label: "原合计发票份数：",
            key: ""
        },
        {
            label: "原合计税额：",
            key: ""
        }
    ],
    [
        {
            label: "调整发票份数：",
            key: ""
        },
        {
            label: "调整税额：",
            key: ""
        }
    ]
]

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
        voucherVisible: false,
        voucherParams: {},
        exportParams: {},
        popModalEdit: false,
        editFilters: {}
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
    toggleModal = obj => this.setState(obj)
    toggleModalVisible = voucherVisible => {
        this.setState({
            voucherVisible
        });
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
                        invoiceCount:values.invoiceCount[index]
                    }
                })
                this.setState({saveLoding:true})
                request.put('/account/income/taxout/update',params)
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.props.form.resetFields();
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
        const { totalSource,saveLoding, voucherVisible, voucherParams, exportParams, popModalEdit, editFilters } = this.state;
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
                                            type:'reset',
                                            url:'/account/income/taxout/reset',
                                            params:filters,
                                            userPermissions:['1401009'],
                                            onSuccess:this.refreshTable,
                                        },{
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
                <PopDetailsModal
                    title="发票信息"
                    visible={voucherVisible}
                    fields={invoiceSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVisible}
                    tableOption={{
                        columns:invoiceColumns,
                        url: `/account/income/taxout/invoice/detailsList?${parseJsonToParams({...filters, ...voucherParams})}`,
                        scroll:{ x: '1800px',y:'250px' },
                        onSuccess: params => {
                            this.setState({
                                exportParams: {...params}
                            });
                        },
                        extra: <div>
                            {
                                composeBotton([{
                                    type: 'fileExport',
                                    url: 'account/income/taxout/details/export',
                                    params: {...filters, ...voucherParams, ...exportParams},
                                    title: '导出',
                                    userPermissions: ['1401007']
                                }])
                            }
                        </div>
                    }}
                    totalData={invoiceTotalData}
                />

                <AdjustPopModal 
                    title="凭证误差调整"
                    visible={popModalEdit}
                    filters={editFilters}
                    toggleModalVoucherVisible={popModalEdit=>this.toggleModal({popModalEdit})}
                />
            </div>
        );
    }
}

export default Form.create()(OtherBusinessInputTaxRollOut);
