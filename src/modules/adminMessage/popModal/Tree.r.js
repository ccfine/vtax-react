/**
 * author       : zhouzhe
 * createTime   : 2018/11/30 15:45
 * description  : 树结构
 */

import React, { Component } from 'react'
import {Tree,Spin} from 'antd'
// import difference from 'lodash/difference'
import isEqual from 'lodash/isEqual'
import './tree.less'

const TreeNode = Tree.TreeNode

class TreeDom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedKeys: [],
            expandedKeys: [],
            autoExpandParent: true,
            isFirst: true
        }
    }

    componentWillReceiveProps(nextProps){
        if ('value' in nextProps) {
            const value = nextProps.value
            this.setState({checkedKeys:value})
        }
        if (nextProps.treeData && nextProps.treeData.length !== 0 && this.state.isFirst) {
            this.setState({
                expandedKeys: [nextProps.treeData[0].key],
                isFirst: false
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(difference(nextState.checkedKeys, this.state.checkedKeys).length === 0 && difference(nextProps.treeData, this.props.treeData).length === 0) {
        //     return false
        // }
        if ( isEqual(nextProps, this.props) && isEqual(nextState, this.state) ) {
            return false
        }
        return true
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode {...item} />
        })
    }

    onCheck=(checkedKeys,e)=>{
        const { childrenKey } = this.props
        const newArr = this.filterKey(checkedKeys, childrenKey)
        this.setState({checkedKeys:newArr})
        this.props.onChange && this.props.onChange(newArr)
    }

    filterKey = (arr, otharr) => {
        return arr.filter(item => otharr.includes(item))
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    render() {
        const { treeData=[] } = this.props
        const { checkedKeys, expandedKeys, autoExpandParent } = this.state
        return (
            <div>
                <div className="publish-objects">发布对象</div>
                {
                    treeData.length > 0 ? (
                        <React.Fragment>
                            <div className="message-object">
                                <Tree
                                    checkable={true}
                                    checkedKeys={checkedKeys}
                                    expandedKeys={expandedKeys}
                                    onCheck={this.onCheck}
                                    onExpand={this.onExpand}
                                    autoExpandParent={autoExpandParent}
                                >
                                    {this.renderTreeNodes(treeData)}
                                </Tree>
                            </div>
                        </React.Fragment>
                    ) : (<Spin>
                        <React.Fragment><div className="message-object"></div></React.Fragment>
                    </Spin>)
                }
            </div>
        )
    }
}

export default TreeDom