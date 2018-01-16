/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,message} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields,htmlDecode,regRules,request} from '../../../../utils'
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

class InputTaxStructure extends Component {
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
        tableDateKey:Date.now(),
        visible:false,
        dataList:[],
    }

    /*handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                this.fetch(data);
            }
        });
    }*/
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                if(type==='提交'){
                    url = `/account/income/taxstructure/submit/${data.mainId}/${data.authMonth}`;
                    this.requestPost(url,type);
                }else if(type === '撤回') {
                    url = `/account/income/taxstructure/restore/${data.mainId}/${data.authMonth}`;
                    this.requestPost(url,type);
                }else if(type==='重算'){
                    url = '/account/income/taxstructure/reset';
                    this.fetch(url,data);
                }else{
                    //url = '/account/income/taxstructure/list';
                    //this.fetch(url,data);
                }
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        tableDateKey:Date.now()
                    })
                });
            }
        });
    }
    requestPost=(url,type)=>{
        request.post(url)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    fetch=(url,params = {})=>{
        request.get(url,{
            params:{
                ...params
            }
        })
            .then(({data}) => {
                if(data.code===200){
                    this.setState({
                        dataList:data.data.page.records
                    })
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
            tableDateKey:Date.now()
        })
    }
    render(){
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
                                    },
                                ])
                            }

                            <Col span={6}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" onClick={(e)=>this.handleSubmit(e,'查询')}>查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <TableTaxStructureForm
                        key={this.state.tableDateKey}
                        tableUpDateKey={this.state.tableDateKey}
                        filters={this.state.filters}
                        dataList={this.state.dataList}
                        refreshTable={this.refreshTable}
                        handleSubmit={this.handleSubmit}
                    />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(InputTaxStructure)


const max50={
    max:regRules.input_length_50.max, message: regRules.input_length_50.message,
}
const TextAreaAutoSize = {
    autosize:{ minRows: 2, maxRows: 6 }
}
class TableTaxStructure extends Component {
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
    handleSaveSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            const newData = [...this.props.dataList];
            let arrList = newData.map((item,i)=>{
                return {
                    ...item,
                    ...values.data[i+1],
                }
            });

            console.log(arrList);

            if (!err) {
                request.post('/account/income/taxstructure/save',{list:arrList})
                    .then(({data})=>{
                        if(data.code===200){
                            const props = this.props;
                            message.success('保存成功!');
                            props.refreshTable();
                            this.props.form.resetFields()
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })

            }
        });
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps.tableUpDateKey , this.props.tableUpDateKey)
    }
    render(){
        const props = this.props;
        return (
            <Card extra={

                props.dataList.length > 0 && parseInt(props.dataList[0].status, 0)=== 1 ?
                    <div>
                        <Button size="small" style={buttonStyle} onClick={(e)=>this.props.handleSubmit(e,'保存')}><Icon type="save" />保存</Button>
                        <Button size="small" style={buttonStyle} onClick={(e)=>this.props.handleSubmit(e,'提交')}><Icon type="check" />提交</Button>
                        <Button size="small" style={buttonStyle} onClick={(e)=>this.props.handleSubmit(e,'重算')}><Icon type="rollback" />重算</Button>
                    </div>
                    :
                    <div>
                        <Button size="small" style={buttonStyle} onClick={(e)=>this.handleSubmit(e,'撤回')}><Icon type="rollback" />撤回提交</Button>
                    </div>
            }
                  style={{marginTop:10}}>
                <Form onSubmit={this.handleSaveSubmit}>
                    <AsyncTable url="/account/income/taxstructure/list"
                                updateKey={props.tableUpDateKey}
                                filters={props.filters}
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
                                                    金额：<span style={code}>{data.totalAdjustAmount}</span>
                                                    税额：<span style={code}>{data.totalAdjustTaxAmount}</span>
                                                    价税：<span style={code}>{data.totalAmount}</span>
                                                    总价：<span style={code}>{data.totalTaxAmount}</span>
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
const TableTaxStructureForm = Form.create()(TableTaxStructure)

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
                                rules
                            }
                        }
                    ])
                    : value
            }
        </div>
    );
}