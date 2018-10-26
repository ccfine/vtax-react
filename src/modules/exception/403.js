/**
 * Created by liuliyuan on 2018/5/30.
 */
import React from 'react'
import {Button} from 'antd'
import {Link} from 'react-router-dom'
import {request} from 'utils'
import Exception from 'compoments/exception';

export default class Exception403 extends React.Component{
    state={
        ssoPath:'/web'
    }
    componentDidMount(){
        request.post('/oauth/loadParameter').then(({data})=>{
            if(data.code === 200){
                const result = data.data;
                this.mounted && this.setState({
                    ssoPath:result.bipPath,
                })
            }
        }).catch(err=>{
        })
    }
    render(){
        const {ssoPath} = this.state;
        return <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} 
        actions={
            <a href={ssoPath} target="_self" id='redirectLink'>
                <Button type="primary">跳转至登陆</Button>
            </a>
        }/>
    }
}
