/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 10:01
 * description  :
 */
import React,{Component} from 'react';
import {Spin} from 'antd'
import {Map} from 'immutable'
export default class IframePage extends Component{
    state= {
        $$data:Map({
            loaded:false
        })
    }
    onLoad(){
        this.setState({$$data:this.state.$$data.set('loaded',true)},()=>{
            this.onResize()
        })
    }
    componentDidMount(){
        window.addEventListener('resize',this.onResize,false)
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize)
    }
    onResize=()=>{
        this.refs.iframe.height=document.documentElement.clientHeight;
    }
    render(){
        return(
            <Spin spinning={!this.state.$$data.get('loaded')} style={{minHeight:500}}>
                <iframe ref="iframe" height={500} style={{
                    width:'100%',border:0,
                }} onLoad={this.onLoad.bind(this)} title={this.props.title} {...this.props}>
                </iframe>
            </Spin>
        )
    }
}