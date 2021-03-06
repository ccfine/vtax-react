/**
 * Created by liurunbin on 2018/1/2.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Layout,Card,Row,Col,Form,Button,Spin} from 'antd'
import moment from 'moment'
import {AsyncTable} from '../../index'
import {getFields} from 'utils'
class SearchTable extends Component{
    static propTypes = {
        searchOption:PropTypes.object,
        tableOption:PropTypes.object,
        spinning:PropTypes.bool,
        doNotFetchDidMount:PropTypes.bool,
        backCondition:PropTypes.func,// 返回查询条件,
        beforeSearch:PropTypes.func,
    }
    static defaultProps = {
        spinning:false,
        doNotFetchDidMount:false,
        searchOption:{},
    }
    constructor(props){
        super(props)
        this.state={
            /**
             * params条件，给table用的
             * */
            filters:{
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
            /*this.setState({
                tableUpDateKey:nextProps.tableOption.key,
            })*/
            this.handleSubmit()
        }

        if(nextProps.searchOption){
            for(let key in nextProps.searchOption.filters){
                if(nextProps.searchOption.filters[key] !== this.props.searchOption.filters[key]){
                    this.mounted && this.setState({
                        filters:nextProps.searchOption.filters,
                    })
                }
            }
        }
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                for(let key in values){
                    if(typeof values[key] === 'object' && values[key]!==null){
                        if(("key" in values[key]) && ("label" in values[key])){
                            values[`${key}Id`] = values[key].key;
                            delete values[key];
                        }
                    }
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }

                    /**
                     * 判断如果是时间控件 rangePicker 只是值为空的时候需要把双值设为undefined，因为下一次的filter
                     * 会与上一次的filter合并，这一次的rangePicker值为空的时候就会导致合并后留下上次选择过的值，导致条件出错
                     * */
                    if(Array.isArray( values[key] ) && values[key].length === 0){
                        values[`${key}Start`] = undefined;
                        values[`${key}End`] = undefined;
                    }

                    if(moment.isMoment(values[key])){
                        if(key === 'taxMonth' || key === 'authMonth' || key === 'partTerm' || key === 'deductedPeriod'){
                            //格式化一下时间 YYYY-MM类型
                            if(moment(values[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                                values[key] = values[key].format('YYYY-MM');
                            }
                        }else{
                            if(moment(values[key].format('YYYY-MM-DD'),'YYYY-MM-DD',true).isValid()){
                                values[key] = values[key].format('YYYY-MM-DD');
                            }
                        }
                    }
                }

                this.mounted && this.setState(prevState=>({
                    selectedRowKeys:null,
                    filters:{
                        //合并上次filters的原因是组件会接收外部的额外filter条件，如果不合并就会忽略到外部的条件
                        ...prevState.filters,
                        ...values
                    }
                }),()=>{
                    this.mounted && this.setState({
                        tableUpDateKey:Date.now()
                    })
                });

                // 把查询条件返回回去
                this.props.backCondition && this.props.backCondition(values)
            }
        });

    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        /** 延迟100ms是因为如果这个弹窗里面如果包含SearchTable,并且table里有radio单选
         * 就会出现radio对不齐的情况出现，因为radio外层是动态计算位置，可能原因是modal弹出时需要时间导致计算的举距离有偏差
         */
        !this.props.doNotFetchDidMount && setTimeout(this.updateTable, 100);
        this.props.searchOption && this.props.searchOption.filters && this.setState({
            filters:this.props.searchOption.filters
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render() {
        const {tableUpDateKey,filters,expand} = this.state;
        const {searchOption,tableOption,children,form,spinning,style} = this.props;
        return(
            <Layout style={{background:'transparent',...style}} >
                <Spin spinning={spinning}>
                    {
                        searchOption && (
                            <Card
                                className="search-card"
                                bodyStyle={{
                                    padding:expand?'8px 16px 0 16px':'0 16px'
                                }}
                                bordered={false}
                                /*extra={
                                 <Icon
                                 style={{fontSize:24,color:'#ccc',cursor:'pointer'}}
                                 onClick={()=>{this.setState(prevState=>({expand:!prevState.expand}))}}
                                 type={`${expand?'up':'down'}-circle-o`} />
                                 }*/
                                {...searchOption.cardProps}
                            >
                                <Form className="table-search-form" onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                                    <Row>
                                        {
                                            getFields(form,searchOption.fields)
                                        }
                                        <Col style={{width:'100%',textAlign:'right'}}>
                                            <Button size='small' style={{margin:'4px 0 4px 10px'}} type="primary" htmlType="submit">查询</Button>
                                            <Button size='small' style={{margin:'4px 0 4px 10px'}} onClick={()=>{
                                                form.resetFields()
                                                this.setState({filters:{}})
                                                searchOption.onResetFields && searchOption.onResetFields();

                                                //手动触发一下是因为使用resetFields()不会触发form的onValuesChange
                                                searchOption.getFieldsValues && searchOption.getFieldsValues({})
                                                searchOption.onFieldsChange && searchOption.onFieldsChange({})
                                            }}>重置</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        )
                    }
                    <Card
                        extra={tableOption.extra || null}
                        style={{marginTop:6}}
                        bordered={false}
                        {...tableOption.cardProps}
                        bodyStyle={{paddingBottom:( tableOption.pagination || tableOption.pageSize)?0:8}}
                    >
                        <AsyncTable url={tableOption.url}
                                    updateKey={tableUpDateKey}
                                    filters={filters}
                                    tableProps={{
                                        rowKey:record=>record[tableOption.rowKey] || record.id,
                                        dataSource:tableOption.dataSource || tableOption.dataSource || undefined,
                                        pagination:typeof tableOption.pagination === 'undefined' ? true : tableOption.pagination,
                                        pageSize:tableOption.pageSize || 100,
                                        size:'small',
                                        onRow:tableOption.onRow || undefined,
                                        rowSelection:tableOption.rowSelection || tableOption.onRowSelect || undefined,
                                        onRowSelect:tableOption.onRowSelect || undefined,
                                        columns:tableOption.columns,
                                        onSuccess:tableOption.onSuccess || undefined,
                                        scroll:tableOption.scroll || undefined,
                                        onDataChange:tableOption.onDataChange || undefined,
                                        onTotalSource:tableOption.onTotalSource || undefined,
                                        renderFooter:tableOption.renderFooter || undefined
                                    }} />
                    </Card>
                </Spin>
                {
                    children ? children : null
                }
            </Layout>
        )
    }
}
export default Form.create({
    onValuesChange:(props,values)=>{
        //给外部一个获得搜索条件的回调
        props.searchOption.getFieldsValues && props.searchOption.getFieldsValues(values)
        props.searchOption.onFieldsChange && props.searchOption.onFieldsChange(values)
    }
})(SearchTable)