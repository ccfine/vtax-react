/**
 * author       : liuliyuan
 * createTime   : 2018/4/20
 * description  :
 */
import React,{Component} from 'react';
import {Form,Checkbox,Row,Button,Col,message,Modal,Input,Switch,Icon} from 'antd'
import {request} from 'utils'
const FormItem = Form.Item;
class RoleModal extends Component{
    state={
        editAble:true,
        submitLoading:false,
        showEditButton:false,
        data:[],
        visible:false
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
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
                    remark:values.remark,
                    roleName:values.roleName,
                    isEnabled:values.isEnabled ? 1 : 0
                }
                if(this.props.type==='edit'){

                    request.put(`/sysRole/update`,{...params, id:this.props.id,
                    })
                        .then(({data})=>{
                            this.setState({
                                submitLoading:false
                            })
                            if(data.code===200){
                                if(this.mounted){
                                    message.success('角色编辑成功!');
                                    this.props.setData({
                                        options,
                                        roleName:params.roleName,
                                        isEnabled:params.isEnabled,
                                        remark:params.remark
                                    });
                                    this.setState({
                                        visible:false
                                    })
                                    this.props.refresh()
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
                }else{
                    request.post('/sysRole/add',params)
                        .then(({data})=>{
                            this.setState({
                                submitLoading:false
                            })
                            if(data.code===200){
                                if(this.mounted){
                                    message.success('角色增加成功!');
                                    this.setState({
                                        visible:false
                                    })
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
    componentDidMount(){
         this.fetchList()
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
        let arr = [];
        for(let i = 0 ;i<data.length;i++){
            if(this.props.data.options.indexOf(Number(data[i].permissionId)) !== -1){
                arr.push(data.permissionId)
            }
        }
        return data.length === arr.length
    }

    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const { getFieldDecorator,resetFields} = this.props.form;
        const {data} = this.state;
        return(
            <div style={{display:'inline-block',marginLeft:15}}>
                <Button size='small'onClick={()=>{
                    resetFields();
                    this.setState({
                        visible:true
                    })
                }}><Icon type={this.props.type==='add'?'plus':'edit'}/>{this.props.buttonTxt}</Button>
                <Modal title={this.props.title} onCancel={this.handleCancel} width={800} visible={this.state.visible} confirmLoading={this.state.submitLoading} onOk={this.handleSubmit}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem>
                                    {
                                        getFieldDecorator('roleName',{
                                            initialValue:this.props.type==='edit'? this.props.data.roleName : '',
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入角色名称'
                                                },{
                                                    pattern:/^[^ ]+$/,message:'不能包含空格'
                                                }
                                            ]
                                        })(
                                            <Input placeholder="请输入角色名称" />
                                        )
                                    }
                                </FormItem>

                            </Col>
                        </Row>
                        <div style={{
                            width:'100%',
                            // backgroundColor:'#F8F8F8',
                            padding:'20px 0',
                            margin:'20px 0'
                        }}>
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
                                                            initialValue:this.props.type==='edit' && this.props.data.options && this.initCheckboxAll(item.permissionVOs),
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
                                                                        initialValue:this.props.type==='edit' && this.props.data.options && this.props.data.options.indexOf(Number(fieldItem.permissionId)) !== -1,
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
                            <Row>
                            <span style={{
                                display:'inline-block',
                                width:100,
                                lineHeight:'32px',
                                textAlign:'right',
                                paddingRight:15
                            }}>状态:</span>
                                {
                                    getFieldDecorator('isEnabled', {
                                        initialValue:this.props.type==='edit'? parseInt(this.props.data.isEnabled,0)===1 : true,
                                        valuePropName: 'checked' ,
                                    })(
                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                    )}
                            </Row>
                            <Row style={{marginTop:10}}>
                            <span style={{
                                display:'inline-block',
                                width:100,
                                lineHeight:'32px',
                                textAlign:'right',
                                paddingRight:15
                            }}>备注:</span>
                                <FormItem>
                                    {
                                        getFieldDecorator('remark', {
                                            initialValue:this.props.type==='edit' && this.props.data.remark ,
                                        })(
                                            <Input.TextArea style={{width:500}} autosize={
                                                {
                                                    minRows:3
                                                }
                                            } placeholder="请输入备注" />
                                        )}
                                </FormItem>

                            </Row>

                        </div>
                    </Form>
                </Modal>
            </div>

        )
    }
}

export default  Form.create()(RoleModal)
