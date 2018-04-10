/**
 * Created by liuliyuan on 2018/4/10.
 */
import React,{Component} from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/chart/candlestick' //引入雷达图
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/markLine'

export default class CandlestickReact extends Component {

    constructor(props) {
        super(props)
        this.onResize = this.onResize.bind(this)
    }
    onResize=()=>{
        const { option={} } = this.props //外部传入的data数据
        let myChart = echarts.init(this.candlestick) //初始化echarts
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
        return <div ref={c => this.candlestick = c} style={{width:'100%', height:'400px'}}></div>
    }
}