/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 14:38
 * description  :
 */
import React,{Component} from 'react'
import { Form,Select,Spin,message } from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';
import {request} from 'utils'
import {saveOrgId,saveToken,savePersonal} from '../../redux/ducks/user'

const Option = Select.Option;
const FormItem = Form.Item;
class SelectSearch extends Component {
    state = {
        data:[],
        orgId:undefined,
        coreCompanyLoaded:true
    }

    handleChange = (value) => {
        const { saveOrgId } = this.props;
        this.mounted && this.setState({
            value ,
            coreCompanyLoaded:false
        },()=>{
           saveOrgId(value);
           this.renderSwitchGroupSearch(value)
            this.mounted && this.setState(prevState=>({
               coreCompanyLoaded:true
           }),()=>{
                //判断权限
                if(saveOrgId !== this.props.orgId){
                    this.props.history.replace('/web');
                    setTimeout(()=>{
                        this.props.changeRefresh(Date.now()+1)
                        //window.location.reload()
                    },300)
                }
           })
        });
    }

    renderSwitchGroupSearch=(orgId)=>{
        const { saveToken,savePersonal } = this.props;
        request.get(`/oauth/switch_group/${orgId}`)
            .then(({data})=>{
                if(data.code ===200){
                    saveToken(data.data.token)
                    savePersonal(data.data)
                }else{
                    message.error(`查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    }

    componentDidMount(){
        request.get('/org/user_belong_organizations')
            .then(({data})=>{
                if(data.code ===200){
                    this.setState({
                        data: data.data
                    },()=>{
                        this.setState({
                            orgId:this.props.orgId
                        })
                    });
                }else{
                    message.error(`查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
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
                            initialValue: this.state.orgId,
                        })(
                            <Select
                                showSearch
                                placeholder="请选择供应商"
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                                onChange={this.handleChange}
                            >
                                {
                                    this.state.data.map(d => <Option key={d.orgId}>{d.orgName}</Option>)
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

export default withRouter(connect(state=>({
    orgId:state.user.get('orgId')
}),dispatch=>( {
    saveOrgId:saveOrgId(dispatch),
    saveToken:saveToken(dispatch),
    savePersonal:savePersonal(dispatch)
}))(FormSelectSearch))
