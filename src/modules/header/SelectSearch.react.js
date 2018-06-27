/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 14:38
 * description  :
 */
import React,{Component} from 'react'
import { Form,message,Row } from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';
import {request,getFields} from 'utils'
import {saveOrgId,saveToken,savePersonal,saveAreaId} from '../../redux/ducks/user'

const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
    },
};
class SelectSearch extends Component {
    state = {
        data:[],
        orgId:undefined,
        areaId:undefined,
        coreCompanyLoaded:true
    }
    handleAreaChange=(value)=>{
        this.props.saveAreaId(value)
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
        const { getFieldValue } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="from-search">
                <Row>
                {
                    getFields(this.props.form,[{
                        label:'区域',
                        fieldName:'areaId',
                        type:'asyncSelect',
                        span:12,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'orgName',
                            fieldValueName:'orgId',
                            doNotFetchDidMount:false,
                            notShowAll:true,
                            url:`/org/user_area`,
                            selectOptions:{
                                onChange:this.handleAreaChange,
                                defaultActiveFirstOption:true,
                            },
                        },
                        fieldDecoratorOptions: {
                            initialValue: this.props.areaId
                        }
                    },
                    {
                        label:'组织',
                        fieldName:'orgId',
                        type:'asyncSelect',
                        span:12,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'orgName',
                            fieldValueName:'orgId',
                            doNotFetchDidMount:!this.props.orgId,
                            notShowAll:true,
                            fetchAble:getFieldValue('areaId') || false,
                            url:`/org/user_organizations/${getFieldValue('areaId')}`,
                            selectOptions:{
                                onChange:this.handleChange,
                                defaultActiveFirstOption:true,
                            },
                            fieldDecoratorOptions: {
                                initialValue: this.props.orgId
                            }
                        }
                    }])
                }
                </Row>
            </Form>
        )
    }
}

const FormSelectSearch =  Form.create()(SelectSearch)

export default withRouter(connect(state=>({
    orgId:state.user.get('orgId'),
    areaId:state.user.get('areaId'),
}),dispatch=>( {
    saveOrgId:saveOrgId(dispatch),
    saveAreaId:saveAreaId(dispatch),
    saveToken:saveToken(dispatch),
    savePersonal:savePersonal(dispatch)
}))(FormSelectSearch))
