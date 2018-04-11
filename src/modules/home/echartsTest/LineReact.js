/**
 * Created by liuliyuan on 2018/4/10.
 */
import React,{Component} from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/line'

export default class LineReact extends Component {

    constructor(props) {
        super(props)
        this.onResize = this.onResize.bind(this)
    }
    onResize=()=>{
        const { option={} } = this.props //外部传入的data数据
        let myChart = echarts.init(this.line) //初始化echarts
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
        return <div ref={l => this.line = l} style={{width:'100%', height:'300px'}}></div>
    }
}