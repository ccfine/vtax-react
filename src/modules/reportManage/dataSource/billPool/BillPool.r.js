/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestDict} from 'utils'
import TableTitle from 'compoments/tableTitleWithTime'

const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const apiFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    }
]

const searchFields = contxt => getFieldValue =>[
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:8,
        formItemStyle,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label:'查询期间',
        fieldName:'authMonth',
        type:'monthPicker',
        formItemStyle,
        span:8,
        componentProps:{
            format:'YYYY-MM',
        }
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('mainId') || false,
            url:`/taxsubject/profitCenterList/${getFieldValue('mainId')}`,
        }
    },
    {
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        formItemStyle,
    },
    {
        label:'其他扣税凭证类型',
        fieldName:'zesfdkxm',
        type:'select',
        span:8,
        formItemStyle,
        options:contxt.state.zesfdkxm,
    },
    {
        label:'转出项目',
        fieldName:'zcxm',
        type:'select',
        span:8,
        formItemStyle,
        options:contxt.state.zcxm,
    }
]
const columns = [
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width: '200px',
    },
    {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'200px',
    },
    {
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'150px',
    },
    {
        title: '发票类型',
        dataIndex: 'zefplx',
        width:'150px',
    },
    {
        title: '含税金额',
        dataIndex: 'zehsje',
        width:'100px',
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: '不含税金额',
        dataIndex: 'zebhsje',
        width:'100px',
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: '税额',
        dataIndex: 'zese',
        width:'100px',
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: '购买方纳税人识别号',
        dataIndex: 'zegmfnsrsbh',
        width:'200px',
    },
    {
        title: '开票日期',
        dataIndex: 'zekprq',
        width:'100px',
    },
    {
        title: '发票状态',
        dataIndex: 'zefpzt',
        width:'150px',
    },
    {
        title: '是否能转出',
        dataIndex: 'zesfzc',
        width:'150px',
    },
    {
        title: '转出项目',
        dataIndex: 'zcxmName',
        width:'100px',
    },
    {
        title: '其他扣税凭证类型',
        dataIndex: 'zesfdkxmName',
        width:'200px',
    },
    {
        title: '转出总账凭证单据编号',
        dataIndex: 'zezxzzpzdjh',
        width:'200px',
    },
    {
        title: '认证状态',
        dataIndex: 'zerzzt',
        width:'150px',
    },
    {
        title: '认证时间',
        dataIndex: 'zerzsj',
        width:'150px',
    },
    {
        title: '认证所属期',
        dataIndex: 'zerzshq',
        width:'150px',
    },
    {
        title: '认证结果凭证号',
        dataIndex: 'zerztgpzh',
        width:'150px',
    },
    {
        title: '认证结果总账凭证单据编号',
        dataIndex: 'zerztgzzpzdjh',
        width:'200px',
    },
    {
        title: '提前认证标识',
        dataIndex: 'zetqrzbs',
        width:'150px',
    },
    {
        title: '发票单号',
        dataIndex: 'zefpdj',
        width:'150px',
    },
    {
        title: '应付单号',
        dataIndex: 'zeyfdh',
        width:'150px',
    },
    {
        title: '单据类型',
        dataIndex: 'zesydjlx1',
        width:'150px',
    },
    {
        title: '原发票号码',
        dataIndex: 'zeyfph',
        width:'150px',
    },
    {
        title: '成本管理科目',
        dataIndex: 'zeCbglkm',
        width:'150px',
    },
    {
        title: '项目计税类型',
        dataIndex: 'zexmjslx',
        width:'150px',
    },
    {
        title: '项目档案',
        dataIndex: 'zexmda',
        width:'150px',
    },
    {
        title: '业务单据类型',
        dataIndex: 'ze_zdjlx',
        width:'150px',
    },
    {
        title: '单据状态',
        dataIndex: 'zeZdjzt',
        width:'150px',
    },
    {
        title: '单据处理状态',
        dataIndex: 'zeClzt',
        width:'150px',
    },
    {
        title: '提交日期',
        dataIndex: 'subDate',
        width:'150px',
    },
    {
        title: '过账日期',
        dataIndex: 'postingDate',
        width:'150px',
    },
    {
        title: '是否生成凭证',
        dataIndex: 'zeZsfpz',
        width:'150px',
    },
    {
        title: '会计凭证号码',
        dataIndex: 'belnrD',
        width:'150px',
    },
    {
        title: '来源单据编号',
        dataIndex: 'zezlydjh',
        width:'150px',
    },
    {
        title: '创建时间',
        dataIndex: 'ctime',
        width:'150px',
    },
    {
        title: '最后更改的日期',
        dataIndex: 'aedat',
        width:'150px',
    },
    {
        title: '票据id',
        dataIndex: 'billId',
        width:'150px',
    },
];

const setFormat = data => {
    return data.map(item=>{
        return{
            value:item.code,
            text:item.name
        }
    })
}

export default class BillPool extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        zesfdkxm:[],
        zcxm:[],
        totalSource: undefined
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    componentDidMount(){
        //请求其他扣税凭证类型options数据
        requestDict('JXFPLX',result => {
            this.setState({
                zesfdkxm: setFormat(result)
            })
        })
        //请求转出项目options数据
        requestDict('ZCXM',result => {
            this.setState({
                zcxm: setFormat(result)
            })
        })
    }
    // deleteRecord(record){
    //     request.delete(``).then(({data}) => {
    //         if (data.code === 200) {
    //             message.success('删除成功', 4);
    //             this.refreshTable();
    //         } else {
    //             message.error(data.msg, 4);
    //         }
    //     }).catch(err => {
    //         message.error(err.message);
    //     })
    // }
    render(){
        const {updateKey,totalSource} = this.state;
        return(
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(this)
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns,
                        url:'/interInvoicePools/list',
                        scroll:{ x: 5800,y:window.screen.availHeight-450 },
                        onSuccess: (params) => {
                            this.setState({
                                filters: params,
                            });
                        },
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        cardProps: {
                            title: <TableTitle time={totalSource && totalSource.extractTime}>SAP-票据池数据采集</TableTitle>,
                            extra: (
                                <div>
                                    {/* {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:["2111007"],
                                        }])
                                    } */}
                                    {
                                        composeBotton([{
                                            type:'modal',
                                            url:'/interInvoicePools/sendApi',
                                            title:'抽数',
                                            icon:'usb',
                                            fields:apiFields,
                                            userPermissions:['2115001'],
                                        }])
                                    }
                                    <TableTotal totalSource={totalSource} type={3} data={[
                                        {
                                            title:'总计',
                                            total:[
                                                {title: '不含税金额', dataIndex: 'amount'},
                                                {title: '税额', dataIndex: 'taxAmount'},
                                                {title: '含税金额', dataIndex: 'totalAmount'},
                                            ],
                                        }
                                    ]}/>
                                </div>
                            )
                        },
                    }}
                />
        )
    }
}