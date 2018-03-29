/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Form,Button,Icon,Popconfirm,message} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../compoments'
import {fMoney,request,getUrlParam,listMainResultStatus} from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment'
import PageTwo from './TabPage2.r'
import PopModal from './popModal'

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
const searchFields =(disabled)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },{
            label:'认证月份',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择认证月份'
                    }
                ]
            },
        }, {
            label:'合同编号',
            fieldName:'contractNum',
            type:'input',
            span:8,
            componentProps:{
            },
            fieldDecoratorOptions:{
            },
        }, {
            label:'结算单/产值单',
            fieldName:'bill',
            type:'input',
            span:8,
            componentProps:{
            },
            fieldDecoratorOptions:{
            },
        }
    ]
}
const getColumns =context =>[
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="确定" cancelText="取消">
                        <a alt="删除" style={{marginRight:"5px"}}>删除</a>
                    </Popconfirm>
                </span>
            );
        },
        fixed:'left',
        width:'50px',
        dataIndex:'action'
    }, {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '产值单/结算单',
        dataIndex: 'bill',
    },{
        title: '合同编号',
        dataIndex: 'contractNum',
    },{
        title: '合同名称',
        dataIndex: 'contractName',
    }, {
        title: '财务签收日期',
        dataIndex: 'signingDate',
    }, {
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
    }, {
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
    }, {
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    }, {
        title: '业务系统确认进项税',
        children: [
            {
                title: '抵扣金额',
                dataIndex: 'proDedAmount',
                render:text=>fMoney(text),
            },{
                title: '转出金额',
                dataIndex: 'proOutAmount',
                render:text=>fMoney(text),
            }
        ]
    }, {
        title: '税务确认进项税',
        children: [
            {
                title: '抵扣金额',
                dataIndex: 'taxDedAmount',
                render:text=>fMoney(text),
            },{
                title: '转出金额',
                dataIndex: 'taxOutAmount',
                render:text=>fMoney(text),
            }
        ]
    }, {
        title: '进项税额转出差异',
        dataIndex: 'taxDifference',
    }, {
        title: '税务分摊比例是否完整',
        dataIndex: 'taxShare',
        render:text=>{
            if(parseInt(text, 0)===0){
                return '不完整'
            }
            if(text ===1){
                return '完整'
            }
            return ''
        }
    }
];
class InterimContractInputTaxTransferredOut extends Component {
    state = {
        updateKey: Date.now(),
        pageTwoKey: Date.now(),
        modalUpDateKey: Date.now(),
        visible: false,
        filters: {},
        selectedRowKeys: undefined,
        selectedRows: [],
        searchTableLoading: false,
        /**
         *修改状态和时间
         * */
        statusParam: {},
        dataSource: [],
    }
    refreshTable = () => {
        this.setState({
            updateKey: Date.now(),
        }, () => {
            this.updateStatus()
        })
    }
    toggleSearchTableLoading = b => {
        this.setState({
            searchTableLoading: b
        })
    }
    handleClickActions = type => {
        let url = '';
        switch (type) {
            case '提交':
                url = '/account/income/taxContract/adjustment/submit';
                this.requestPost(url, type, this.state.filters);
                break;
            case '撤回':
                url = '/account/income/taxContract/adjustment/revoke';
                this.requestPost(url, type, this.state.filters);
                break;
            case '重算':
                url = '/account/income/taxContract/adjustment/reset';
                this.requestPut(url, type, this.state.filters);
                break;
            default:
                this.setState({
                    updateKey: Date.now(),
                    pageTwoKey: Date.now(),
                },()=> {
                    debugger
                    console.log(this.state.pageTwoKey)
                    this.updateStatus()
                })
        }
    }

    requestPut = (url, type, values = {}) => {
        this.toggleSearchTableLoading(true)
        request.put(url, values)
            .then(({data}) => {
                this.toggleSearchTableLoading(false)
                if (data.code === 200) {
                    message.success(`${type}成功!`);
                    this.refreshTable()
                } else {
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    requestPost = (url, type, values = {}) => {
        this.toggleSearchTableLoading(true)
        request.post(url, values)
            .then(({data}) => {
                this.toggleSearchTableLoading(false)
                if (data.code === 200) {
                    message.success(`${type}成功!`);
                    this.refreshTable()
                } else {
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=()=>{
        request.get('/account/income/taxContract/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
        })
    }
    deleteRecord(record){
        request.delete(`/account/income/taxContract/adjustment/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.setState({updateKey:Date.now()});
            } else {
                message.error(data.msg, 4);
            }
        })
            .catch(err => {
                message.error(err.message);
                this.setState({loading:false});
            })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    componentDidMount() {
        const {search} = this.props.location;
        if (!!search) {
            this.setState({
                filters: {
                    mainId: getUrlParam('mainId') || undefined,
                    authMonth: moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            }, () => {
                this.refreshTable()
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateKey !== this.props.updateKey) {
            this.setState({
                filters: nextProps.filters,
                updateKey: nextProps.updateKey
            });
        }
    }

    render() {
        const {updateKey, pageTwoKey, modalUpDateKey, visible, searchTableLoading, selectedRowKeys,selectedRows, filters, dataSource, statusParam} = this.state;
        const {mainId, authMonth} = this.state.filters;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
        const {search} = this.props.location;
        let disabled = !!search;
        return (
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={true}
                searchOption={{
                    fields: searchFields(disabled),
                    cardProps: {
                        style: {
                            borderTop: 0
                        }
                    },
                    onFieldsChange: values => {
                        if (JSON.stringify(values) === "{}") {
                            this.setState({
                                filters: {
                                    mainId: (disabled && getUrlParam('mainId')) || undefined,
                                    authMonth: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM')) || undefined,
                                }
                            })
                        } else if (values.mainId || values.authMonth) {
                            if (values.authMonth) {
                                values.authMonth = values.authMonth.format('YYYY-MM')
                            }
                            this.setState(prevState => ({
                                filters: {
                                    ...prevState.filters,
                                    ...values
                                }
                            }))
                        }
                    }
                }}
                backCondition={this.updateStatus}
                tableOption={{
                    key: updateKey,
                    pageSize: 10,
                    columns: getColumns(this),
                    cardProps: {
                        title: '进项转出差异调整表'
                    },
                    rowSelection: {
                        type: 'radio',
                    },
                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                        this.setState({
                            selectedRowKeys:selectedRowKeys[0],
                            selectedRows,
                            pageTwoKey:Date.now(),
                        })
                    },
                    onSuccess:()=>{
                        this.setState({
                            selectedRowKeys:undefined,
                            selectedRows:[],
                            pageTwoKey:Date.now(),
                        })
                    },
                    url: '/account/income/taxContract/adjustment/list',
                    extra: <div>
                        {
                            dataSource.length > 0 && listMainResultStatus(statusParam)
                        }
                        <FileImportModal
                            url="/account/income/taxContract/adjustment/upload"
                            title="导入"
                            fields={fields}
                            onSuccess={() => {
                                this.refreshTable()
                            }}
                            style={{marginRight: 5}}/>
                        <FileExport
                            url='account/income/taxContract/adjustment/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight: 5}}
                        />
                        <FileExport
                            url='account/income/taxContract/adjustment/export'
                            title='导出'
                            setButtonStyle={{marginRight: 5}}
                            disabled={!dataSource.length > 0}
                            params={{
                                ...filters
                            }}
                        />
                        <Button
                            disabled={!selectedRowKeys}
                            size='small'
                            style={{marginRight: 5}}
                            onClick={() => {
                                this.toggleModalVisible(true)
                                this.setState({
                                    modalUpDateKey: Date.now()
                                })
                            }}>
                            <Icon type="edit"/>
                            设置税务分摊比例
                        </Button>
                        {/*<Button size='small' style={{marginRight:5}}>
                         <Icon type="form" />
                         差异调整凭证
                         </Button>*/}
                        <Button
                            disabled={disabled1}
                            size='small'
                            onClick={() => this.handleClickActions('重算')}
                            style={{marginRight: 5}}>
                            <Icon type="retweet"/>
                            重算
                        </Button>
                        <Button
                            disabled={disabled1}
                            size='small'
                            onClick={() => this.handleClickActions('提交')}
                            style={{marginRight: 5}}>
                            <Icon type="check"/>
                            提交
                        </Button>
                        <Button
                            disabled={disabled2}
                            size='small'
                            onClick={() => this.handleClickActions('撤回')}
                            style={{marginRight: 5}}>
                            <Icon type="rollback"/>
                            撤回提交
                        </Button>
                    </div>,
                    onDataChange: (dataSource) => {
                        this.setState({
                            dataSource
                        })
                    },
                    renderFooter:data=>{
                        return (
                            <div className="footer-total">
                                <div>
                                    <label>合计：</label>
                                    金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                    税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                    价税合计：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                </div>
                            </div>
                        )
                    }
                }}
            >

                <PageTwo key={pageTwoKey} selectedRows={selectedRows} filters={filters}/>

                <PopModal
                    title="税务分摊比例列表设置"
                    visible={visible}
                    tableUpDateKey={modalUpDateKey}
                    id={selectedRowKeys}
                    filters={filters}
                    selectedRows={selectedRows}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </SearchTable>

        )
    }
}
export default Form.create()(withRouter(InterimContractInputTaxTransferredOut))