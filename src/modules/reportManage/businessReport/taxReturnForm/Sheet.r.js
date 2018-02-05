/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import DataSheet from 'react-datasheet';
import {Spin,message} from 'antd'
import {request,fMoney} from '../../../../utils'
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
        composeGrid:(prevGrid,asyncData)=>{
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

            return nextData.map( item =>{
                return item.map( deepItem =>{
                    for(let key in sheetData){
                        if(deepItem.key === key){
                            return {
                                ...sheetData[key],
                                value:typeof sheetData[key]['value'] === 'number' ? fMoney(sheetData[key]) : sheetData[key]['value']
                            };
                        }
                    }
                    return deepItem;
                });
            });
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
            this.fetchSheetData(nextProps.url,nextProps.params)
        }
    }
    fetchSheetData = (url,params) =>{
        this.toggleLoading(true);
        request.get(url,{params})
            .then(({data})=>{
                if(data.code===200){
                    let nextData = this.props.composeGrid(this.state.grid,data.data)
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
            this.toggleLoading(false);
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { loading, grid,  } = this.state;
        const {scroll,overflow} = this.props;
        const xBool = !!scroll.x,
            yBool = !!scroll.y;
        return(
            <div style={{backgroundColor:'#fff',padding:10,overflow:'hidden'}}>
                <div style={{overflowX:xBool ? 'scroll':'visible',overflowY:yBool ? 'scroll':'visible'}}>
                    <Spin spinning={loading}>
                        <div style={{
                            width:xBool ? scroll.x : 'auto',
                            height:yBool ? scroll.y : 'auto',
                        }}>
                            <DataSheet
                                overflow={overflow}
                                data={grid}
                                valueRenderer={(cell) => cell ? (cell.value ? cell.value : '') : ''}
                                onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                            />
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }
}