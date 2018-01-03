/**
 * Created by liurunbin on 2018/1/2.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Layout,Card,Row,Col,Form,Button,Icon} from 'antd'
import moment from 'moment'
import {AsyncTable} from '../../index'
import {getFields} from '../../../utils'
class SearchTable extends Component{
    static propTypes = {
        searchOption:PropTypes.object,
        tableOption:PropTypes.object
    }
    state={
        /**
         * params条件，给table用的
         * */
        filters:{
            results:20
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,
        visible:false,
        modalConfig:{
            type:''
        },
        expand:true
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
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
            }
        });

    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,filters,expand} = this.state;
        const {searchOption,tableOption,children} = this.props;
        return(
            <Layout style={{background:'transparent'}} >
                {
                    searchOption && (
                        <Card title="查询条件"
                              bodyStyle={{
                                  padding:expand?'12px 16px':'0 16px'
                              }}
                              extra={
                                  <Icon
                                      style={{fontSize:24,color:'#ccc',cursor:'pointer'}}
                                      onClick={()=>{this.setState(prevState=>({expand:!prevState.expand}))}}
                                      type={`${expand?'up':'down'}-circle-o`} />
                              }
                              {...searchOption.cardProps}
                        >
                            <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                                <Row>
                                    {
                                        getFields(this.props.form,searchOption.fields)
                                    }

                                    <Col span={8}>
                                        <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                        <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }
                <Card title='查询结果'
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
                                    results:tableOption.results || 10,
                                    size:'middle',
                                    columns:tableOption.columns,
                                    scroll:tableOption.scroll || undefined
                                }} />
                </Card>
                {
                    children? children : null
                }
            </Layout>
        )
    }
}
export default Form.create()(SearchTable)