/**
 * Created by liuliyuan on 18/1/16.
 */
import React,{Component} from 'react'
import {Card,Form,Button,Icon,message} from 'antd'
import {AsyncTable} from 'compoments'
import {getFields,htmlDecode,regRules,request,fMoney,listMainResultStatus} from 'utils'
const buttonStyle={
    marginRight:5
}
const max50={
    max:regRules.input_length_50.max, message: regRules.input_length_50.message,
}
const TextAreaAutoSize = {
    autosize:{ minRows: 2, maxRows: 6 }
}
const EditableCell = ({ title, editable, value, form, column, type,rules,componentProps }) => {
    return (
        <div>
            {
                editable
                    ? getFields(form,[
                        {
                            label:title,
                            fieldName:`${column}`,
                            type:type,
                            span:24,
                            notLabel:true,
                            formItemStyle:{
                                labelCol:{
                                    span:24
                                },
                                wrapperCol:{
                                    span:24
                                }
                            },
                            componentProps:{
                                ...componentProps
                            },
                            fieldDecoratorOptions:{
                                initialValue:value === '' ? value : fMoney(value),
                                rules,
                            }
                        }
                    ])
                    : title === '调整说明' ? value : fMoney(value)
            }
        </div>
    );
}


class TableTaxStructure extends Component {
    state={
        dataSource:[],
        resetDataSource:[],
        isShowResetDataSource:false,
    }
    columns = [
        {
            title: '抵扣明细',
            dataIndex: 'deductionDetails',
            width:100,
            render:text=><div dangerouslySetInnerHTML={{  __html: htmlDecode(text) }}></div>,
        },{
            title: '金额',
            dataIndex: 'amount',
            width:100,
            render: (text, record) =>this.renderColumns('金额',text, record, `data[${record.id}].amount`,'numeric')
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            width:100,
            render: (text, record) =>this.renderColumns('税额',text, record, `data[${record.id}].taxAmount`,'numeric')
        }, {
            title: '调整金额',
            dataIndex: 'adjustAmount',
            width:100,
            render: (text, record) =>this.renderColumns('调整金额',text, record, `data[${record.id}].adjustAmount`,'numeric')
        },{
            title: '调整税额',
            width:100,
            dataIndex: 'adjustTaxAmount',
            render: (text, record) =>this.renderColumns('调整税额',text, record, `data[${record.id}].adjustTaxAmount`,'numeric')
        },{
            title: '调整说明',
            width:200,
            dataIndex: 'adjustDescription',
            render: (text, record) =>this.renderColumns('调整说明',text, record, `data[${record.id}].adjustDescription`, 'textArea',[max50],TextAreaAutoSize)
        }
    ];

    renderColumns(title,text, record, column,type,rules=[],TextAreaAutoSize={}) {
        return  parseInt(record.status, 0) === 1 ? <EditableCell
                editable={!record.summary}
                title={title}
                value={text}
                form={this.props.form}
                column={column}
                type={type}
                rules={rules}
                componentProps={TextAreaAutoSize}
                //onChange={value => this.handleChange(value, record.key, column)}
            />
            : text
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const props = this.props;

                let url= null;
                const newData = [...this.state.dataSource];
                let arrList=[];
                if(JSON.stringify(values) !== "{}" ){
                    arrList = newData.map((item,i)=>{
                        return {
                            ...item,
                            ...values.data[i],
                        }
                    });
                }else{
                    arrList = newData;
                }
                switch (type){
                    case '保存':
                        url = '/account/income/taxstructure/save';
                        this.requestPost(url,type,{list:arrList});
                        break;
                    case '提交':
                        this.props.toggleSearchTableLoading(true)
                        request.post('/account/income/taxstructure/save',{list:arrList})
                            .then(({data})=>{
                                if(data.code===200){
                                    url = '/account/income/taxstructure/submit';
                                    this.requestPost(url,type,props.filters);
                                }else{
                                    message.error(`${type}失败:${data.msg}`)
                                    this.props.toggleSearchTableLoading(false)
                                }
                            }).catch(err=> {
                                message.error(err.message)
                                this.props.toggleSearchTableLoading(false)
                            })
                        break;
                    case '撤回':
                        url = '/account/income/taxstructure/revoke';
                        this.requestPost(url,type,props.filters);
                        break;
                    case '重算':
                        url = '/account/income/taxstructure/reset';
                        this.requestPut(url,type,props.filters);
                        break;
                    default:
                        this.setState({
                            filters:props.filters,
                        },()=>{
                            this.props.refreshTable();
                        });

                }
            }
        });
    }
    requestPut=(url,type,data={})=>{
        this.props.toggleSearchTableLoading(true);
        request.put(url,data)
            .then(({data})=>{
                this.props.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.props.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            }).catch(err=> {
                message.error(err.message)
                this.props.toggleSearchTableLoading(false)
            })
    }
    requestPost=(url,type,data={})=>{
        this.props.toggleSearchTableLoading(true);
        request.post(url,data)
            .then(({data})=>{
                this.props.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.props.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            }).catch(err=> {
                message.error(err.message)
                this.props.toggleSearchTableLoading(false)
            })
    }

    render(){
        const {dataSource} = this.state;
        const props = this.props;
        const {statusParam} = this.props;
        const disabled1 = !((props.filters.mainId && props.filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((props.filters.mainId && props.filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
        return (
            <Card extra={
                <div>
                    {
                        dataSource.length>0 && listMainResultStatus(statusParam)
                    }
                    <Button size="small" style={buttonStyle} disabled={disabled1} onClick={(e)=>this.handleSubmit(e,'保存')}><Icon type="save" />保存</Button>
                    <Button size="small" style={buttonStyle} disabled={disabled1} onClick={(e)=>this.handleSubmit(e,'提交')}><Icon type="check" />提交</Button>
                    <Button size="small" style={buttonStyle} disabled={disabled1} onClick={(e)=>this.handleSubmit(e,'重算')}><Icon type="rollback" />重算</Button>
                    <Button size="small" style={buttonStyle} disabled={disabled2} onClick={(e)=>this.handleSubmit(e,'撤回')}><Icon type="rollback" />撤回提交</Button>
                </div>
            }
                  style={{marginTop:10}}>
                <Form onSubmit={this.handleSaveSubmit}>
                    <AsyncTable url="/account/income/taxstructure/list"
                                updateKey={props.tableUpDateKey}
                                filters={props.filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:false,
                                    size:'small',
                                    columns:this.columns,
                                    onDataChange:(dataSource)=>{
                                        this.setState({
                                            dataSource
                                        })
                                    },
                                    renderFooter:data=>{
                                        return (
                                            <div className="footer-total">
                                                <div className="footer-total-meta">
                                                    <div className="footer-total-meta-title">
                                                        <label>合计：</label>
                                                    </div>
                                                    <div className="footer-total-meta-detail">
                                                        金额：<span className="amount-code">{fMoney(data.totalAdjustAmount)}</span>
                                                        税额：<span className="amount-code">{fMoney(data.totalAdjustTaxAmount)}</span>
                                                        调整金额：<span className="amount-code">{fMoney(data.totalAmount)}</span>
                                                        调整税额：<span className="amount-code">{fMoney(data.totalTaxAmount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }} />

                </Form>
            </Card>
        )
    }
}

export default Form.create()(TableTaxStructure)