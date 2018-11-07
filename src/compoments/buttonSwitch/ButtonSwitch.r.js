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
        checkedChildren:PropTypes.string,
        unCheckedChildren:PropTypes.string,
        disabled:PropTypes.bool,
    }
    static defaultProps = {
        checkedChildren:'启',
        unCheckedChildren:'停',
        size:'small'
    }
    render(){
        const props = this.props;
        const {style,checked,checkedChildren,unCheckedChildren,size,disabled,onSuccess} = props;
        return(
            <Switch
                style={{...style}}
                checkedChildren={checkedChildren}
                unCheckedChildren={unCheckedChildren}
                size={size}
                onChange={(checked)=>{
                    onSuccess && onSuccess(checked)
                }}
                checked={ checked }
                disabled={disabled}
            />
        )
    }
}