/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react';
import {Form,Checkbox,Row,Button,Col,message,Modal,Spin} from 'antd'
import {request} from 'utils'
const FormItem = Form.Item;

class PopModal extends Component{
    static defaultProps={
        visible:true
    }

    state={
        loaded:false,
        editAble:true,
        submitLoading:false,
        showEditButton:false,
        data:[],
        roleData:[],
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    submitLoading:true
                })
                let options = [];
                for(let key in values){
                    if(values[key] && key !=='remark' && key !== 'roleName' && key !== 'isEnabled' && key.indexOf('allCode') === -1){
                        options.push(key)
                    }
                }
                let params = {
                    options,
                    id:this.props.id,
                }
                request.post('/sysRole/assignPermission',params)
                    .then(({data})=>{
                        this.setState({
                            submitLoading:false
                        })
                        if(data.code===200){
                            if(this.mounted){
                                message.success('角色权限分配成功!');
                                this.props.togglePermissionModalVisible(false);
                                this.props.refreshTable()
                            }

                        }else{
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({
                            submitLoading:false
                        })
                    })
            }
        });
    }
    fetchList(){
        request.get('/permissions')
            .then(({data})=>{
                if(data.code===200){
                    this.mounted && this.setState({
                        data: data.data
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    fetchRoleIdList(roleId){
        request.get(`/sysRole/queryRolePermissions/${roleId}`)
            .then(({data})=>{
                if(data.code===200){
                    this.mounted && this.setState({
                        roleData: data.data
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    onCheckAllChange = item => e => {
        const {setFieldsValue} = this.props.form;

        let newItems = [...item.permissionVOs]
        if (e.target.checked) {
            newItems.forEach(item => {
                setFieldsValue({
                    [item.permissionId]:true
                })
                return item;
            })
        } else {
            newItems.forEach(item => {
                setFieldsValue({
                    [item.permissionId]:false
                })
                return item;
            })
        }
    }
    checkAllChecked= (allCode, code) => e =>{
        const data = this.state.data;
        const {setFieldsValue,getFieldValue} = this.props.form;
        setFieldsValue({
            [code]:e.target.checked
        })
        for(let i = 0 ;i<data.length;i++){
            if(`allCode${i}` === allCode){
                let arr = [];
                data[i].permissionVOs.forEach(item=>{
                    arr.push( getFieldValue(item.permissionId) )
                })
                setFieldsValue({
                    [allCode]: arr.filter(item=>!item).length === 0
                })
                break;
            }
        }
    }
    initCheckboxAll = (data) =>{

        //es5 写法  每一项都返回true才返回true
        /*return data.every(item=>{
            return this.state.roleData.indexOf(item.permissionId) > -1;
        })*/

        let arr = [];
        data.forEach(item=>{
            if(this.state.roleData.indexOf(item.permissionId) > -1){
                arr.push(data.permissionId)
            }
        })
        return data.length === arr.length
    }
    componentDidMount(){
        this.fetchList()
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    componentWillReceiveProps(nextProps){

        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
        }

        if(this.props.visible !== nextProps.visible && !this.props.visible){
            this.fetchRoleIdList(nextProps.id)
        }

    }
    render(){
        const { getFieldDecorator} = this.props.form;
        const {togglePermissionModalVisible,visible} = this.props;
        const {loaded,data,roleData} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>togglePermissionModalVisible(false)}
                confirmLoading={this.state.submitLoading}
                width={800}
                style={{
                    maxWidth:'90%'
                }}
                bodyStyle={{
                    maxHeight: 420,
                    overflowY: "auto"
                }}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>togglePermissionModalVisible(false)}>取消</Button>
                            <Button type="primary" loading={loaded} onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title='分配权限'>
                <Spin spinning={loaded}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                data.map((item,i)=>{
                                    return (
                                        <Row key={i}>
                                            <Col style={{
                                                textAlign:'right',
                                                lineHeight:'32px',
                                                paddingRight:15
                                            }} span={3}>
                                                {item.moduleName}:
                                            </Col>
                                            <Col span={21}>
                                                <FormItem>
                                                    {
                                                        getFieldDecorator(`allCode${i}`,{
                                                            initialValue: this.initCheckboxAll(item.permissionVOs),
                                                            valuePropName: 'checked',
                                                            onChange:this.onCheckAllChange(item)
                                                        })(
                                                            <Checkbox>全选</Checkbox>
                                                        )
                                                    }

                                                </FormItem>
                                                {
                                                    item.permissionVOs.map((fieldItem,j)=>{
                                                        return(
                                                            <FormItem key={j}>
                                                                {
                                                                    getFieldDecorator(fieldItem.permissionId,{
                                                                        initialValue: roleData.indexOf(fieldItem.permissionId) > -1,
                                                                        valuePropName: 'checked',
                                                                        onChange:this.checkAllChecked(`allCode${i}`, fieldItem.permissionId)
                                                                    })(
                                                                        <Checkbox disabled={!this.state.editAble}>{fieldItem.actionName}</Checkbox>
                                                                    )
                                                                }
                                                            </FormItem>
                                                        )
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)