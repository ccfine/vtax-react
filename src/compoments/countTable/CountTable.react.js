/**
 * author       : liuliyuan
 * createTime   : 2017/12/13 12:04
 * description  :
 */
import React, { Component } from 'react'
import {Table} from 'antd'
import './styles.css'

class CountTable extends Component {

    state = {
        h:'100%',
    }

    tableScroll=(i,j)=>{
        const dom = document.getElementById(this.props.id);
        const js_table = dom.getElementsByClassName('ant-table-body')[i];
        const js_footer_table = dom.getElementsByClassName('ant-table-body')[j];

        js_table.onscroll = () =>{
            console.log(js_table.offsetWidth, js_footer_table.offsetWidth,  Math.floor(js_table.scrollLeft))
            js_footer_table.scrollLeft =  Math.floor(js_table.scrollLeft);
        }
    }

    componentDidMount(){
        //this.timer = setTimeout(()=>{
        this.tableScroll(0,1);
        //},0)
    }

    componentWillUnmount() {
        //this.timer && clearTimeout(this.timer);
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        //const {h} = this.state
        return (
            <div id={this.props.id}>
                {/*<tfoot>
                <tr>
                    <td>Sum</td>
                    <td>$180</td>
                </tr>
                </tfoot>*/}
                {/*<Table
                    className="js-combin-table"
                    {...this.props.setting}
                    onChange={this.props.handleTableChange}
                    footer={currentData => <div style={{height:h, overflow:'hidden'}}>
                        <div style={{overflowY: this.props.setting.scroll && this.props.setting.scroll.y ? 'scroll' : 'auto',}}>
                            <Table
                                className="js-combin-footer-table"
                                {...this.props.setting2}
                            />
                        </div>
                    </div>
                    }
                />*/}

                    <Table
                        className="js-combin-table"
                        {...this.props.setting}
                    />
                    <Table
                        className="js-combin-footer-table"
                        {...this.props.setting2}
                        onChange={this.props.handleTableChange}
                    />
            </div>
        )
    }
}
export default CountTable


