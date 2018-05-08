/**
 * Created by liuliyuan on 2018/5/8.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message,Transfer } from 'antd';
import {request} from 'utils'
class PopModal extends Component{
    static defaultProps={
        visible:true
    }
    state={
        mockData: [],
        targetKeys: [],
        loaded:true,
    }
    toggleLoaded = loaded => this.setState({loaded})
    fetchList(){
        request.get('/sysUser/queryUserList')
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.toggleLoaded(false)
                    this.mounted && this.setState({
                        mockData: data.data,
                    },()=>{
                        this.fetchRoleId(this.props.selectedRowKeys)
                    })

                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    fetchRoleId=(roleId)=>{
        request.get(`/sysRole/queryUserByRoleId/${roleId}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.toggleLoaded(false)
                    this.mounted && this.setState({
                        targetKeys: data.data,
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

export default Form.create()(PopModal)