/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Table,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
import './styles.module.less'
export default class AsyncTable extends Component{
    constructor(props){
        super(props);
        this.state={
            loaded:true,
            dataSource:[],
            pagination: {
                showSizeChanger:true,
                showQuickJumper:true,
                pageSize:props.tableProps.pageSize || 100,
                showTotal:total => `总共 ${total} 条`,
                pageSizeOptions:['100','200','300','400','500']
            },
            summaryData:[],
            footerDate:{},
            totalSource:{},
            selectedRowKeys: []
        }
    }
    static propTypes={
        tableProps:PropTypes.shape({
            clearSelectedRowAfterFetch:PropTypes.bool,
            bordered:PropTypes.bool,
        }),
        updateKey:PropTypes.number,
        url:PropTypes.string.isRequired,
        filters:PropTypes.object
        //columns:PropTypes.array.isRequired
    }
    static defaultProps={
        tableProps:{
            clearSelectedRowAfterFetch:true,
            bordered:true,
        },
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
    onSelectChange = (selectedRowKeys,selectedRowData) => {
        this.setState({ selectedRowKeys });
        this.props.tableProps.onRowSelect && this.props.tableProps.onRowSelect(selectedRowKeys,selectedRowData)
    }
    fetch = (params = {},nextProps) => {
        const props = nextProps || this.props;
        this.setState({ loaded: false });
        const composeParams = {
            size: this.state.pagination.pageSize,
            ...params,
            ...props.filters
        };
        request.get(props.url,{
            params:composeParams
        }).then(({data}) => {

            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = typeof data.data.total !== 'undefined' ? data.data.total : data.data.page.total;
                pagination.pageSize = typeof data.data.size !== 'undefined' ? data.data.size : data.data.page.size;

                let dataSource = data.data.records ? data.data.records : data.data.page.records;
                let totalSource = {...data.data, page:undefined};

                /** 给外部一个回调方法，可以得到每次变更后的data*/
                props.tableProps.onDataChange && props.tableProps.onDataChange(dataSource)

                /** 给外部一个回调方法，可以得到每次变更后的合计和总计*/
                props.tableProps.onTotalSource && props.tableProps.onTotalSource(totalSource)

                this.mounted && this.setState({
                    loaded: true,
                    /**
                     * 有的列表接口返回的结构不一样
                     * */
                    //dataSource:[...dataSource,{id:'sss'}],
                    dataSource,
                    totalSource,
                    footerDate: data.data,
                    selectedRowKeys:[],
                    //summaryData:summaryData,
                    pagination
                },()=>{
                    /**
                     * 成功之后回调，返回参数和数据
                     * */
                    this.props.tableProps.onSuccess && this.props.tableProps.onSuccess(composeParams,this.state.dataSource)
                });

                /**假如设置了单选或多选，重新异步请求数据的时候选中项也要清空，也要主动触发一下selectedRowKeys的onChange*/
                props.tableProps.clearSelectedRowAfterFetch && props.tableProps.onRowSelect && props.tableProps.onRowSelect([],[])
            }else{
                message.error(data.msg)
                /** 给外部一个回调方法，可以得到每次变更后的data*/
                props.tableProps.onDataChange && props.tableProps.onDataChange([])
                props.tableProps.onTotalSource && props.tableProps.onTotalSource({})
                this.mounted && this.setState({
                    loaded: true,
                    dataSource:[],
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
        //设置去掉排序默认设置的值
        let sor = sorter.order ? sorter.order.replace('end', '') : undefined;
        console.log(sor)
        this.fetch({
            size: pagination.pageSize,
            current: pagination.current,
            orderByField: sorter.field,
            asc: sor ? sor === 'asc' : undefined,
            ...filters,
            //...this.props.filters.values,
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
            <div ref="asyncTable">
                <Table
                    className="apply-form-list-table"
                    {...props.tableProps}
                    bordered={props.tableProps.bordered ? props.tableProps.bordered : true}
                    dataSource={typeof props.tableProps.dataSource === 'undefined' ? dataSource : props.tableProps.dataSource}
                    rowSelection={ ( props.tableProps.onRowSelect || props.tableProps.rowSelection ) ? rowSelection : null}
                    pagination={props.tableProps.pagination ? pagination : false}
                    onChange={this.handleTableChange}
                    loading={!loaded}
                    footer={props.tableProps.renderFooter ? (currentPageData)=>{
                        return props.tableProps.renderFooter(typeof props.tableProps.dataSource === 'undefined' ? footerDate : props.tableProps.footerDate)
                    } : null}
                />
            </div>
        )
    }
}
