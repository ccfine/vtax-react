/**
 * Created by liuliyuan on 2018/5/19.
 */
import React,{Component} from 'react'
import {Button,Icon} from 'antd';
import PropTypes from 'prop-types'

export default class ButtonAdd extends Component{
    static propTypes= {
        disabled: PropTypes.bool,
        text: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func,
    }
    static defaultProps={
        text:'新增',
        icon:'plus'
    }

    render(){
        const props = this.props;
        const {text, icon, disabled, onClick} = props;
        return(
            <span style={props.style}>
                <Button size='small' disabled={disabled} onClick={()=>{
                    onClick && onClick()
                }}>
                   {
                       icon && <Icon type={icon} />
                   }
                    {
                        text
                    }
               </Button>
            </span>
        )
    }
}