import React from 'react'
import { Modal, Button, Popconfirm, message, Icon, List, Row, Col, Upload } from 'antd'
import { request } from '../../../../../utils'
import { FileExport } from '../../../../../compoments'

const getProps = context => ({
    action: `${window.baseURL}${context.props.url}/file/upload/${context.props.id}`,
    onChange: context.handleChange,
    multiple: false,
    headers: {
        Authorization: request.getToken(),
    },
    showUploadList: false,
    name: 'files',
    beforeUpload: context.beforeUpload
});

const noneStyle ={border:'none',color: '#1890ff',backgroundColor:'transparent'};

const MyA = (props)=>{
    return <a {...props}>{props.children}</a>
}

class FileModal extends React.Component {
    state = {
        uid: undefined,//正在上传文件uid
        loading: false,
        uploadLoading: false,
        data: []
    }
    beforeUpload = (file, fileList) => {
        // 文件大小判断
        this.setState({ uid: file.uid, uploadLoading: true });
        return true;
    }
    handleChange = (info) => {
        info.fileList.forEach((file) => {
            if (file.uid === this.state.uid && file.response) {
                // 判断文件上传是否成功
                if (file.response.code && file.response.data) {
                    this.updateFileList(this.props.url, this.props.id);
                } else {
                    message.error('上传失败，请重试', 4);
                }

                this.setState({ uid: undefined, uploadLoading: false });
            }
            return file;
        });
    }
    deleteRecord(record) {
        request.delete(`/${this.props.url}/file/delete/${record.id}`).then(({ data }) => {
            if (data.code === 200) {
                this.updateFileList(this.props.url, this.props.id);
            } else {
                message.error(data.msg, 4);
            }
        })
            .catch(err => {
                message.error(err.message);
            })
    }
    updateFileList = (url, id) => {
        this.setState({ loading: true });
        request.get(`/${url}/file/list/${id}`).then(({ data }) => {
            if (data.code === 200) {
                this.setState({ data: data.data, loading: false });
            }
        })
    }
    componentWillReceiveProps(props) {
        if (this.props.visible !== props.visible) {
            if (props.id) {
                this.updateFileList(props.url, props.id);
            }
        }
    }
    render() {
        const { loading, data } = this.state;
        return (
            <Modal
                title='附件信息'
                visible={this.props.visible}
                width='500px'
                bodyStyle={{ height: "400px", overflow: "auto", padding: '20px' }}
                onCancel={() => { this.props.hideModal() }}
                footer={[
                    <Button key="close" type="primary" onClick={this.props.hideModal}>
                        关闭
                    </Button>,
                ]}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Upload {...getProps(this) }>
                    <Button loading={this.state.uploadLoading} size='small'>
                        <Icon type="upload" /> 上传
                    </Button>
                </Upload>
                <List
                    style={{ marginTop: '10px' }}
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item actions={[
                            <Popconfirm title="确定要删除吗?" onConfirm={() => { this.deleteRecord(item) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                <a style={noneStyle}><Icon type="delete"/> 删除</a>
                            </Popconfirm>,
                            <FileExport url={`/${this.props.url}/file/download/${item.id}`} size='small' title='下载' WrapComponent={MyA}/>
                        ]}>
                            <div style={{ width: '100%', position: 'static' }}>
                                <Row>
                                    <Col span={16}>
                                        <i className="anticon anticon-paper-clip"></i>
                                        <a style={{ marginLeft: 10 }} href={`${window.baseURL}/${this.props.url}/file/download/${item.id}`} target="_blank" title={item.originalFileName}>{item.originalFileName}</a>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        {item.createdDate}
                                    </Col>
                                </Row>
                            </div>

                        </List.Item>
                    )}
                />

            </Modal>
        );
    }
}

export default FileModal;