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
        summaryData:[]
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
            const currentPager = { ...this.state.pagination };
            currentPager.current = 1;
            this.mounted &&  this.setState({
                pagination: currentPager,
                updateKey: nextProps.updateKey,
            });
            this.fetch({},nextProps.url)
        }
    }
    fetch = (params = {},url) => {
        this.setState({ loaded: false });
        //const {props} = this;
        request.get(url || this.props.url,{
            params:{
                results: 10,
                ...params,
                ...this.props.filters
            }
        }).then(({data}) => {
            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = data.data.total;

                /* let summaryData = [{}];
                 let summaryFields = props.summaryFields;
                 if(summaryFields && summaryFields.length >0){
                     console.log(summaryFields)

                     data.data.records.forEach(item=>{
                         for(let key in item){
                             if(summaryFields.indexOf(key)){
                                 console.log(1)
                                 summaryData[0][key] = parseFloat(summaryData[0][key]) + parseFloat(item[key]);
                             }
                         }
                     })

                 }
                 console.log(summaryData)*/

                this.mounted && this.setState({
                    loaded: true,

                    /**
                     * 有的列表接口返回的结构不一样
                     * */
                    dataSource: data.data.records ? data.data.records : data.data.page.records,
                    //summaryData:summaryData,
                    pagination
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
        // const footer = props.footer? ()=><Table columns={props.tableProps.columns} dataSource={summaryData} pagination={false} showHeader={false} />: ()=>''
        return(
            <Table
                {...props.tableProps}
                dataSource={dataSource}
                pagination={props.tableProps.pagination ? pagination : false}
                onChange={this.handleTableChange}
                loading={!loaded}
            />
        )
    }
}
