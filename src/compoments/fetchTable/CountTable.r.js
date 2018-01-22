import React from 'react'
import {Table} from 'antd'

const reConstruct =({columns,dataSource,countSource,rowSelection})=>{
    if(!(Array.isArray(countSource) && Array.isArray(dataSource) && Array.isArray(columns)))return {columns,dataSource};
    const dataLength = dataSource.length;

    /**列数据 */
    const newColumns = columns.map(ele=>{
        let col = {...ele};
        col.render = (text,Record,index)=>{
            // 当老的render方法存在，并不在统计数据范围内，就执行原来的render方法
            if(ele.render && index<dataLength){
                return ele.render(text,Record,index);
            }
            return text;
        }

        return col;
    })

    /**选择的情况 ，如果*/
    let newRowSelection;
    if(rowSelection){
        newRowSelection ={...rowSelection};
        newRowSelection.getCheckboxProps = (record,...next)=>{
            return {disabled:record.selectDisabled};
        }
    }
    
    return {columns:newColumns,dataSource:[...dataSource,...countSource],rowSelection:newRowSelection};
}


export default (props)=>{
    const {columns,dataSource,rowSelection} = reConstruct(props);
    return <Table {...props} dataSource={dataSource} columns={columns} rowSelection={rowSelection}/>;
}