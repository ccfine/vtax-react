/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 14:17:49 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-18 15:00:05
 */
import React from "react";
import { Button, Modal, Icon,message } from "antd";
import PropTypes from "prop-types";
import {request} from 'utils';

export default class ButtonWithPut extends React.Component {
    static propTypes = {
        type:PropTypes.string.isRequired, //请求类型
        url: PropTypes.string.isRequired, // 操作地址
        params: PropTypes.any, // 操作参数
        buttonOptions: PropTypes.any,
        themeName: PropTypes.string,
        onSuccess: PropTypes.func,
        icon: PropTypes.element
    };
    static defaultProps = {
        themeName: "重算",
        icon: <Icon type="retweet" />
    };
    state = {
        isPutting: false // 是否正进行Put操作
    };
    toggleIsPutting = () => {
        this.setState({
            isPutting: !this.state.isPutting
        });
    };
    put = () => {
        const { url, params, themeName, onSuccess } = this.props;
        const modalRef = Modal.confirm({
            title: "友情提醒",
            content: `确定需要${themeName}吗？`,
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
                this.toggleIsPutting();
                request
                    .put(url, params)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success(`${themeName}成功`, 4);
                            onSuccess && onSuccess();
                        } else {
                            message.error(data.msg, 4);
                        }
                        this.toggleIsPutting();
                    })
                    .catch(err => {
                        this.toggleIsPutting();
                        message.error(err.message, 4);
                    });
            },
            onCancel() {
                modalRef.destroy();
            }
        });
    };
    render() {
        const { buttonOptions, themeName, icon } = this.props;
        const {isPutting} = this.state;

        return (
            <Button size="small" onClick={this.put} {...buttonOptions} loading={isPutting}>
                {icon}
                {themeName}
            </Button>
        );
    }
}
