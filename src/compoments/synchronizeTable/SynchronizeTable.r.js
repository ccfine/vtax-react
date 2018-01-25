/**
 * Created by liurunbin on 2017/12/21.
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
        this.getDate({
            results: pagination.pageSize,
            current: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    render(){
        const {loaded,pagination}  = this.state;
        const {props} = this;
        return(
            <Table {...props.tableProps}
                   dataSource={props.data}
                   pagination={props.tableProps.pagination ? pagination : false}
                   onChange={this.handleTableChange}
                   loading={!loaded}
                   footer={props.tableProps.renderFooter ? (currentPageData)=>{
                       return props.tableProps.renderFooter(props.tableProps.footerDate)
                   } : null}
            />
        )
    }
}
