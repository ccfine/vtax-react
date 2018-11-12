
import {notification } from 'antd';
let socket = undefined;
const wsURL = 'ws://10.10.179.67:82/';
export default function create(id){
    if(typeof(WebSocket) === `undefined`){
        console.error('您得客户端不支持websocket接收消息')
        return;
    }

    // 保证单例，如果socket存在，则直接返回；支支持单用户，不支持多用户
    if(socket){
        return;
    }

    socket = new WebSocket(
        wsURL + 'webSocketHandler/id=' + id
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
        socket=undefined;
    }
    socket.onclose = e => {
        console.log('连接断开，代码：' + e.code)
        socket=undefined;
    }
}