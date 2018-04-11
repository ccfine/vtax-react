/**
 * Created by liurunbin on 2018/1/2.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import moment from 'moment'
import {AsyncTable} from 'compoments'
import {getFields} from 'utils'
class SearchTable extends Component{
    static propTypes = {
        searchOption:PropTypes.object,
        tableOption:PropTypes.object
    }
    constructor(props){
        super(props)
        this.state={
            /**
             * params条件，给table用的
             * */
            filters:{
                pageSize:20
            },

            /**
             * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
             * */
            tableUpDateKey:props.tableOption.key || Date.now(),
            visible:false,
            expand:true
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.tableOption.key !== nextProps.tableOption.key){
            this.setState({
                tableUpDateKey:nextProps.tableOption.key
            })
        }
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for(let key in values){
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangPicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }
                }
                this.setState({
                    selectedRowKeys:null,
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });

                // 选择数据改变
                this.props.tableOption && this.props.tableOption.rowSelection && this.props.tableOption.rowSelection.onChange();
            }
        });

    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,filters,expand} = this.state;
        const {searchOption,tableOption,children,actionOption} = this.props;
        return(
            <Layout style={{background:'transparent'}} >
                {
                    (searchOption || actionOption) && (
                        <Card
                                className="search-card"
                              bodyStyle={{
                                  padding:expand?'12px 16px':'0 16px'
                              }}
                              /*extra={
                                  <Icon
                                      style={{fontSize:24,color:'#ccc',cursor:'pointer'}}
                                      onClick={()=>{this.setState(prevState=>({expand:!prevState.expand}))}}
                                      type={`${expand?'up':'down'}-circle-o`} />
                              }*/
                              {...((searchOption&&searchOption.cardProps)?searchOption.cardProps:{bordered:false,bodyStyle:{padding:"0px"}})}
                        >
                            <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                                <Row>
                                    {
                                        searchOption && searchOption.fields && 
                                        getFields(this.props.form,searchOption.fields)
                                    }

                                    {
                                        searchOption && searchOption.fields && 
                                        (<Col span={8}>
                                        <Button size='small' style={{marginTop:5,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                        <Button size='small' style={{marginTop:5,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                                        </Col>)
                                    }
                                    <Col style={{paddingTop:5}} span={actionOption.span||2} offset={(searchOption && searchOption.fields)?6:(actionOption.span?(24-actionOption.span):22)}>
                                        {actionOption.body}
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }
                <Card
                      extra={tableOption.extra || null}
                      style={{marginTop:10}}
                      {...tableOption.cardProps}
                >
                    <AsyncTable url={tableOption.url}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    pageSize:tableOption.pageSize || 10,
                                    size:'small',
                                    columns:tableOption.columns,
                                    scroll:tableOption.scroll || undefined,
                                    rowSelection:tableOption.rowSelection||undefined
                                }} />
                </Card>
                {
                    children? children : null
                }
            </Layout>
        )
    }
}
export default Form.create({
    onValuesChange:(props,values)=>{
        //给外部一个获得搜索条件的回调
        props.searchOption.getFieldsValues && props.searchOption.getFieldsValues(values)
    }
})(SearchTable)