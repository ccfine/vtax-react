import React from 'react'
import {message} from 'antd'
import PropTypes from 'prop-types'
import Table from './PaginationTable.r'
import {request} from 'utils'

export default class FetchTable extends React.Component{
    static propTypes={
        url:PropTypes.string.isRequired,
        tableProps:PropTypes.object.isRequired,
        updateKey:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
        filters:PropTypes.object,
        doNotFetchDidMount:PropTypes.bool,
    }
    static defaultProps={
        updateKey:Date.now(),
    }
    constructor(props){
        super(props);
        this.state={
            dataSource:null,
            countSource:null,
            pagination:{
                total:0,
                current:1,
                pageSize:100,
                onChange:this.pageChange,
                onShowSizeChange:this.sizeChange,
            },
            loading:false
        };
    }
    componentDidMount(){
        this.props.doNotFetchDidMount || this.fetch(this.props.url, 1, 100);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey !== nextProps.updateKey){
            this.fetch(this.props.url, 1, this.state.pageSize,nextProps);
        }
    }
    pageChange = (page, pageSize)=>{
        this.fetch(this.props.url, page, pageSize);
    }
    sizeChange = (current, size)=>{
        this.fetch(this.props.url, 1, size);
    }
    fetch = (url,current,size,nextProps)=>{
        const props = nextProps || this.props;
        this.mounted && this.setState({ loading: true ,pagination:{...this.state.pagination, current:current,size:size}});
        request.get(url,{
            params:{
                size,
                current,
                ...props.filters
            }
        }).then(({data}) => {
            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = typeof data.data.total !== 'undefined' ? data.data.total : data.data.page.total;
                pagination.pageSize = typeof data.data.size !== 'undefined' ? data.data.size : data.data.page.size;
                
                let dataSource = data.data.records ? data.data.records : data.data.page.records;

                let countSource = props.tableProps.renderCount?props.tableProps.renderCount(data.data):null;

                /** 给外部一个回调方法，可以得到每次变更后的data*/
                props.tableProps.onDataChange && props.tableProps.onDataChange(dataSource)

                this.mounted && this.setState({
                    loading: false,
                    /**
                     * 有的列表接口返回的结构不一样
                     * */
                    dataSource,
                    countSource,
                    pagination
                });

                /**假如设置了单选或多选，重新异步请求数据的时候选中项也要清空，也要主动触发一下selectedRowKeys的onChange*/
                /**参考AsyncTable.r.js 文件的 props.tableProps.onRowSelect && props.tableProps.onRowSelect([],[]) */
                /**基于以上需求，增加一个回调，不在这里做selection选择状态的管理 */
                /**props.refresh && props.refresh();**/
                /**以 首页/增值税管理/进项管理/进项发票采集 为例子修改 */
                props.tableProps.rowSelection && props.tableProps.rowSelection.onChange && props.tableProps.rowSelection.onChange(undefined,undefined);
            }else{
                message.error(data.msg)
                this.mounted && this.setState({
                    loading: false,
                });
            }

        }).catch(err=>{
            this.mounted && this.setState({
                loading: false,
            });
        });
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {dataSource,countSource,loading} = this.state;
        const pagination = this.props.tableProps.pagination?this.state.pagination:false;
        return <Table 
                        {...this.props.tableProps}
                        dataSource={dataSource} 
                        countSource={countSource} 
                        loading={loading}
                        pagination ={pagination}
         />
    }
}