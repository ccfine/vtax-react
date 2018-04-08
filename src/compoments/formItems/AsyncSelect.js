/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Form,Select,Spin} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
import debounce from 'lodash/debounce'
const FormItem = Form.Item;
const Option = Select.Option
export default class AsyncSelect extends Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        initialValue:PropTypes.any,
        fieldTextName:PropTypes.string.isRequired,
        fieldValueName:PropTypes.string.isRequired,
        label:PropTypes.string.isRequired,
        url:PropTypes.string.isRequired,
        selectOptions:PropTypes.object,
        doNotFetchDidMount:PropTypes.bool,
        decoratorOptions:PropTypes.object,

        //外部条件，用来提供给外部控制该组件是否要异步获取信息的条件，可选
        fetchAble:PropTypes.any,

        transformData:PropTypes.func
    }
    static defaultProps={
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        },
        initialValue:'',
        label:'field',
        selectOptions:{

        },
        doNotFetchDidMount:false,
        decoratorOptions:{

        },
        fetchAble:true,

        transformData:data=>data
    }

    constructor(props){
        super(props)
        this.state={
            dataSource:[
            ],
            loaded:props.doNotFetchDidMount
        }
        this.onSearch = debounce(this.onSearch,300)
    }
    componentWillReceiveProps(nextProps){
        if(this.props.url !== nextProps.url){
            if(nextProps.fetchAble){
                this.fetch(nextProps.url)
            }
            if(!nextProps.decoratorOptions.initialValue){
                nextProps.form.resetFields([nextProps.fieldName])
                this.setState({
                    dataSource:[]
                })
            }

        }
    }
    componentDidMount(){
        !this.props.doNotFetchDidMount && this.fetch()
    }
    toggleLoaded=loaded=>{
        this.setState({
            loaded
        })
    }
    fetch(url){
        this.toggleLoaded(false)
        request.get(url || this.props.url)
            .then(({data}) => {
                if(data.code===200 && this.mounted){
                    this.toggleLoaded(true)
                    const result = data.data.records || data.data;
                    this.setState({
                        dataSource:this.props.transformData(result)
                    })
                }
            });
    }
    mounted = true
    componentWillUnmount(){
        this.mounted=null;
    }
    onSearch = (value) => {
        const { selectOptions:{ showSearch }, customValues, searchType } = this.props;
        if(showSearch){

            if(searchType==='itemName'){
                //项目名称
                request.get(`/project/listByName`,{
                    params:{
                        mainId:customValues.mainId,
                        itemName:value,
                        size:100
                    }
                })
                    .then(({data}) => {
                        if(data.code===200 ){

                            const result = data.data.records;
                            const newData = [];
                            result.forEach((r) => {
                                newData.push({
                                    value: `${r.id}`,
                                    text: r.itemName,
                                });
                            });
                            this.setState({
                                dataSource:result
                            })
                        }
                    });
            }

        }
    }
    render(){
        const {dataSource,loaded}=this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue,fieldTextName,fieldValueName,label,selectOptions,decoratorOptions} = this.props;
        return(
            <Spin spinning={!loaded}>
                <FormItem label={label} {...formItemStyle}>
                    {getFieldDecorator(fieldName,{
                        initialValue,
                        ...decoratorOptions
                    })(
                        <Select
                            style={{ width: '100%' }}
                            onSearch={this.onSearch}
                            {...selectOptions}
                        >
                            {
                                dataSource.map((item,i)=>(
                                    <Option key={i} value={item[fieldValueName]}>{item[fieldTextName]}</Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>
            </Spin>
        )
    }
}