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
            selectedRowKeys: []
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
        if(this.props.updateKey!==nextProps.updateKey){
            const currentPager = { ...this.state.pagination };
            currentPager.current = 1;
            this.mounted &&  this.setState({
                pagination: currentPager
            },()=>{
                this.fetch({},nextProps)
            });
        }
    }
    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys });
        this.props.tableProps.onRowSelect && this.props.tableProps.onRowSelect(selectedRowKeys,selectedRows)
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

                let dataSource = data.data.records ? data.data.records : data.data.page.records;

                /** 给外部一个回调方法，可以得到每次变更后的data*/
                props.tableProps.onDataChange && props.tableProps.onDataChange(dataSource)

                this.mounted && this.setState({
                    loaded: true,
                    /**
                     * 有的列表接口返回的结构不一样
                     * */
                    dataSource,
                    footerDate: data.data,
                    selectedRowKeys:[],
                    //summaryData:summaryData,
                    pagination
                });

                /**假如设置了单选或多选，重新异步请求数据的时候选中项也要清空，也要主动触发一下selectedRowKeys的onChange*/
                props.tableProps.onRowSelect && props.tableProps.onRowSelect([],[])
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
        const {loaded,dataSource,pagination,footerDate,selectedRowKeys}  = this.state;
        const {props} = this;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            fixed:true,
            ...props.tableProps.rowSelection
        };
        return(
            <Table
                {...props.tableProps}
                dataSource={typeof props.tableProps.dataSource === 'undefined' ? dataSource : props.tableProps.dataSource}
                rowSelection={ ( props.tableProps.onRowSelect || props.tableProps.rowSelection ) ? rowSelection : null}
                pagination={props.tableProps.pagination ? pagination : false}
                onChange={this.handleTableChange}
                loading={!loaded}
                footer={props.tableProps.renderFooter ? (currentPageData)=>{
                    return props.tableProps.renderFooter(typeof props.tableProps.dataSource === 'undefined' ? footerDate : props.tableProps.footerDate)
                } : null}
            />
        )
    }
}
