/**
 * Created by liuliyuan on 2018/5/17.
 */
import React,{Component} from 'react'
import {Button,Form,message,Icon,Modal} from 'antd';
import PropTypes from 'prop-types'
import {request} from 'utils'

class ButtonReset extends Component{
    static propTypes={
            //type: PropTypes.oneOf(['post','put']).isRequired,
            text:PropTypes.string,
            icon:PropTypes.string,
            filters:PropTypes.object,
            url: PropTypes.string.isRequired,
            disabled:PropTypes.bool,
            onSuccess:PropTypes.func,
    }
    static defaultProps={
            text:'重算',
            icon:'retweet'
    }

    handleReset=()=>{
        const {text,url,filters,onSuccess} = this.props;
        Modal.confirm({
            title: '友情提醒',
            content: `确定要${text}吗`,
            onOk : ()=> {
                request.put(url,filters)
                    .then(({data}) => {
                        if(data.code===200){
                            message.success(`${text}成功!`);
                            onSuccess && onSuccess()
                        }else{
                            message.error(`${text}失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            }
        })
    }

    render(){
        const props = this.props;
        const {disabled,icon,text} = props;
        return(
            <span style={props.style}>
                <Button size='small' disabled={disabled} onClick={()=>{
                    this.handleReset()
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
export default Form.create()(ButtonReset)