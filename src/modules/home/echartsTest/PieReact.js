/**
 * Created by liuliyuan on 2018/4/10.
 */
import React,{Component} from 'react'

import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/pie'

export default class PieReact extends Component {

    constructor(props) {
        super(props)
        this.onResize = this.onResize.bind(this)
    }
    onResize=()=>{
        const { option={} } = this.props //外部传入的data数据
        let myChart = echarts.init(this.pie) //初始化echarts
        //设置options
        myChart.setOption(option)
        myChart.resize()
    }

    componentDidMount(){
        setTimeout(()=>{
            this.onResize()
        },200)
        window.addEventListener('resize',this.onResize)
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize)
    }


    render() {
        return <div ref={p => this.pie = p} style={{width: "100%", height: "200px"}}></div>
    }
}