
import {notification } from 'antd';
export default function create(id){
    if(typeof(WebSocket) === `undefined`){
        console.error('您得客户端不支持websocket接收消息')
        return;
    }

    let socket = new WebSocket(
        window.wsURL + 'webSocketHandler/id=' + id
    )
    socket.onopen = () => {
        console.log('连接成功')
    }
    socket.onmessage = ({data}) => {
        data = JSON.parse(data);
        //{title:'标题',type:'[info,error]',msg:'',close:'是否关闭websocket连接 1是 0否'}
        if(parseInt(data.close,10) === 1){
            socket.close()
        }
        data.type  && ['success','error','info','warning'].indexOf(data.type)>0 && notification[data.type]({
            message: data.title,
            description: data.msg,
        });
    }
    socket.onerror = e => {
        console.log('连接错误')
    }
    socket.onclose = e => {
        console.log('连接断开，代码：' + e.code)
    }
}