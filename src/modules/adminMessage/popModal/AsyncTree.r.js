/**
 * author       : zhouzhe
 * createTime   : 2018/11/30 12:21
 * description  : 异步树结构
 */

import React, { Component } from 'react'
import {message,Form} from 'antd'
import {request} from 'utils'
import Tree from './Tree.r'

const FormItem = Form.Item
// 将后台数据转换为前端需要的数据
const transformData =function transformData(arr,fieldValueName,fieldTextName){
    return arr.map(ele=>{
        let res = {
            key:ele[fieldValueName],
            value:ele[fieldValueName],
            title:`${ele.code}-${ele[fieldTextName]}`,
            parentId:ele["parentId"],
        };
        if(ele.children && ele.children.length>0){
            res.children = transformData(ele.children,fieldValueName,fieldTextName)
        }
        return res;
    })
}

class AsyncTree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {
        this.fetch(this.props.url)
    }

    componentWillReceiveProps(nextProps){
        if(this.props.url !== nextProps.url){
            this.fetch(nextProps.url)
        }
    }

    fetch(url){
        if(!url)return
        request.get(url || this.props.url)
            .then(({data}) => {
                if(data.code===200){
                    const result = transformData(data.data.records || data.data,'id','name');
                    this.setState({
                        dataSource:result
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    render() {
        const { dataSource } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <FormItem>
                {getFieldDecorator('orgIds',{
                    initialValue: this.props.initialValue || [],
                    rules: [{ required: true, message: '请选择发布对象' }],
                })(
                    <Tree 
                        treeData={dataSource}
                    />
                )}
            </FormItem>
        )
    }
}

export default AsyncTree