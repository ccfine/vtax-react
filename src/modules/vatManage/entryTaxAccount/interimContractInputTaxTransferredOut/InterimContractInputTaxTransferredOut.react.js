/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Popconfirm,message} from 'antd'
import {AsyncTable,FileExport,FileImportModal} from '../../../../compoments'
import {getFields,fMoney,request} from '../../../../utils'
import PageTwo from './TabPage2.r'
import PopModal from './popModal'

const spanPaddingRight={
    paddingRight:30
}
const code = {
    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
}
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

const getColumns =context =>[
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
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
    state={
        /**
         * params条件，给table用的
         * */
        filters:{
            pageSize:20
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        updateKey:Date.now(),
        modalUpDateKey:Date.now(),
        visible:false,
        dataSource:[],
        selectedRowKeys:undefined,
        selectedRows:[],
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
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    requestPost=(url,type)=>{
        this.setState({ loading:true })
        request.post(url)
            .then(({data})=>{
                this.setState({ loading:false })
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '提交':
                        url = `/account/income/taxContract/adjustment/submit/${data.mainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '撤回':
                        url = `/account/income/taxContract/adjustment/revoke/${data.mainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '重算':
                        url = `/account/income/taxContract/adjustment/reset/${data.mainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    default:

                }
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        updateKey:Date.now()
                    })
                });
            }
        });
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const {updateKey,filters,selectedRowKeys,selectedRows,modalUpDateKey,visible,dataSource} = this.state;
        return(
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'合同编号',
                                        fieldName:'contractNum',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                        },
                                    },{
                                        label:'结算单/产值单',
                                        fieldName:'bill',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                        },
                                    },
                                ])
                            }

                            <Col span={24}  style={{textAlign:'right'}}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="进项转出差异调整表" extra={
                    <div>
                        <FileImportModal
                            url="/account/income/taxContract/adjustment/upload"
                            title="导入"
                            fields={fields}
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
                            style={{marginRight:5}} />
                        <FileExport
                            url='/account/income/taxContract/adjustment/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        {
                            dataSource.length > 0 && <span>
                                {
                                    parseInt(dataSource[0].status, 0)=== 1 ?
                                        <span>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'提交')} style={{marginRight:5}}>
                                                <Icon type="check" />
                                                提交
                                            </Button>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'重算')} style={{marginRight:5}}>
                                                <Icon type="retweet" />
                                                重算
                                            </Button>
                                            <Button disabled={!selectedRowKeys} size='small' style={{marginRight:5}} onClick={()=>{
                                                this.toggleModalVisible(true)
                                                this.setState({
                                                    modalUpDateKey:Date.now()
                                                })
                                            }}>
                                                <Icon type="edit" />
                                                设置税务分摊比例
                                            </Button>
                                            {/*<Button size='small' style={{marginRight:5}}>
                                                <Icon type="form" />
                                                差异调整凭证
                                            </Button>*/}
                                            <FileExport
                                                url='/account/income/taxContract/adjustment/export'
                                                title="导出"
                                                size="small"
                                                setButtonStyle={{marginRight:5}}
                                            />
                                        </span>
                                        :
                                        <span>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'撤回')} style={{marginRight:5}}>
                                                <Icon type="rollback" />
                                                撤回提交
                                            </Button>
                                        </span>
                                }
                                </span>
                        }

                        </div>

                        }
                      style={{marginTop:10}}
                >
                    <AsyncTable url="/account/income/taxContract/adjustment/list"
                                updateKey={updateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:false,
                                    size:'small',
                                    columns:getColumns(this),
                                    scroll:{x:'160%'},
                                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                                        this.setState({
                                            selectedRowKeys:selectedRowKeys[0],
                                            selectedRows,
                                        })
                                    },
                                    rowSelection:{
                                        type:'radio',
                                    },
                                    onDataChange:(dataSource)=>{
                                      this.setState({
                                          dataSource
                                      })
                                    },
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                    金额：<span style={code}>{fMoney(data.pageAmount)}</span>
                                                    税额：<span style={code}>{fMoney(data.pageTaxAmount)}</span>
                                                    价税合计：<span style={code}>{fMoney(data.pageTotalAmount)}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                }} />
                </Card>

                <PageTwo id={selectedRowKeys} selectedRows={selectedRows} filters={filters} updateKey={updateKey}/>

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
            </Layout>
        )
    }
}
export default Form.create()(InterimContractInputTaxTransferredOut)