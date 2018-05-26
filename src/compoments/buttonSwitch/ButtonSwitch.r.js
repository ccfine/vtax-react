/**
 * Created by liuliyuan on 2018/5/26.
 */
import React,{Component} from 'react'
import {Switch} from 'antd';
import PropTypes from 'prop-types'

export default class ButtonSwitch extends Component{
    static propTypes= {
        checked: PropTypes.bool,
        onSuccess: PropTypes.func,
    }

    render(){
        const props = this.props;
        const {style,checked, onSuccess} = props;
        return(
            <Switch
                style={{...style}}
                checkedChildren="启"
                unCheckedChildren="停"
                size="small"
                onChange={
                    onSuccess && onSuccess()
                }
                checked={ checked }
            />
        )
    }
}