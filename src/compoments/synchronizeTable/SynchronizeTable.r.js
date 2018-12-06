/**
 * Created by liuliyuan on 2017/12/21.
 */
import React,{Component} from 'react';
import {Table} from 'antd'
import PropTypes from 'prop-types'
export default class SynchronizeTable extends Component{
    state={
        loaded:true,
        //dataSource:[],
        pagination: {
            showTotal:total => `总共 ${total} 条`
        },
    }
    static propTypes={
        tableProps:PropTypes.object.isRequired,
        updateKey:PropTypes.number,
        //data:PropTypes.array.isRequired,
        //columns:PropTypes.array.isRequired
    }
    static defaultProps={
        updateKey:Date.now()
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            const currentPager = { ...this.state.pagination };
            currentPager.current = 1;
            this.mounted &&  this.setState({
                pagination: currentPager,
                updateKey: nextProps.updateKey,
            });
            this.getDate()
        }
    }

    getDate = () => {
        this.setState({ loaded: false });
        const pagination = { ...this.state.pagination };
        pagination.total = this.props.data.length;

        this.setState({
            loaded: true,
            pagination,
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        //设置去掉排序默认设置的值
        let sor = sorter.order ? sorter.order.replace('end', '') : undefined;
        this.getDate({
            results: pagination.pageSize,
            current: pagination.current,
            orderByField: sorter.field,
            isAsc: sor ? sor === 'asc' : undefined,
            ...filters,
        });
    }
    render(){
        const {loaded,pagination}  = this.state;
        const {props} = this;
        return(
            <Table {...props.tableProps}
                    bordered={props.tableProps.bordered ? props.tableProps.bordered : true}
                   dataSource={props.data}
                   pagination={props.tableProps.pagination ? pagination : false}
                   onChange={this.handleTableChange}
                   loading={props.loaded ? !props.loaded : !loaded}
                   footer={props.tableProps.renderFooter ? (currentPageData)=>{
                       return props.tableProps.renderFooter(props.tableProps.footerDate)
                   } : null}
            />
        )
    }
}
