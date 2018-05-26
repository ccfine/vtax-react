/**
 * Created by liuliyuan on 2018/5/26.
 */
import React,{Component} from 'react'
import {Icon,Tooltip} from 'antd';
import PropTypes from 'prop-types'

const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
export default class ButtonTableAction extends Component{
    static propTypes= {
        title: PropTypes.string,
        icon: PropTypes.string,
        onSuccess: PropTypes.func,
    }

    render(){
        const props = this.props;
        const {style,title, icon, onSuccess} = props;
        return(
                <span title={title} style={{ ...pointerStyle, ...style }} onClick={() => {
                    onSuccess && onSuccess()
                }} >
                    <Tooltip placement="top" title={title}>
                            {
                                icon && <Icon type={icon} />
                            }
                    </Tooltip>

                </span>
        )
    }
}