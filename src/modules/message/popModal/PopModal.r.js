/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 17:33
 * description  : 公告中心
 */

import React, { Component } from 'react'
import {Modal} from 'antd'

class PopModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { visible, toggleModalVisible } = this.props;
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => toggleModalVisible(false)}
                width={900}
                visible={visible}
                title='编辑公告'
                footer={null}
            >
                <h1>内容</h1>
            </Modal>
        )
    }
}

export default PopModal