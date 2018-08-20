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
        data:dataOne,
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
                                                    <span key={i} className="footer-amount">
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
    getBreifAmounts(dataSource){
        let amountList = [];
        for(let item of dataSource){
            for(let i of item.total){
                amountList.push(i);
                if(amountList.length>1)break;
            }
            if(amountList.length>1)break;
        }
        return amountList;
    }
    render() {
        const {totalSource,data,type} = this.props;
        let dataSource = [],briefData=[];
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

        briefData = this.getBreifAmounts(dataSource);
        return (
            <span className="popover-total-container">
            <Popover placement="topRight" content={this.popoverContent(totalSource, dataSource)} trigger="hover" >
                <Icon type="calculator"/>
                {
                    briefData.map((t,i)=>{
                        return  i===0 && (
                            <span key={i} className="total-amount">
                            {t.title}：<span className="amount-code">{fMoney(totalSource && totalSource[t.dataIndex])  || 0.00}</span>
                        </span>
                        )
                    })
                }
            </Popover>
        </span>

        );
    }
}