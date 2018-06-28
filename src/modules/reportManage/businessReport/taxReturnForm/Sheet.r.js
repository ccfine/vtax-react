/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import DataSheet from 'react-datasheet';
import {Spin, message } from 'antd'
import {request,fMoney} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'

export default class Sheet extends Component{
    static propTypes={
        grid:PropTypes.array,
        url:PropTypes.string,
        updateKey:PropTypes.any,
        overflow:PropTypes.string,
        composeGrid:PropTypes.func,
        scroll:PropTypes.object
    }
    static defaultProps = {
        grid:[],
        overflow:'wrap',
        scroll:{
            x:undefined,
            y:undefined
        },
        composeGrid:(prevGrid,asyncData,readOnly=true)=>{
            /**
             * prevGrid:原数据
             * asyncData:异步获取到的数据
             * ！！该方法必须返回一个数据源
             * */
            let nextData = [
                ...prevGrid
            ];
            const sheetData = asyncData;
            /** sheetData will like this:
             * {
                     *      'A1': {key: 'A1', value: '200', expr: '200'},
                     *      'A2': {key: 'A2', value: '200', expr: '=A1+A3', className:'equation'},
                     *      'A3': {key: 'A3', value: '', expr: ''},
                     *      'A4': {key: 'A4', value: '', expr: ''},
                     *      'B1': {key: 'B1', value: '', expr: ''},
                     *      'B2': {key: 'B2', value: '', expr: ''},
                     *  }
             * */
    
            return nextData.map(item=>{
                return item.map(deepItem=>{
                    if(deepItem.key && sheetData && sheetData[deepItem.key]){
                        return {
                            ...deepItem,
                            ...sheetData[deepItem.key],
                            value:(typeof sheetData[deepItem.key].value === 'string' && sheetData[deepItem.key].value!=='--' && (readOnly || sheetData[deepItem.key].readOnly)) ? fMoney(sheetData[deepItem.key].value) : sheetData[deepItem.key].value,
                                
                        }
                    }else{
                        return {...deepItem};
                    }
                 })
             })
        }
    }
    constructor(props){
        super(props);
        this.state={
            grid:props.grid,
            loading:false
        }
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey !== nextProps.updateKey){
            nextProps.form.resetFields();
            this.fetchSheetData(nextProps)
        }
    }
    fetchSheetData = ({url,params,readOnly,composeGrid}) =>{
        this.toggleLoading(true);
        request.get(url,{params})
            .then(({data})=>{
                if(data.code===200){
                    let nextData = composeGrid(this.props.grid,data.data,readOnly)
                    this.mounted && this.setState({
                        grid:nextData
                    },()=>{
                        this.toggleLoading(false);
                    })
                }else{
                    this.toggleLoading(false);
                    message.error(`报表数据获取失败:${data.msg}`,4)
                }
            }).catch(err=>{
                message.error(err.message)
                this.toggleLoading(false);
            })
    }
    /*onCellsChanged = (changes) => {
        const grid = this.state.grid.map(row => [...row])
        changes.forEach(({cell, row, col, value}) => {
            //获取修改后的返回的一条的数据
            if (grid[row] && grid[row][col]) {
                let newValue = grid[row][col].onChange && grid[row][col].onChange(grid[row][col].value,value,grid,this.props.params)
                grid[row][col] = {...grid[row][col], value:newValue}
            }
        })
        this.setState({grid})
    }*/

    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { loading, grid} = this.state;
        const {scroll,overflow,readOnly} = this.props;
        const xBool = !!scroll.x,
            yBool = !!scroll.y;
        return(
            <div style={{backgroundColor:'#fff',overflow:'hidden'}}>
                <div style={{overflowX:xBool ? 'scroll':'visible',overflowY:yBool ? 'scroll':'visible'}}>
                    <Spin spinning={loading}>
                        <div style={{
                            width:xBool ? scroll.x : 'auto',
                            height:yBool ? scroll.y : 'auto',
                        }}>
                            <DataSheet
                                overflow={overflow}
                                data={grid.map((i,row)=>i.map((di,col)=>{
                                    if(!readOnly && di.key && !di.readOnly){
                                        return {
                                            ...di,
                                            readOnly:false,
                                            component:<React.Fragment>
                                                <NumericInputCell
                                                initialValue={di.value}
                                                getFieldDecorator={this.props.form.getFieldDecorator}
                                                fieldName={`map.${di.key}`}
                                                editAble={true}
                                                componentProps={{valueType:di.type === 'rate'?'int':'float'}}
                                                /> 
                                                </React.Fragment>,
                                            forceComponent:true,
                                        }
                                    }else{
                                        return {...di, value:(di.type==='rate' &&  di.value && di.value!=='--')?`${di.value}%`:di.value,readOnly:true};
                                    }
                                }))}
                                valueRenderer={(cell) => cell ? cell.value : ''}
                                onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                                // onCellsChanged={this.onCellsChanged}
                            />
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }
}