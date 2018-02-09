/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,message} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {request,getFields,fMoney,getUrlParam} from '../../../../utils'
import PopInvoiceInformationModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const buttonStyle={
    marginRight:5
}
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
class InputTaxDetails extends Component {
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
        params:{},
        statusParam:{},
    }

    columns = [
        {
            title: '纳税主体',
            dataIndex: 'mainName',
        }, {
            title: '抵扣凭据类型',
            dataIndex: 'sysDictIdName',
        },{
            title: '凭据份数',
            dataIndex: 'num',
            render:(text,record)=>(
                <a onClick={()=>{
                    const params= {
                        mainId:record.mainId,
                        invoiceType:record.sysDictId,
                    }
                    this.setState({
                        params:params
                    },()=>{
                        this.toggleModalVisible(true)
                    })
                }}>{text}</a>
            )
        },{
            title: '金额',
            dataIndex: 'amount',
            render:text=>fMoney(text),
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            render:text=>fMoney(text),

        }
    ];

    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.authMonth){
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '提交':
                        url = '/account/income/taxDetail/submit';
                        this.requestPost(url,type,values);
                        break;
                    case '撤回':
                        url = '/account/income/taxDetail/revoke';
                        this.requestPost(url,type,values);
                        break;
                    case '重算':
                        url = '/account/income/taxDetail/reset';
                        this.requestPut(url,type,values);
                        break;
                    default:
                        this.setState({
                            filters:values,
                        },()=>{
                            this.setState({
                                tableUpDateKey:Date.now()
                            },()=>{
                                this.updateStatus();
                            })
                        });
                }
            }
        });
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
    requestPut=(url,type,data={})=>{
        request.put(url,data)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.updateStatus();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    requestPost=(url,type,data={})=>{
        request.post(url,data)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.updateStatus();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=()=>{
        request.get('/account/income/taxDetail/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                    tableUpDateKey:Date.now()
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.handleSubmit()
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.tableUpDateKey !== this.props.tableUpDateKey){
            this.setState({
                filters:nextProps.filters,
            },()=>{
                this.setState({
                    tableUpDateKey:nextProps.tableUpDateKey
                },()=>{
                    this.updateStatus();
                })
            });
        }
    }
    render(){
        const {tableUpDateKey,filters,visible,params} = this.state;
        const {statusParam} = this.state;
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
                                            format:'YYYY-MM',
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
                <Card
                    extra={
                        <div>
                            {
                                JSON.stringify(statusParam) !== "{}" &&
                                <div style={{marginRight: 30, display: 'inline-block'}}>
                                  <span style={{marginRight: 20}}>状态：<label
                                      style={{color: parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                                    <span>提交时间：{statusParam.lastModifiedDate}</span>
                                </div>
                            }
                            <Button size="small" style={buttonStyle} disabled={disabled1} onClick={(e)=>this.handleSubmit(e,'提交')}><Icon type="check" />提交</Button>
                            <Button size="small" style={buttonStyle} disabled={disabled1} onClick={(e)=>this.handleSubmit(e,'重算')}><Icon type="rollback" />重算</Button>
                            <Button size="small" style={buttonStyle} disabled={disabled2} onClick={(e)=>this.handleSubmit(e,'撤回')}><Icon type="rollback" />撤回提交</Button>
                        </div>
                    }
                    style={{marginTop:10}}>

                    <AsyncTable url="/account/income/taxDetail/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:this.columns,
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                    金额：<span style={code}>{fMoney(data.pageAmount)}</span>
                                                    税额：<span style={code}>{fMoney(data.pageTaxAmount)}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                }} />
                </Card>

                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    params={params}
                    filters={filters}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InputTaxDetails))