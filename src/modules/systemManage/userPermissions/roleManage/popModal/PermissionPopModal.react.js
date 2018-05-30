/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react';
import {Form,message,Modal,Spin,Alert,Row,Col} from 'antd'
import {request} from 'utils'
import PermissionFeilds from "../../permissionDetail";

class PopModal extends Component{
    static defaultProps={
        visible:true
    }

    state={
        submitLoading:false,
        allPermission:[],
        permissionLoading:true,
        checkedPermission:[],
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
                    if(values[key] && key.indexOf('allCode') === -1){
                        options.push(key)
                    }
                }
                let params = {
                    options,
                    id:this.props.id,
                }
                request.post('/sysRole/assignPermission',params)
                    .then(({data})=>{
                        this.setState({ submitLoading:false })
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
                        this.setState({ submitLoading:false })
                    })
            }
        });
    }
    fetchAllPermission() {
        this.setState({ permissionLoading: true });
        request
            .get("/permissions")
            .then(({ data }) => {
                this.setState({ permissionLoading: false });
                if (data.code === 200) {
                    this.setState({
                        allPermission: data.data,
                    });
                } else {
                    message.error(data.msg, 4);

                }
            })
            .catch(err => {
                message.error(err.message, 4);
                this.setState({ permissionLoading: false });
            });
    }
    fetchRoleIdList(roleId){
        this.setState({ permissionLoading: true });
        request.get(`/sysRole/queryRolePermissions/${roleId}`)
            .then(({data})=>{
                if(data.code===200){
                    this.mounted && this.setState({
                        checkedPermission: data.data,
                        permissionLoading: false
                    })
                }else{
                    message.error(data.msg)
                    this.setState({ permissionLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({ permissionLoading: false });
            })
    }

    componentDidMount(){
        this.fetchAllPermission()
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
            /*this.setState({
                allPermission:[],
                checkedPermission:[],
            })*/
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible){
            this.fetchRoleIdList(nextProps.id)
        }
    }
    render(){
        const {togglePermissionModalVisible,visible} = this.props;
        const {submitLoading,allPermission,permissionLoading,checkedPermission} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.handleSubmit}
                onCancel={()=>togglePermissionModalVisible(false)}
                confirmLoading={submitLoading}
                width={800}
                style={{
                    maxWidth:'90%'
                }}
                bodyStyle={{
                    maxHeight: 420,
                    overflowY: "auto"
                }}
                visible={visible}
                title={
                    <Row>
                        <Col span={4} style={{padding:'8px 0'}}>
                            分配权限
                        </Col>
                        <Col span={16}>
                            <Alert style={{color: 'red'}} message="每个模块权限必须分配查看权限才能访问，否则页面不能访问！" type="warning" showIcon />
                        </Col>
                    </Row>
                }
            >
                <Spin spinning={submitLoading}>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <PermissionFeilds
                            form={this.props.form}
                            checkedPermission={checkedPermission}
                            allPermission={allPermission}
                            permissionLoading={permissionLoading}
                        />
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)