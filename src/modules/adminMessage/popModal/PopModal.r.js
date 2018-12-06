/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 17:33
 * description  : 公告中心
 */

import React, { Component } from 'react'
import {Modal,Row,Col,Form,Select,Button,Input,DatePicker,message,Spin,Upload,Icon} from 'antd'
import {request} from 'utils'
import AsyncTree from './AsyncTree.r'
import EditorComponent from './Editor'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import difference from 'lodash/difference'

const FormItem = Form.Item
const Option = Select.Option

class PopModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultData: {},
            fileList: [],
            fileUUIDArray: [],
            list: [],
            saveLoading: false,
            publishLoading: false,
            uploadLoging: false
        }
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                defaultData:{},
                fileList:[],
                fileUUIDArray:[]
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalType === 'edit'){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            let newArr = []
            nextProps.fileList.forEach((item, key) => {
                newArr.push(item.uid)
            })
            this.setState({
                defaultData:{...nextProps.defaultData},
                fileList: nextProps.fileList,
                fileUUIDArray: newArr
            })
        }
    }

    handleSubmit = (e, type) => {
        e.preventDefault()
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                const { defaultData } = this.props;
                const { fileUUIDArray } = this.state
                if (this.props.modalType === 'add') {
                    // 新增公告  保存和发布按钮 都用这个接口
                    // const url = '/sysNotice/add'
                    const values = {
                        ...fieldsValue,
                        'takeDate': fieldsValue['takeDate'].format('YYYY-MM-DD'),
                        'createBy': this.props.username,
                        'publishBy': this.props.realName,
                        'isSave': type === 'save' ? 'save' : 'push',
                        'fileUUIDArray': fileUUIDArray
    
                    }
                    if (type === 'push') {
                        this.deleteRole(() => {
                            this.fetchSave(values, 'push')
                            // this.requestPublish(url, values)
                        })
                    } else {
                        this.fetchSave(values, 'save')
                        // this.requestSave(url, values)
                    }
                } else {
                    // 修改公告 保存和发布按钮 都用这个接口
                    // const url = '/sysNotice/update'
                    const values = {
                        ...fieldsValue,
                        'takeDate': fieldsValue['takeDate'].format('YYYY-MM-DD'),
                        'createBy': this.props.username,
                        'publishBy': this.props.realName,
                        'isSave': type === 'save' ? 'save' : 'push',
                        'id': defaultData.id,
                        'publishStatus': defaultData.publishStatus,
                        'fileUUIDArray': fileUUIDArray
                    }
                    if (type === 'push') {
                        this.deleteRole(() => {
                            this.fetchPut(values, 'push')
                            // this.requestPublish(url, values)
                        })
                    } else {
                        this.fetchPut(values, 'save')
                        // this.requestSave(url, values)
                    }
                }
            }
        })
    }
    
    // new 保存接口
    requestSave = (url, data) => {
        this.setState({saveLoading: true})
        request.post(url, data)
            .then(({data}) => {
                if(data.code===200){
                    this.setState({saveLoading: false})
                    message.success('公告保存成功', 2);
                    this.props.toggleModalVisible(false)
                }else {
                    message.error(data.msg)
                    this.setState({saveLoading: false})
                }
            })
            .catch(err => {
                this.setState({saveLoading: false})
                this.props.toggleModalVisible(false)
                message.error(err.message)
            })
    }

    // new 发布接口
    requestPublish = (url, data) => {
        this.setState({publishLoading: true})
        request.post(url, data)
            .then(({data}) => {
                if(data.code===200){
                    this.setState({publishLoading: false})
                    message.success('公告发布成功', 2);
                    this.props.toggleModalVisible(false)
                }else {
                    message.error(data.msg)
                    this.setState({publishLoading: false})
                }
            })
            .catch(err => {
                this.setState({publishLoading: false})
                this.props.toggleModalVisible(false)
                message.error(err.message)
            })
    }

    // 保存接口
    fetchSave = (data, type) => {
        type === 'save' ? this.setState({saveLoading: true}) : this.setState({publishLoading: true})
        request.post('/sysNotice/add', data)
            .then(({data}) => {
                if(data.code===200){
                    type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                    this.props.toggleModalVisible(false)
                }else {
                    message.error(data.msg)
                    type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                }
            })
            .catch(err => {
                type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                this.props.toggleModalVisible(false)
                message.error(err.message)
            })
    }

    // 发布接口
    fetchPut = (data, type) => {
        type === 'save' ? this.setState({saveLoading: true}) : this.setState({publishLoading: true})
        request.put('/sysNotice/update', data)
            .then(({data}) => {
                if(data.code===200){
                    type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                    this.props.toggleModalVisible(false)
                }else {
                    message.error(data.msg)
                    type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                }
            })
            .catch(err => {
                type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                this.props.toggleModalVisible(false)
                message.error(err.message)
            })
    }
    // 发布回调方法
    deleteRole = (callback) => {
		const modalRef = Modal.confirm({
			title: '友情提醒',
			content: '公告发布后不可撤回，请确定是否发布？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				modalRef && modalRef.destroy()
				callback && callback()
			},
			onCancel() {
				modalRef.destroy()
			}
		})
    }
    
    deleteRecord = (reqData, type) => {
        const { fileUUIDArray } = this.state
        return request.post(`/sysNotice/exit`,reqData).then(({data}) => {
            if (data.code === 200) {
                // 新增公告点击关闭按钮 删除文件UUID
                let newArr = difference(fileUUIDArray, reqData)
                this.setState({fileUUIDArray: newArr})
                if (type === 'cancel') {
                    message.success('附件删除成功', 2);
                }
                return true
            } else {
                message.error(`文件删除失败:${data.msg}`, 4);
                return false
            }
        })
            .catch(err => {
                return false
            })
    }

    // 上传附件后台返回的uuid 保存要传给后台
    setUuid = (data) => {
        const { fileUUIDArray } = this.state
        let newArr = fileUUIDArray.concat([data.fileUuid])
        this.setState({fileUUIDArray: newArr})
    }

    handleFileChange = (info) => {
        const { file, fileList } = info
        const isLt5M = file.size / 1024 / 1024 < 5
        if (fileList.length > 5) {
            return false;
        }
        if (!isLt5M) {
            return false;
        }
        this.setState({ fileList: fileList })
    }

    handleBeforeUpload = (file, filesList) => {
        const { fileList } = this.state
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (fileList.length > 4) {
            message.error('附件数量不能多于5个！');
            return false;
        }
        if (!isLt5M) {
            message.error('文件必须小于5MB！');
            return false;
        }
        const formData = new FormData()
        formData.append('files',file)
        formData.append('targetfileName',file.uid)
        this.setState({uploadLoging: true})
        
        request.post('/sysNotice/upload',formData, {
            header:{
                //使用formData传输文件的时候要设置一下请求头的Content-Type，否则服务器接收不到
                "Content-Type":"application/x-www-form-urlencoded"
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    const reqData = data.data
                    message.success('附件上传成功', 2)
                    this.setState({uploadLoging: false})
                    this.setUuid(reqData)
                }else{
                    this.setState({uploadLoging: false})
                    message.error(`附件上传失败:${data.msg}`,4)
                }
            }).catch(err=>{
                this.setState({uploadLoging: false})
                message.error(`附件上传失败.:${err}`,4)
        })
        return false;
    }

    handleCancel = () => {
        if (this.state.fileUUIDArray.length > 0 && this.props.modalType === 'add') {
            this.deleteRecord(this.state.fileUUIDArray, 'cancel')
        }
        this.props.toggleModalVisible(false)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { visible, loading } = this.props
        const { defaultData, fileList, saveLoading, publishLoading, uploadLoging } = this.state
        const props = {
            onChange: this.handleFileChange,
            beforeUpload: this.handleBeforeUpload,
            onRemove: (file) => {
                let files = [file.uid]
                return this.deleteRecord(files)
            },
            fileList
        };
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                width={900}
                visible={visible}
                title='编辑公告'
                footer={null}
            >
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row gutter={24}>
                            <Col span={16}>
                                <Row>
                                    <Col>
                                        <FormItem
                                            labelCol={{span: 4}}
                                            wrapperCol={{ span: 20 }}
                                            label="公告标题"
                                        >
                                            {
                                                getFieldDecorator('title', {
                                                    initialValue: defaultData.title || '',
                                                    rules: [
                                                        { required: true, message: '请输入公告标题' },
                                                        { max: 20, message: '公告标题最多输入20个字符' }
                                                    ],
                                                })(
                                                    <Input />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            labelCol={{span: 8}}
                                            wrapperCol={{ span: 16 }}
                                            label="公告类型"
                                        >
                                            {
                                                getFieldDecorator('sysDictId', {
                                                    initialValue: defaultData.sysDictId || undefined,
                                                    rules: [{ required: true, message: '请选择公告类型' }],
                                                })(
                                                    <Select
                                                        placeholder="请选择公告类型"
                                                        onChange={this.handleSelectChange}
                                                    >
                                                        <Option value="1">集团税务公告</Option>
                                                        <Option value="2">税务政策解读</Option>
                                                        <Option value="3">平台更新公告</Option>
                                                        <Option value="4">其他公告</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>

                                    <Col span={12}>
                                        <FormItem
                                            labelCol={{span: 8}}
                                            wrapperCol={{ span: 16 }}
                                            label="公告级别"
                                        >
                                            {
                                                getFieldDecorator('level', {
                                                    initialValue: defaultData.level || undefined,
                                                    rules: [{ required: true, message: '请选择公告级别' }],
                                                })(
                                                    <Select
                                                        placeholder="请选择公告级别"
                                                        onChange={this.handleSelectChange}
                                                    >
                                                        <Option value={1}>紧急公告</Option>
                                                        <Option value={2}>重要公告</Option>
                                                        <Option value={3}>普通公告</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <FormItem
                                        style={{minHeight: 420}}
                                    >
                                        {getFieldDecorator('content',{
                                            initialValue: defaultData.content || '',
                                            // rules: [{ required: true, message: '请输入公告内容' }],
                                            
                                        })(
                                            <EditorComponent />
                                        )}
                                    </FormItem>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            labelCol={{span: 8}}
                                            wrapperCol={{ span: 16 }}
                                            label="生效日期"
                                        >
                                            {
                                                getFieldDecorator('takeDate', {
                                                    initialValue: (defaultData.takeDate && moment(defaultData.takeDate, 'YYYY-MM-DD')) || moment(new Date(), 'YYYY--MM-DD'),
                                                    rules: [{ required: true, message: '请选择生效日期' }],
                                                })(
                                                    <DatePicker />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            labelCol={{span: 8}}
                                            wrapperCol={{ span: 16 }}
                                            label="发布人"
                                        >
                                            <span className="ant-form-text">{this.props.realName}</span>
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={3} offset={1}>添加附件：</Col>
                                    <Col span={12}>
                                        {/* <FormItem
                                            labelCol={{span: 8}}
                                            wrapperCol={{ span: 16 }}
                                            label="添加附件"
                                        >
                                            <Upload {...props}>
                                                <Button size='small'>
                                                    <Icon type="upload" />
                                                </Button>
                                            </Upload>
                                        </FormItem> */}
                                        <Upload {...props}>
                                            <Button disabled={uploadLoging} size='small'>
                                                <Icon type="upload" />
                                            </Button>
                                        </Upload>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{width:'100%',textAlign:'right'}} offset={12}>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                        >
                                            <Button loading={saveLoading} onClick={(e) => this.handleSubmit(e,'save')}>
                                                保存
                                            </Button>
                                            <Button loading={publishLoading} style={{margin:'4px 0 4px 20px'}} type="primary" onClick={(e) => this.handleSubmit(e,'push')}>
                                                发布
                                            </Button>
                                        </FormItem>
                                    </Col>
                                </Row>

                            </Col>

                            <Col span={8}>
                                <Row className="message-right" style={{minHeight: 400}}>
                                    <AsyncTree
                                        initialValue={defaultData.orgIdArray}
                                        form={this.props.form}
                                        url='/sysOrganization/tree/all'
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}
const WrappedPopModal = Form.create()(PopModal)
export default withRouter(connect(state=>({
    realName:state.user.getIn(['personal','realname']),
    username:state.user.getIn(['personal','username']),
    typen:state.user.getIn(['personal','typen'])
}))(WrappedPopModal))