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
import {saveOrg,saveToken,savePersonal,saveArea} from '../../redux/ducks/user'

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
        org:undefined,
        area:undefined,
    }
    handleAreaChange=(value)=>{
        this.props.saveArea({areaId:value.key,areaName:value.label})
    }
    handleChange = (value) => {
        const { saveOrg, org } = this.props;
        this.mounted && this.setState({
            value 
        },()=>{
            saveOrg({orgId:value.key,orgName:value.label});
            if(this.mounted && value.key !== org.orgId){
                this.renderSwitchGroupSearch(value.key);
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
                    // console.log('savePersonal')
                    // this.props.history.replace('/web');

                    //保证redux保存成功后更新数据
                    // setTimeout(()=>{
                    //     // this.props.changeRefresh(Date.now()+1)
                    //     // console.log('renderSwitchGroupSearch setTimeout',Date.now())
                    //     this.props.history.replace('/web');
                    // },300)
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
        const { area,org} = this.props;
        return (
            <Form onSubmit={this.handleSubmit} className="from-search set-search-width" >
                <Row>
                {
                    getFields(this.props.form,[{
                        label:'区域',
                        fieldName:'area',
                        type:'asyncSelect',
                        span:10,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'name',
                            fieldValueName:'id',
                            fieldOtherName:'code',
                            doNotFetchDidMount:false,
                            notShowAll:true,
                            url:`/sysOrganization/queryLoginAreas`,
                            selectOptions:{
                                labelInValue:true,
                                onChange:this.handleAreaChange,
                                defaultActiveFirstOption:true,
                                showSearch:true,
                                optionFilterProp:'children',
                            },
                        },
                        fieldDecoratorOptions: {
                            initialValue: (area && {key: area.areaId,label: area.areaName}) || undefined,
                        }
                    },
                    {
                        label:'组织',
                        fieldName:'org',
                        type:'asyncSelect',
                        span:14,
                        formItemStyle:formItemLayout,
                        componentProps:{
                            fieldTextName:'name',
                            fieldValueName:'id',
                            fieldOtherName:'code',
                            doNotFetchDidMount:!(area && area.areaId),
                            notShowAll:true,
                            fetchAble:(getFieldValue('area') && getFieldValue('area').key ) || (area && area.areaId),
                            url:`/sysOrganization/queryLoginOrgs/${(getFieldValue('area') && getFieldValue('area').key) || (area && area.areaId)}`,
                            selectOptions:{
                                labelInValue:true,
                                onChange:this.handleChange,
                                defaultActiveFirstOption:true,
                                showSearch:true,
                                optionFilterProp:'children',
                            },
                        },
                        fieldDecoratorOptions: {
                            initialValue: (org && {key: org.orgId,label: org.orgName}) || undefined,
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
    org:state.user.get('org'),
    area:state.user.get('area'),
}),dispatch=>( {
    saveOrg:saveOrg(dispatch),
    saveArea:saveArea(dispatch),
    saveToken:saveToken(dispatch),
    savePersonal:savePersonal(dispatch)
}))(FormSelectSearch))
