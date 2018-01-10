/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Table,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
export default class AsyncTable extends Component{
    constructor(props){
        super(props);
        this.state={
            loaded:true,
            dataSource:[],
            pagination: {
                showSizeChanger:true,
                showQuickJumper:true,
                pageSize:props.tableProps.pageSize || 10,
                showTotal:total => `总共 ${total} 条`
            },
            summaryData:[],
            footerDate:{},
        }
    }
    static propTypes={
        tableProps:PropTypes.object.isRequired,
        updateKey:PropTypes.number,
        url:PropTypes.string.isRequired,
        filters:PropTypes.object
        //columns:PropTypes.array.isRequired
    }
    static defaultProps={
        updateKey:Date.now(),
    }
    componentWillReceiveProps(nextProps){
        console.log(this.props.updateKey, nextProps.updateKey)
        if(this.props.updateKey!==nextProps.updateKey){
            const currentPager = { ...this.state.pagination };
            currentPager.current = 1;
            this.mounted &&  this.setState({
                pagination: currentPager,
                updateKey: nextProps.updateKey,
            },()=>{
                this.fetch({},nextProps)
            });
        }
    }
    fetch = (params = {},nextProps) => {
        const props = nextProps || this.props;
        this.setState({ loaded: false });
        request.get(props.url,{
            params:{
                size: this.state.pagination.pageSize,
                ...params,
                ...props.filters
            }
        }).then(({data}) => {
            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = typeof data.data.total !== 'undefined' ? data.data.total : data.data.page.total;
                pagination.pageSize = typeof data.data.size !== 'undefined' ? data.data.size : data.data.page.size;
                this.mounted && this.setState({
                    loaded: true,
                    /**
                     * 有的列表接口返回的结构不一样
                     * */
                    dataSource: data.data.records ? data.data.records : data.data.page.records,
                    footerDate: data.data,
                    //summaryData:summaryData,
                    pagination
                });
            }else{
                message.error(data.msg)
                this.mounted && this.setState({
                    loaded: true
                });
            }

        }).catch(err=>{
            this.mounted && this.setState({
                loaded: true
            });
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            size: pagination.pageSize,
            current: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {loaded,dataSource,pagination,footerDate}  = this.state;
        const {props} = this;
        return(
            <Table
                {...props.tableProps}
                dataSource={dataSource}
                pagination={props.tableProps.pagination ? pagination : false}
                onChange={this.handleTableChange}
                loading={!loaded}
                footer={props.tableProps.renderFooter ? (currentPageData)=>{
                    return props.tableProps.renderFooter(footerDate)
                } : null}
            />
        )
    }
}
