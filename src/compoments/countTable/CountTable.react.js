/**
 * author       : liuliyuan
 * createTime   : 2017/12/13 12:04
 * description  :
 */
import React, { Component } from 'react'
import {Table} from 'antd'
import './styles.css'

class CountTable extends Component {

    tableScroll=(i,j)=>{
        const dom = document.getElementById(this.props.id);
        const js_table = dom.getElementsByClassName('ant-table-body')[i];
        const js_footer_table = dom.getElementsByClassName('ant-table-body')[j];
        js_table.onscroll = () =>{
            js_footer_table.scrollLeft = js_table.scrollLeft;
        }
    }

    componentDidMount(){
        this.timer = setTimeout(()=>{
            this.tableScroll(0,1);
        },0)
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const {props} = this;
        return (
            <div id={props.id}>
                <Table
                    className="js-combin-table"
                    {...props.setting}
                    footer={currentData =>
                        props.setting2 && <div>
                            <Table
                                className="js-combin-footer-table"
                                {...props.setting2}
                            />
                        </div>
                    }
                />
            </div>
        )
    }
}
export default CountTable