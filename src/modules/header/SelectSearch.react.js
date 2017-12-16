/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 14:38
 * description  :
 */
import React,{Component} from 'react';
import {  Form,Select,Spin } from 'antd';
import {connect} from 'react-redux'
import {saveCodeList} from '../../redux/ducks/user'

const Option = Select.Option;
const FormItem = Form.Item;
class SelectSearch extends Component {
    state = {
        data:[
            {
                uuid:1,
                label:'select outp 1',
                value:'1'
            },{
                uuid:2,
                label:'select outp 2',
                value:'2'
            },{
                uuid:3,
                label:'select outp 3',
                value:'3'
            },{
                uuid:4,
                label:'select outp 4',
                value:'4'
            }
        ],
        coreCompanyLoaded:true
    }

    handleChange = (value) => {
        const { saveCodeList } = this.props;
        this.mounted && this.setState({
            value ,
            coreCompanyLoaded:false
        },()=>{
           // saveCodeList(value);
            this.mounted && this.setState(prevState=>({
                coreCompanyLoaded:true
            }),()=>{
                this.props.changeRefresh(Date.now());
            })
        });
    }

    componentDidMount(){

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="from-search">
                <FormItem
                    {...formItemLayout}
                    label="切换组织"
                >
                    <Spin size='small' spinning={!this.state.coreCompanyLoaded}>
                        {getFieldDecorator('select', {
                        })(
                            <Select
                                showSearch
                                labelInValue
                                placeholder="请选择供应商"
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                                searchPlaceholder="输入关键词"
                                onChange={this.handleChange}
                            >
                                {
                                    this.state.data.map(d => <Option key={d.uuid}>{d.label}</Option>)
                                }
                            </Select>
                        )}
                    </Spin>
                </FormItem>
            </Form>
        )
    }
}

const FormSelectSearch =  Form.create()(SelectSearch)

export default connect(state=>({
}),dispatch=>({
    saveCodeList:saveCodeList(dispatch)
}))(FormSelectSearch)
