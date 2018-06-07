/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Form,Select,Spin,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
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
        whetherShowAll:PropTypes.bool,
        notShowAll:PropTypes.bool,
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
        whetherShowAll:false,
        notShowAll:false,
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
    fetch(url,params={}){
        this.toggleLoaded(false)
        request.get(url || this.props.url,{params})
            .then(({data}) => {
                if(data.code===200 && this.mounted){
                    this.toggleLoaded(true)
                    const result = data.data.records || data.data;
                    this.setState({
                        dataSource:this.props.transformData(result)
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
            })
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
                            this.setState({
                                dataSource: result
                            })
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    });
            }else{
                this.fetch(undefined,{
                    name:value,
                    size:100,
                })
            }

        }
    }
    onChange=(value)=>{
        const { selectOptions:{ showSearch }, searchType } = this.props;
        // 当选中某条数据后，查询条件清空，将所有数据获取出来（缺点：如果用户想选择查询出来的数据中的多条就没办法了） 后期调研下searchType!=='itemName'
        if(showSearch && searchType!=='itemName'){
            this.fetch(undefined,{
                name:'',
                size:100,
            })
        }
    }
    render(){
        const {dataSource,loaded}=this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue,fieldTextName,fieldValueName,label,selectOptions,decoratorOptions,whetherShowAll,notShowAll} = this.props;
        //TODO:为了设置所有不是必填的select都加上一个全部默认选项  notShowAll:是否添加无或者全部
        let optionsData = [], initialValues;
        if(notShowAll === true){
            optionsData = dataSource;
        }else{
            const isShowAll = decoratorOptions && decoratorOptions.rules && decoratorOptions.rules.map(item=>item.required)[0] === true,
            newData = dataSource.length > 0 ? [{[fieldTextName]: whetherShowAll ? '无' : '全部', [fieldValueName]:''}].concat(dataSource) : dataSource;
        initialValues = initialValue || (isShowAll ? undefined : '');
        optionsData = isShowAll ? dataSource :  newData;
    }
        return(
            <Spin spinning={!loaded}>
                <FormItem label={label} {...formItemStyle}>
                    {getFieldDecorator(fieldName,{
                        initialValue: initialValues,
                        ...decoratorOptions
                    })(
                        <Select
                            style={{ width: '100%' }}
                            onSearch={this.onSearch}
                            onChange={this.onChange}
                            placeholder={`请选择${label}`}
                            {...selectOptions}
                        >
                            {
                                optionsData.map((item,i)=>(
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