/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Popconfirm,Icon} from 'antd'
import {AsyncTable,FileExport,FileImportModal} from '../../../../compoments'
import {getFields,request,getUrlParam,fMoney} from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment'
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
class InputTaxOnFixedAssets extends Component {
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
        tableUpDateKey:Date.now(),
        visible:false,
        statusParam:{},
    }

    columns = [
        {
            title:'操作',
            key:'actions',
            render:(text,record)=>(
                <div>
                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{this.deleteRecord(record)}} onCancel={()=>{}} okText="确定" cancelText="取消">
                        <a style={{marginRight:"5px"}}>删除</a>
                    </Popconfirm>
                </div>
            ),
            fixed:'left',
            width:'70px',
            className:'text-center'
        },{
            title:'发票类型',
            dataIndex:'invoiceType',
        },{
            title: '当期申报抵扣的进项税额',
            dataIndex: 'incomeTaxAmount',
            render:text=>fMoney(text)
        },{
            title: '本年申报抵扣的进项税额累计',
            dataIndex: 'incomeTaxAmountSum',
            render:text=>fMoney(text)
        }
    ];
    deleteRecord(record){
        request.delete(`/account/income/fixedAssets/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable()
            } else {
                message.error(data.msg, 4);
            }
        })
            .catch(err => {
                message.error(err.message);
                this.setState({loading:false})
            })
    }
    requestPost=(url,type,value={})=>{
        this.setState({ loading:true })
        request.post(url,value)
            .then(({data})=>{
                if(data.code===200){
                    this.setState({ loading:false })
                    message.success(`${type}成功!`);
                    this.updateStatus(value);
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=(values)=>{
        request.get('/account/income/fixedAssets/main',{params:values}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                    tableUpDateKey:Date.now()
                })
            }
        })
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const value = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '提交':
                        url = '/account/income/fixedAssets/submit';
                        this.requestPost(url,type,value);
                        break;
                    case '撤回':
                        url = '/account/income/fixedAssets/revoke';
                        this.requestPost(url,type,value);
                        break;
                    default:
                        this.setState({
                            filters:value
                        },()=>{
                            this.updateStatus(value);
                        });
                }
            }
        });
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }

    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    render(){
        const {tableUpDateKey,filters,statusParam} = this.state
        const disabled1 = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
        const {search} = this.props.location;
        let disabled = !!search;
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
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && (!!search && moment(getUrlParam('authMonthStart'), 'YYYY-MM'))) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }

                            <Col span={12} style={{textAlign:'right'}}>
                                <Form.Item>
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card extra={<div>
                    {
                        JSON.stringify(statusParam) !== "{}" &&
                        <div style={{marginRight: 30, display: 'inline-block'}}>
                                  <span style={{marginRight: 20}}>状态：<label
                                      style={{color: parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                            <span>提交时间：{statusParam.lastModifiedDate}</span>
                        </div>
                    }
                    <FileImportModal
                        url="/account/income/fixedAssets/upload"
                        title="导入"
                        fields={fields}
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        style={{marginRight:5}} />
                    <FileExport
                        url='/account/income/fixedAssets/download'
                        title="下载导入模板"
                        setButtonStyle={{marginTop:10,marginRight:5}}
                        size='small'
                    />
                    <Button
                        disabled={disabled1}
                        size='small'
                        onClick={(e)=>this.handleSubmit(e,'提交')}
                        style={{marginRight:5}}>
                        <Icon type="check" />
                        提交
                    </Button>
                    <Button
                        disabled={disabled2}
                        size='small'
                        onClick={(e)=>this.handleSubmit(e,'撤回')}
                        style={{marginRight:5}}>
                        <Icon type="rollback" />
                        撤回提交
                    </Button>
                </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/account/income/fixedAssets/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:this.columns,
                                }} />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InputTaxOnFixedAssets))