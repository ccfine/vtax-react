/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Table,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
export default class AsyncTable extends Component{
    state={
        loaded:true,
        dataSource:[],

        pagination: {
            showTotal:total => `总共 ${total} 条`
        },
    }
    static propTypes={
        tableProps:PropTypes.object.isRequired,
        updateKey:PropTypes.number,
        url:PropTypes.string.isRequired,
        filters:PropTypes.object
        //columns:PropTypes.array.isRequired
    }
    static defaultProps={
        updateKey:Date.now()
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            this.fetch()
        }
    }
    fetch = (params = {}) => {
        this.setState({ loaded: false });
        request.get(this.props.url,{
            params:{
                results: 10,
                ...params,
                ...this.props.filters
            }
        }).then(({data}) => {
            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = data.data.total;
                this.mounted && this.setState({
                    loaded: true,
                    dataSource: data.data.records,
                    pagination,
                });
            }else{
                message.error(data.msg)
                this.mounted && this.setState({
                    loaded: true
                });
            }

        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
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
        const {loaded,dataSource,pagination}  = this.state;
        const {props} = this;
        return(
            <Table {...props.tableProps} dataSource={dataSource} pagination={props.tableProps.pagination ? pagination : false} onChange={this.handleTableChange} loading={!loaded}/>
        )
    }
}
