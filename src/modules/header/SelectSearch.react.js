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
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
    },
};
class SelectSearch extends Component {
    state = {
        data:[],
        orgId:undefined,
        areaId:undefined,
    }
    handleAreaChange=(value)=>{
        this.props.saveAreaId(value)
    }
    handleChange = (value) => {
        const { saveOrgId } = this.props;
        this.mounted && this.setState({
            value 
        },()=>{
           saveOrgId(value);
            if(this.mounted && saveOrgId !== this.props.orgId){
                this.props.history.replace('/web');
                this.renderSwitchGroupSearch(value);
            }
        });
    }

    renderSwitchGroupSearch=(orgId)=>{
        const { saveToken,savePersonal } = this.props;
        request.get(`/oauth/switch_group/${orgId}`)
            .then(({data})=>{
                if(data.code ===200){
                    saveToken(data.data.token)
                    savePersonal(data.data)

                    //保证redux保存成功后更新数据
                    setTimeout(()=>{
                        this.props.changeRefresh(Date.now()+1)
                    },300)
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
            <Form onSubmit={this.handleSubmit} className="from-search set-search-width" >
                <Row>
                {
                    getFields(this.props.form,[{
                        label:'区域',
                        fieldName:'areaId',
                        type:'asyncSelect',
                        span:8,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'name',
                            fieldValueName:'id',
                            doNotFetchDidMount:false,
                            notShowAll:true,
                            url:`/sysOrganization/queryLoginAreas`,
                            selectOptions:{
                                onChange:this.handleAreaChange,
                                defaultActiveFirstOption:true,
                                showSearch:true,
                                optionFilterProp:'children',
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
                        span:16,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'name',
                            fieldValueName:'id',
                            doNotFetchDidMount:!this.props.areaId,
                            notShowAll:true,
                            fetchAble:getFieldValue('areaId') || this.props.areaId || false,
                            url:`/sysOrganization/queryLoginOrgs/${getFieldValue('areaId') || this.props.areaId}`,
                            selectOptions:{
                                onChange:this.handleChange,
                                defaultActiveFirstOption:true,
                                showSearch:true,
                                optionFilterProp:'children',
                            },
                        },
                        fieldDecoratorOptions: {
                            initialValue: this.props.orgId
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
