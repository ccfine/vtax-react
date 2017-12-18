/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 12:24
 * description  :
 */
import React,{Component} from 'react';
import { Badge,Icon,Popover} from 'antd';
import {request} from '../../utils'
import {withRouter,Link} from 'react-router-dom'

const data = [{
    id: '000000001',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: '你收到了 14 份新周报',
    datetime: '2017-08-09',
    type: '通知',
    content:'你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
}, {
    id: '000000002',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: '你推荐的 曲妮妮 已通过第三轮面试',
    datetime: '2017-08-08',
    type: '通知',
    content:'你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
}, {
    id: '000000003',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    title: '这种模板可以区分多种通知类型',
    datetime: '2017-08-07',
    read: true,
    type: '通知',
    content:'你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
}, {
    id: '000000004',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    title: '左侧图标用于区分不同的类型',
    datetime: '2017-08-07',
    type: '通知',
    content:'你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
}, {
    id: '000000005',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: '内容不要超过两行字，超出时自动截断',
    datetime: '2017-08-07',
    type: '通知',
    content:'你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报你收到了 14 份新周报',
}];

class Message extends Component{

    state={
        messages:[],
        total:0,
        messagesLoading: false,
    }

    fetchMessage = (activeKey=1) => {
        this.mounted && this.setState({
            messages: data,
            total:10
        });
    }

    mounted=true
    componentWillUnmount(){
        this.mounted=null;
    }

    componentDidMount(){
        this.fetchMessage()
    }
    handleClick = (item) =>{


    }
    render(){
        const {messages,total} = this.state;
        return(
            <Popover
                trigger="click"
                content={
                <div>
                    {
                        total === 0 ? (
                            <div style={{color:"#e9e9e9",padding:'20px 0',textAlign:'center'}}>
                                <Icon style={{
                                    fontSize:72,
                                }} type="bell" />
                                <p style={{marginTop:10}}>已读完所有消息</p>
                            </div>
                        ) : (
                            messages.map((item,i)=><MessageItem onClick={()=>this.handleClick(item)} key={i} {...item} />)
                        )
                    }
                    {
                        total > 5 && <div style={{textAlign:'center',marginLeft:-10,marginRight:-10,padding:'10px 0 5px 0',borderTop:'1px solid #e9e9e9'}}>
                            <Link to='/dashboard/messageList'>查看全部消息</Link>
                        </div>
                    }

                </div>
            } title="消息">
                <Badge count={total} >
                    <Icon type='bell' />消息
                </Badge>
            </Popover>
        )
    }

}

export default withRouter(Message);

const MessageItem = props =>{
    return(

        <div className="messages" style={{padding:'0 10px',maxWidth:300,marginBottom:10}}>
            <h3 className="title " style={{fontSize:14}} >
                <a onClick={props.onClick} style={{color:'#108ee9'}}>
                    <span >{props.title}</span>
                </a>
            </h3>
            <div className="messages-content" style={{marginBottom:5}}>
                {
                    props.content.length > 40 ? props.content.substring(0,40)+'...' : props.content
                }
            </div>
            <p style={{color:'#999'}}>{props.datetime}</p>

        </div>

    )
}