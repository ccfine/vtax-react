/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import DataSheet from 'react-datasheet';
import {Spin,message} from 'antd'
import {request} from '../../../../utils'
export default class Sheet extends Component{
    static propTypes={
        grid:PropTypes.array,
        url:PropTypes.string
    }
    static defaultProps = {
        grid:[]
    }
    constructor(props){
        super(props);
        this.state={
            grid:props.grid,
            loading:true
        }
    }
    componentDidMount(){
        this.props.url && this.fetchSheetData(this.props.url);
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    fetchSheetData = url =>{
        this.toggleLoading(true);
        request.get(url,{params:{mainId:'950212281515552770',taxMonth:'2018-02'}})
            .then(({data})=>{
                if(data.code===200){
                    let nextData = [
                        ...this.state.grid
                    ];
                    const sheetData = data.data;
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

                    nextData = nextData.map( item =>{

                        return item.map( deepItem =>{
                            for(let key in sheetData){
                                if(deepItem.key === key){
                                    return sheetData[key];
                                }
                            }
                            return deepItem;

                        });

                    });
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
        return(
            <div style={{backgroundColor:'#fff',padding:10}}>
                <Spin spinning={this.state.loading}>
                    <DataSheet
                        overflow={this.props.overflow || 'wrap'}
                        data={this.state.grid}
                        valueRenderer={(cell) => cell ? (cell.value ? cell.value : '') : ''}
                        onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                    />
                </Spin>
            </div>
        )
    }
}