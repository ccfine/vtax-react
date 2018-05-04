/**
 * Created by liuliyuan on 2018/5/4.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Icon,Popover} from 'antd'
import {fMoney} from 'utils'

const dataOne = [
    {
        title:'本页合计',
        total:[
            {title: '本页金额', dataIndex: 'pageAmount'},
            {title: '本页税额', dataIndex: 'pageTaxAmount'},
            {title: '本页价税', dataIndex: 'pageTotalAmount'},
        ],
    },{
        title:'总计',
        total:[
            {title: '总金额', dataIndex: 'allAmount'},
            {title: '总税额', dataIndex: 'allTaxAmount'},
            {title: '总价税', dataIndex: 'allTotalAmount'},
        ],
    }
]
const dataTwo = [
    {
        title:'本页合计',
        total:[
            {title: '本页金额', dataIndex: 'pageAmount'},
            {title: '本页税额', dataIndex: 'pageTaxAmount'},
            {title: '本页价税', dataIndex: 'pageTotalAmount'},
            {title: '本页总价', dataIndex: 'pageTotalPrice'},
        ],
    },{
        title:'总计',
        total:[
            {title: '总金额', dataIndex: 'allAmount'},
            {title: '总税额', dataIndex: 'allTaxAmount'},
            {title: '总价税', dataIndex: 'allTotalAmount'},
            {title: '全部总价', dataIndex: 'allTotalPrice'},
        ],
    }
]
export default class TableTotal extends Component {
    static propTypes={
        totalSource:PropTypes.any.isRequired,
        data:PropTypes.array,
        type:PropTypes.number
    }
    static defaultProps={
        totalSource:[],
        type:1,
    }

    //显示合计总计
    popoverContent =(totalSource, data) => {
        return (
            <div className="footer-total">
                <div className="footer-total-meta">
                    {
                        data.map((item,i)=>{
                            return (
                                <div key={i}>
                                    <div className="footer-total-meta-title">
                                        <label>{item.title}：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        {
                                            item.total.map((t,i)=>{
                                                return (
                                                    <span key={i}>
                                                    {t.title}：<span className="amount-code">{fMoney(totalSource && totalSource[t.dataIndex])  || 0.00}</span>
                                                </span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>);
    }

    render() {
        const {totalSource,data,type} = this.props;
        let dataSource = [];
        switch(parseInt(type,0)){
            case 1:
                dataSource = dataOne;
                break
            case 2:
                dataSource = dataTwo;
                break
            case 3:
                dataSource = data;
                break
            default:
                dataSource = dataOne;
                return;
        }
        return (
            <span style={{display:'inline-block',marginLeft:15,color:'#FF9700'}}>
            <Popover placement="topRight" content={this.popoverContent(totalSource, dataSource)} trigger="click" >
                <Icon type="calculator" style={{ fontSize: 16, color: '#1890ff',marginRight:5 }} />
                {
                    dataSource.map((item,i)=>{
                        return (
                            <span key={i}>
                                {item.total[0].title}：<span className="amount-code" style={{marginRight:10}}>{fMoney(totalSource && totalSource[item.total[0].dataIndex]) || 0.00}</span>
                            </span>
                        )
                    })
                }
            </Popover>
        </span>

        );
    }
}