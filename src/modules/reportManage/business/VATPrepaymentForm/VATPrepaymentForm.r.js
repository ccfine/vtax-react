/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import Datasheet from 'react-datasheet';
// import _ from 'lodash';
import 'react-datasheet/lib/react-datasheet.css';
class RoomTransactionFile extends Component{
    constructor (props) {
        super(props)
        this.state = {
            grid: [
                [
                    {readOnly: true, value: '项目及栏次',rowSpan:3,colSpan:5},
                    {value: '开具增值税专用发票', readOnly: true, colSpan:2},
                    {value: '开具其他发票', readOnly: true,colSpan:2},
                    {value: '未开具发票', readOnly: true,colSpan:2},
                    {value: '纳税检查调整', readOnly: true,colSpan:2},
                    {value: '合计', readOnly: true,colSpan:3},
                    {value: '服务、不动产和无形资产扣除项目本期实际扣除金额', readOnly: true,rowSpan:2},
                    {value: '扣除后', readOnly: true,colSpan:2},
                ],
                [
                    {readOnly: true,value: '销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},

                    {readOnly: true,value: '销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},

                    {readOnly: true,value: '销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},

                    {readOnly: true,value: '销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},

                    {readOnly: true,value: '销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},
                    {readOnly: true,value: '价税合计'},

                    {readOnly: true,value: '含税(免税)销售额'},
                    {readOnly: true,value: '销项(应纳)税额'},
                ],
                [
                    {readOnly: true,value: 1,key:'A1'},
                    {readOnly: true,value: 2},
                    {readOnly: true,value: 3,key:'A3'},
                    {readOnly: true,value: 4},
                    {readOnly: true,value: 5,key:'A5'},
                    {readOnly: true,value: 6},
                    {readOnly: true,value: 7,key:'A7'},
                    {readOnly: true,value: 8},
                    {readOnly: true,expr:'=A1+A3+A5+A7'},
                    {readOnly: true,value: '10=2+4+6+8'},
                    {readOnly: true,value: '11=9+10'},
                    {readOnly: true,value: 12},
                    {readOnly: true,value: '13=11-12'},
                    {readOnly: true,value: '14=13÷(100%+税率或征收率)×税率或征收率'},
                ],
                [
                    {readOnly: true,value: '一、一般计税方法计税',rowSpan:7},
                    {readOnly: true,value: '全部征税项目',rowSpan:5},
                    {readOnly: true,value: '17%税率的货物及加工修理修配劳务',colSpan:2},
                    {readOnly: true,value: 1},
                    {readOnly: true,value: '开票销售台账“销售额”，条件：项目及栏次=17%税率的货物及加工修理修配劳务,专用发票'},
                    {readOnly: true,value: '开票销售台账“销项税额”，条件：项目及栏次=17%税率的货物及加工修理修配劳务,专用发票'},
                    {readOnly: true,value: '开票销售台账“销售额”，条件：项目及栏次=17%税率的货物及加工修理修配劳务,开具其他发票'},
                    {readOnly: true,value: '开票销售台账“销项税额”，条件：项目及栏次=17%税率的货物及加工修理修配劳务,开具其他发票'},
                    {readOnly: true,value: '"数据来源：其他涉税调整台账“销售额” 条件：项目=涉税调整；业务类型=17%税率的货物及加工修理修配劳务"'},
                    {readOnly: true,value: '"数据来源：其他涉税调整台账“销项税额” 条件：项目=涉税调整；业务类型=17%税率的货物及加工修理修配劳务"'},
                    {readOnly: true,value: '"数据来源：其他涉税调整台账“销项税额” 条件：项目=涉税调整；业务类型=17%税率的货物及加工修理修配劳务"'},
                    {readOnly: true,value: '"数据来源：其他涉税调整台账“销项税额” 条件：项目=纳税检查调整；业务类型=17%税率的货物及加工修理修配劳务"'},
                    {readOnly: true,value: ''},
                    {readOnly: true,value: ''},
                    {readOnly: true,value: ''},
                    {readOnly: true,value: ''},
                    {readOnly: true,value: ''},
                    {readOnly: true,value: ''},
                ],
                [
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                ],
                [
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                    {value: 12},
                ]
                /*[{readOnly: true, value: 1}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
                [{readOnly: true, value: 2}, {value: 2}, {value: 4}, {value: 4}, {value: 4}],
                [{readOnly: true, value: 3}, {value: 1}, {value: 3}, {value: 3}, {value: 3}],
                [{readOnly: true, value: 4}, {value: 2}, {value: 4}, {value: 4}, {value: 4}]*/
            ]
        }
    }
    render () {
        return (
            <div style={{backgroundColor:'#fff'}}>
                <Datasheet
                    data={this.state.grid}
                    valueRenderer={(cell) => cell.value}
                    onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                    onChange={(modifiedCell, rowI, colJ, value) =>
                        this.setState({
                            grid: this.state.grid.map((row) =>
                                row.map((cell) =>
                                    (cell === modifiedCell) ? ({value: value}) : cell
                                )
                            )
                        })
                    }
                />
            </div>
        )
    }
}

export default RoomTransactionFile


/*
import React from 'react';
import _ from 'lodash';
import mathjs from 'mathjs';
import Datasheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
export default class MathSheet extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this);
        this.state = {
            'A1': {key: 'A1', value: '200', expr: '200',readOnly:true},
            'A2': {key: 'A2', value: '200', expr: '=A1+A3', className:'equation'},
            'A3': {key: 'A3', value: '', expr: ''},
            'A4': {key: 'A4', value: '', expr: ''},
            'B1': {key: 'B1', value: '', expr: ''},
            'B2': {key: 'B2', value: '', expr: ''},
            'B3': {key: 'B3', value: '', expr: ''},
            'B4': {key: 'B4', value: '', expr: ''},
            'C1': {key: 'C1', value: '', expr: ''},
            'C2': {key: 'C2', value: '', expr: ''},
            'C3': {key: 'C3', value: '', expr: ''},
            'C4': {key: 'C4', value: '', expr: ''},
            'D1': {key: 'D1', value: '', expr: ''},
            'D2': {key: 'D2', value: '', expr: ''},
            'D3': {key: 'D3', value: '', expr: ''},
            'D4': {key: 'D4', value: '', expr: ''}
        }
    }


    generateGrid() {
        return [0, 1,2,3,4].map((row, i) =>
            ['', 'A', 'B', 'C', 'D'].map((col, j) => {
                if(i == 0 && j == 0) {
                    return {readOnly: true, value: ''}
                }
                if(row === 0) {
                    return {readOnly: true, value: col}
                }
                if(j === 0) {
                    return {readOnly: true, value: row}
                }
                return this.state[col + row]
            })
        )
    }

    validateExp(trailKeys, expr) {
        let valid = true;
        const matches = expr.match(/[A-Z][1-9]+/g) || [];
        matches.map(match => {
            if(trailKeys.indexOf(match) > -1) {
                valid = false
            } else {
                valid = this.validateExp([...trailKeys, match], this.state[match].expr)
            }
        })
        return valid
    }

    computeExpr(key, expr, scope) {
        let value = null;
        if(expr.charAt(0) !== '=') {
            return {className: '', value: expr, expr: expr};
        } else {
            try {
                value = mathjs.eval(expr.substring(1), scope)
            } catch(e) {
                value = null
            }

            if(value !== null && this.validateExp([key], expr)) {
                return {className: 'equation', value, expr}
            } else {
                return {className: 'error', value: 'error', expr: ''}
            }
        }
    }

    cellUpdate(state, changeCell, expr) {
        const scope = _.mapValues(state, (val) => isNaN(val.value) ? 0 : parseFloat(val.value))
        const updatedCell = _.assign({}, changeCell, this.computeExpr(changeCell.key, expr, scope))
        state[changeCell.key] = updatedCell

        _.each(state, (cell, key) => {
            if(cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
                state = this.cellUpdate(state, cell, cell.expr)
            }
        })
        return state
    }

    onChange(changeCell, i, j, expr) {
        const state = _.assign({}, this.state)
        this.cellUpdate(state, changeCell, expr)
        this.setState(state)
    }
    render() {

        return (
            <Datasheet
                data={this.generateGrid()}
                valueRenderer={(cell) => cell.value}
                dataRenderer={(cell) => cell.expr}
                onChange={this.onChange}
            />
        )
    }

}*/
