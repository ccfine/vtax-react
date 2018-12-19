/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 17:33
 * description  : 公告中心
 */

import React, { Component } from 'react'
import {Modal,Row,Col,Form,Select,Button,Input,DatePicker,message,Spin,Upload,Icon} from 'antd'
import {request} from 'utils'
import AsyncTree from './AsyncTree.r'
// import EditorComponent from './Editor'
import Editor from './NewEditor'
// import BraftEditor from 'braft-editor'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import difference from 'lodash/difference'
import { store } from 'redux/store'
import {saveNoticeContent} from '../../../redux/ducks/user'

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
            uploadLoging: false,
            previewLoading: false
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
                fileUUIDArray:[],
                saveLoading: false,
                publishLoading: false,
                uploadLoging: false,
                previewLoading: false
            })
            this.props.saveNoticeContent({})
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
                // 传纯文本格式给后台 用于首页展示
                // const editorState = BraftEditor.createEditorState(fieldsValue.content)
                // const textString = editorState.toText()
                if (this.props.modalType === 'add') {
                    // 新增公告
                    const values = {
                        ...fieldsValue,
                        'takeDate': fieldsValue['takeDate'].format('YYYY-MM-DD'),
                        'createBy': this.props.username,
                        'publishBy': this.props.realName,
                        'publishStatus': type === 'save' ? 0 : 1,
                        'fileUUIDArray': fileUUIDArray
    
                    }
                    if (type === 'push') {
                        this.deleteRole(() => {
                            this.fetchSave(values, 'push')
                        })
                    } else {
                        this.fetchSave(values, 'save')
                    }
                } else {
                    // 修改公告
                    const values = {
                        ...fieldsValue,
                        'takeDate': fieldsValue['takeDate'].format('YYYY-MM-DD'),
                        'createBy': this.props.username,
                        'publishBy': this.props.realName,
                        'isSave': type === 'save' ? 'save' : 'push',
                        'id': defaultData.id,
                        'publishStatus': type === 'save' ? 0 : 1,//defaultData.publishStatus,
                        'fileUUIDArray': fileUUIDArray
                    }
                    if (type === 'push') {
                        this.deleteRole(() => {
                            this.fetchPut(values, 'push')
                        })
                    } else {
                        this.fetchPut(values, 'save')
                    }
                }
            }
        })
    }
    
    // 保存接口
    fetchSave = (data, type) => {
        type === 'save' ? this.setState({saveLoading: true}) : this.setState({publishLoading: true})
        request.post('/sysNotice/add', data)
            .then(({data}) => {
                if(data.code===200){
                    type === 'save' ? this.setState({saveLoading: false}) : this.setState({publishLoading: false})
                    type === 'save' ? message.success('保存成功',2) : message.success('发布成功',2)
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
                    type === 'save' ? message.success('保存成功',2) : message.success('发布成功',2)
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
        let newArr = fileUUIDArray.concat([data.uid])// uid  fileUuid
        this.setState({fileUUIDArray: newArr})
    }

    handleFileChange = (info) => {
        const { file, fileList } = info
        const isLt5M = file.size / 1024 / 1024 <= 5
        if (info.file.status === 'error') {
            // 当文件上传失败 处理
            let newFiles = fileList.filter((item) => item.status !== 'error' || !!item.noticeId)
            message.error('文件上传失败，请重新上传', 2)
            this.setState({fileList: newFiles, uploadLoging: false})
            return false;
        }
        if (info.file.status === 'removed') {
            message.success('文件删除成功', 2)
            this.setState({uploadLoging: false})
            this.setState({ fileList: fileList })
            return true;
        }
        const fileName = file.name
        const pos = fileName.lastIndexOf('.')
        const lastName = fileName.substring(pos,fileName.length)
        if (fileList.length > 5) {
            return false;
        }
        if (lastName.toLowerCase() !== '.zip' && lastName.toLowerCase() !== '.rar' && lastName.toLowerCase() !== '.7z') {
            message.warning('文件必须为压缩包格式', 2)
            this.setState({uploadLoging: false})
            return false;
        }

        if (!isLt5M) {
            return false;
        }
        if (info.file.status === 'uploading') {
            // console.log('正在上传........')
        }
        if (info.file.status === 'done') {
            message.success('文件上传成功', 2)
            this.setState({uploadLoging: false})
            this.setUuid(file)
        }
        this.setState({ fileList: fileList })
    }

    handleBeforeUpload = (file, filesList) => {
        const { fileList } = this.state
        const isLt5M = file.size / 1024 / 1024 <= 5;
        if (fileList.length > 4) {
            message.error('附件数量不能多于5个！');
            return false;
        }
        if (!isLt5M) {
            message.error('文件必须小于5MB！');
            return false;
        }
        // const formData = new FormData()
        // formData.append('files',file)
        // formData.append('targetfileName',file.uid)
        this.setState({currentUid:file.uid})
        this.setState({uploadLoging: true})
        // request.post('/sysNotice/upload',formData, {
        //     header:{
        //         //使用formData传输文件的时候要设置一下请求头的Content-Type，否则服务器接收不到
        //         "Content-Type":"application/x-www-form-urlencoded"
        //     }
        // })
        //     .then(({data})=>{
        //         if(data.code===200){
        //             const reqData = data.data
        //             message.success('附件上传成功', 2)
        //             this.setState({uploadLoging: false})
        //             this.setUuid(reqData)
        //         }else{
        //             this.setState({uploadLoging: false})
        //             message.error(`附件上传失败:${data.msg}`,4)
        //         }
        //     }).catch(err=>{
        //         this.setState({uploadLoging: false})
        //         message.error(`附件上传失败.:${err}`,4)
        // })
        return true;
    }

    handleCancel = () => {
        const { fileList } = this.state;
        let newArr = []
        fileList.forEach((item) => {
            if (!item.noticeId) {
                newArr.push(item.uid)
            }
        })
        if (newArr.length > 0) {
            this.deleteRecord(newArr, 'cancel')
        }
        this.props.toggleModalVisible(false)
    }

    handlePreview = () => {
        const { getFieldsValue } = this.props.form;
        const { gglxDict } = this.props
        this.setState({previewLoading:true})
        const data = getFieldsValue()
        const sysDictList = gglxDict.filter(item => item.value === data.sysDictId);
        const value = {
            ...data,
            'takeDate': data['takeDate'].format('YYYY-MM-DD'),
            'publishDateStr': data['takeDate'].format('YYYY-MM-DD'),
            'createBy': this.props.username,
            'publishBy': this.props.realName,
            'sysDictName': sysDictList.length > 0 ? sysDictList[0].text : ''
        }
        this.props.saveNoticeContent(value,()=>{
            setTimeout(()=>{
                this.setState({previewLoading:false})
                window.open(`/messageDetail?type=preview`)
            },1000)
        })
    }

    getToken = ()=>{
        return store.getState().user.get('token') || false
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { visible, loading, gglxDict } = this.props
        const { defaultData, fileList, saveLoading, publishLoading, uploadLoging } = this.state
        const props = {
            name: 'files',
            action: `${window.baseURL}sysNotice/upload`,
            headers: {
                Authorization: this.getToken()
            },
            data: {targetfileName: this.state.currentUid},
            onChange: this.handleFileChange,
            beforeUpload: this.handleBeforeUpload,
            onRemove: (file) => {
                const { response, noticeId } = file
                let files = [file.uid]
                console.log('file',file)
                if ((response && response.code === 200) || !!noticeId) {
                    return this.deleteRecord(files)
                } else {
                    return true;
                }
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
                    <Form onSubmit={this.handleSubmit} className="message-form">
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
                                                        { max: 40, message: '公告标题最多输入40个字符' }
                                                    ],
                                                })(
                                                    <Input placeholder="请输入公告标题" />
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
                                                        {
                                                            gglxDict && gglxDict.map((item,key) => <Option key={key} value={item.value}>{item.text}</Option>)
                                                        }
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

                                <Row className="message-new-editor">
                                    <FormItem
                                        // style={{minHeight: 420}}
                                    >
                                        {getFieldDecorator('content',{
                                            initialValue: defaultData.content || '',
                                            // rules: [{ required: true, message: '请输入公告内容' }],
                                            
                                        })(
                                            // <EditorComponent />
                                            <Editor />
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
                                    <Col span={12} style={{position:'relative'}}>
                                        <Upload {...props}>
                                            <Button disabled={uploadLoging} size='small'>
                                                <Icon type="upload" />
                                            </Button>
                                        </Upload>
                                        <span className="message-upload-info">文件格式支持.zip/.rar/.7z，单个文件支持5M以内，最多支持上传5个文件</span>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{width:'100%',textAlign:'right'}} offset={12}>
                                        <FormItem
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {/* <Button loading={previewLoading} style={{margin:'4px 20px 4px 0'}} onClick={this.handlePreview}>
                                                预览
                                            </Button> */}
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
}),dispatch=>({
    saveNoticeContent:saveNoticeContent(dispatch)
}))(WrappedPopModal))