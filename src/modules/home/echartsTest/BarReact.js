/**
 * Created by liuliyuan on 2018/4/10.
 */
import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'

export default class BarReact extends Component {

    constructor(props) {
        super(props)
        this.onResize = this.onResize.bind(this)
    }
    onResize=()=>{
        const { option={} } = this.props //外部传入的data数据
        let myChart = echarts.init(this.bar) //初始化echarts
        //设置options
        myChart.setOption(option)
        myChart.resize()
    }

    componentDidMount(){
        this.onResize()
        window.addEventListener('resize',this.onResize)
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize)
    }

    render() {
        return <div ref={b => this.bar = b} style={{width:'100%', height:'400px'}}></div>
    }
}