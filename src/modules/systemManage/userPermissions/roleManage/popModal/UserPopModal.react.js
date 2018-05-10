/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux'
import {Button,Modal,Form,Row,Col,Spin,message,Transfer } from 'antd';
import {request} from 'utils'
class PopModal extends Component{
    static defaultProps={
        visible:true
    }
    state={
        submitLoading:false,
        mockData: [],
        targetKeys:[],
        loaded:true,
    }

    handleSubmit = () => {
        if(this.state.targetKeys.length < 1) {
            return message.success('请选择要分配的用户!');
        }
        let params = {
            userIds:this.state.targetKeys,
            id:this.props.id,
        }
        this.setState({
            submitLoading:true
        })
        request.post(`/sysRole/assignUser/${this.props.orgId}`,params)
            .then(({data})=>{
                this.setState({
                    submitLoading:false
                })
                if(data.code===200){
                    if(this.mounted){
                        message.success('角色分配成功!');
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
            })
    }


    toggleLoaded = loaded => this.setState({loaded})

    fetchList(){
        request.get(`/sysUser/queryUserList/${this.props.orgId}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.toggleLoaded(false)
                    this.mounted && this.setState({
                        mockData: data.data,
                    })
                    this.fetchRoleId(this.props.id)

                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    fetchRoleId=(roleId)=>{
        const targetKeys = [];
        request.get(`/sysRole/queryUserByRoleId/${roleId}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.toggleLoaded(false)
                    data.data.map(item=>targetKeys.push(item.key));
                    this.mounted && this.setState({
                        targetKeys
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }


    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys) => {
        console.log(targetKeys)
        this.setState({ targetKeys });
    }


    componentDidMount() {
       this.fetchList()
        //this.getMock()
    }
    mounted=true
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
    }
    render(){
        const {toggleUserModalVisible,visible} = this.props;
        const {loaded} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleUserModalVisible(false)}
                width={800}
                style={{
                    maxWidth:'90%'
                }}
                visible={visible}
                confirmLoading={this.state.submitLoading}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleUserModalVisible(false)}>取消</Button>
                            <Button type="primary" loading={loaded} onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title='分配用户'>
                <Spin spinning={loaded}>
                    <div style={{
                        width: 606,
                        margin: '0 auto'
                    }}>
                        <Transfer
                            rowKey={record => record.key}
                            listStyle={{
                                width: 280,
                                height: 400,
                            }}
                            dataSource={this.state.mockData}
                            showSearch
                            filterOption={this.filterOption}
                            targetKeys={this.state.targetKeys}
                            onChange={this.handleChange}
                            render={item => item.title}
                        />
                    </div>
                </Spin>

            </Modal>
        )
    }
}

export default connect(state=>({
    orgId: state.user.get("orgId")
}))(Form.create()(PopModal))