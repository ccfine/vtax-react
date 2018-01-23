/**
 * Created by liuliyuan on 18/1/16.
 */
import React,{Component} from 'react'
import {Card,Form,Button,Icon,message} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields,htmlDecode,regRules,request,fMoney} from '../../../../utils'
const spanPaddingRight={
    paddingRight:30
}
const buttonStyle={
    marginRight:5
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
const max50={
    max:regRules.input_length_50.max, message: regRules.input_length_50.message,
}
const TextAreaAutoSize = {
    autosize:{ minRows: 2, maxRows: 6 }
}
const EditableCell = ({ editable, value, form, column, type,rules,componentProps }) => {
    return (
        <div>
            {
                editable
                    ? getFields(form,[
                    {
                        fieldName:`${column}`,
                        type:type,
                        span:24,
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
                            initialValue:value,
                            rules,
                        }
                    }
                ])
                    : value
            }
        </div>
    );
}


class TableTaxStructure extends Component {
    state={
        dataSource:[],
        resetDataSource:[],
        footerDate:{},
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
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].amount`,'numeric')
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            width:100,
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].taxAmount`,'numeric')
        }, {
            title: '调整金额',
            dataIndex: 'adjustAmount',
            width:100,
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].adjustAmount`,'numeric')
        },{
            title: '调整税额',
            width:100,
            dataIndex: 'adjustTaxAmount',
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].adjustTaxAmount`,'numeric')
        },{
            title: '调整说明',
            width:200,
            dataIndex: 'adjustDescription',
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].adjustDescription`, 'textArea',[max50],TextAreaAutoSize)
        }
    ];

    renderColumns(text, record, column,type,rules=[],TextAreaAutoSize={}) {
        return  parseInt(record.status, 0) === 1 ? <EditableCell
            editable={!record.summary}
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
                switch (type){
                    case '保存':
                        const newData = [...this.state.dataSource];
                        let arrList = newData.map((item,i)=>{
                            return {
                                ...item,
                                ...values.data[i],
                            }
                        });
                        //console.log(arrList);
                        url = '/account/income/taxstructure/save';
                        this.requestPost(url,type,{list:arrList});
                        break;
                    case '提交':
                        url = `/account/income/taxstructure/submit/${props.filters.mainId}/${props.filters.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '撤回':
                        url = `/account/income/taxstructure/restore/${props.filters.mainId}/${props.filters.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '重算':
                        url = '/account/income/taxstructure/reset';
                        this.fetch(url,props.filters);
                        break;
                    default:
                        this.setState({
                            filters:props.filters,
                        },()=>{
                            this.props.refreshTable()
                        });

                }
            }
        });
    }
    requestPost=(url,type,data={})=>{
        request.post(url,data)
            .then(({data})=>{
                if(data.code===200){
                    const props = this.props;
                    message.success(`${type}成功!`);
                    props.refreshTable();
                    this.props.form.resetFields()
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    fetch=(url,params = {})=>{
        request.get(url,{
            params:params
        })
            .then(({data}) => {
                if(data.code===200){
                    message.success('重算成功!');
                    this.setState({
                        resetDataSource:data.data.page.records,
                        footerDate:data.data,
                        isShowResetDataSource:true
                    })
                    this.props.form.resetFields()
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            });
    }
    componentWillReceiveProps(nextProps){
        //console.log(nextProps.tableUpDateKey, this.props.tableUpDateKey)
        /*if(nextProps.tableUpDateKey !== this.props.tableUpDateKey){

        }*/
    }
    render(){
        const props = this.props;
        const {dataSource,resetDataSource,footerDate,isShowResetDataSource} = this.state;
        return (
            <Card extra={
                dataSource.length > 0 && <div>
                    {
                        parseInt(dataSource[0].status, 0)=== 1 ?
                            <div>
                                <Button size="small" style={buttonStyle} onClick={(e)=>this.handleSubmit(e,'保存')}><Icon type="save" />保存</Button>
                                <Button size="small" style={buttonStyle} onClick={(e)=>this.handleSubmit(e,'提交')}><Icon type="check" />提交</Button>
                                <Button size="small" style={buttonStyle} onClick={(e)=>this.handleSubmit(e,'重算')}><Icon type="rollback" />重算</Button>
                            </div>
                            :
                            <div>
                                <Button size="small" style={buttonStyle} onClick={(e)=>this.handleSubmit(e,'撤回')}><Icon type="rollback" />撤回提交</Button>
                            </div>
                    }
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
                                    dataSource: (isShowResetDataSource && resetDataSource) || undefined,
                                    footerDate: (isShowResetDataSource && footerDate) || undefined,
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
                                                    金额：<span style={code}>{fMoney(data.totalAdjustAmount)}</span>
                                                    税额：<span style={code}>{fMoney(data.totalAdjustTaxAmount)}</span>
                                                    调整金额：<span style={code}>{fMoney(data.totalAmount)}</span>
                                                    调整税额：<span style={code}>{fMoney(data.totalTaxAmount)}</span>
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