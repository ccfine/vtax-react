/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon} from 'antd'
import {SynchronizeTable} from '../../../../compoments'
import {getFields,htmlDecode,regRules} from '../../../../utils'
import data from './tsconfig.json'
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
        tableUpDateKey:Date.now(),
        visible:false,
        data:data.data,
    }

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                console.log(data)
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });
    }
    componentDidMount(){
        this.updateTable()
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    updateTable=()=>{
        this.handleSubmit()
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
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        }
                                    },
                                ])
                            }

                            <Col span={6}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" onClick={this.handleSubmit}>查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <TableTaxStructureForm key={this.state.tableUpDateKey} {...this.state} />
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

    state = {

        editable: true,
    }

    columns = [
        {
            title: '抵扣明细',
            dataIndex: 'dkxmMc',
            width:100,
            render:text=><div dangerouslySetInnerHTML={{  __html: htmlDecode(text) }}></div>,
        },{
            title: '金额',
            dataIndex: 'je',
            width:100,
            render: (text, record) =>{
                if(parseInt(text,0) !== 0){
                    return text;
                }else{
                    return this.renderColumns(text, record, `data[${record.key}].je`,'numeric')
                }
            },
        },{
            title: '税额',
            dataIndex: 'se',
            width:100,
            render: (text, record) =>{
                if(parseInt(text,0) !== 0){
                    return text;
                }else{
                    return this.renderColumns(text, record, `data[${record.key}].se`,'numeric')
                }
            },
        }, {
            title: '调整金额',
            dataIndex: 'tzje',
            width:100,
            render: (text, record) =>{
                if(parseInt(text,0) !== 0){
                    return text;
                }else{
                    return this.renderColumns(text, record, `data[${record.key}].tzje`,'numeric')
                }
            },
        },{
            title: '调整税额',
            width:100,
            dataIndex: 'tzse',
            render: (text, record) =>{
                if(parseInt(text,0) !== 0){
                    return text;
                }else{
                    return this.renderColumns(text, record, `data[${record.key}].tzse`,'numeric')
                }
            },
        },{
            title: '调整说明',
            width:200,
            dataIndex: 'tzsm',
            render: (text, record) =>{
                if(text !== null){
                    return text;
                }else{
                    return this.renderColumns(text, record, `data[${record.key}].tzsm`, 'textArea',[max50],TextAreaAutoSize)
                }
            },
        }
    ];

    renderColumns(text, record, column,type,rules=[],TextAreaAutoSize={}) {
        return (
            <EditableCell
                editable={this.state.editable}
                value={text}
                form={this.props.form}
                column={column}
                type={type}
                rules={rules}
                componentProps={TextAreaAutoSize}
                //onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    handleSaveSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            const newData = [...this.props.data];
            let arrList = newData.map((item,i)=>{
                return {
                    ...item,
                    ...values.data[i+1],
                }
            });
            //第二种实现方式
            /*newData.forEach((data,j) => {
                values.data.forEach((item,i) => {
                    if(j===i){
                        return arrList.push({
                            ...data,
                            ...item
                        })
                    }

                })
            })*/
            console.log(arrList);
            if (!err) {
                this.setState({
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now(),
                        editable:false
                    })
                });
            }
        });
    }
    addKey=(item)=>{
        const data = [];
        for (let i = 0; i<item.length ; i++) {
            data.push({
                key: i.toString(),
                ...item[i]
            });
        }
        return data
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps);

    }
    render(){
        const props = this.props;
        console.log(props.tableUpDateKey)
        return (
            <Card extra={<div>
                <Button size="small" style={buttonStyle} onClick={this.handleSaveSubmit}><Icon type="save" />保存</Button>
                <Button size="small" style={buttonStyle}><Icon type="check" />提交</Button>
                <Button size="small" style={buttonStyle}><Icon type="rollback" />撤回提交</Button>
            </div>}
                  style={{marginTop:10}}>
                <Form onSubmit={this.handleSaveSubmit}>
                    <SynchronizeTable data={this.addKey(props.data)}
                                      updateKey={props.tableUpDateKey}
                                      filters={props.filters}
                                      tableProps={{
                                          rowKey:record=>record.id,
                                          pagination:false,
                                          size:'small',
                                          columns:this.columns,
                                          renderFooter:data=>{
                                              return (
                                                  <div>
                                                      <div style={{marginBottom:10}}>
                                                          <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                          金额：<span style={code}>12312414</span>
                                                          税额：<span style={code}>12312414</span>
                                                      </div>
                                                  </div>
                                              )
                                          }
                                      }}
                    />
                    {/*<AsyncTable url="/income/invoice/collection/list"
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
                                                        金额：<span style={code}>{data.pageAmount}</span>
                                                        税额：<span style={code}>{data.pageTaxAmount}</span>
                                                    </div>
                                                </div>
                                            )
                                        },
                                    }} />*/}
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