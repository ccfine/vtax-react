/*
 * @Author: liuchunxiu 
 * @Date: 2018-06-21 23:40:20 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-29 19:57:44
 */
import React from 'react'
import {Tree,Input} from 'antd'
import debounce from 'lodash/debounce'
const TreeNode = Tree.TreeNode,
  Search = Input.Search;
// 查询，搜索所有被选中的数据，并展开其父节点,依赖于parentId
const getFilterKeys= function getFilterKeys(searchValue,treeData){
  let keys = new Set();
  let current=treeData;
  do{
    let next = [];
    current.forEach(element => {
      if(element.title.indexOf(searchValue)>-1){
        keys.add(element.parentId)
      }

      if(element.children){
        next=[...next,...element.children]
      }
    });
    current = next;
  }while(current && current.length>0);
  return Array.from(keys);
}

export default class SearchTree extends React.Component{
     constructor(props){
       super(props);
       this.getFilterKeys_ = debounce(this.getFilterKeys_,300)
     }
     state={
      checkedKeys:[],
      searchValue:undefined,
      expandedKeys:[],
      autoExpandParent: true,
     }
     componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
          const value = nextProps.value;
          this.setState({checkedKeys:value});
        }
      }
     onCheck=(checkedKeys,e)=>{
        this.setState({checkedKeys:checkedKeys})
        // 过滤掉非叶子节点
        this.props.onChange && this.props.onChange(checkedKeys)//e.checkedNodes.filter(ele=>!(ele.props.children && ele.props.children.length>0)).map(ele=>ele.key))
     }
     getFilterKeys_=(searchValue)=>{
        const {treeData=[]} = this.props;
        this.setState({
          expandedKeys:searchValue?getFilterKeys(searchValue,treeData):[],
          searchValue,
          autoExpandParent: true,
        })
     }
     onChange=(e)=>{
       let val =  e.target.value;
       this.setState({});
       this.getFilterKeys_(val);
     }
     onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    }
     renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.children && item.children.length>0) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode {...item} />;
        });
      }
     render(){
         const {treeData=[],treeWrapperStyle} = this.props;
         const {expandedKeys,checkedKeys,searchValue,autoExpandParent} = this.state;
         
            // 如果没数据，赋值会报key不存在，待数据加载好了再赋值上去
         return treeData.length>0?(<React.Fragment>
         <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={this.onChange} />
         <div style={treeWrapperStyle}>
          <Tree 
              {...this.props}
              checkable={true}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              onCheck={this.onCheck}
              onExpand={this.onExpand}
              filterTreeNode={(node)=>{
                  return searchValue && node.props.title.indexOf(searchValue.trim())>-1
              }}
              autoExpandParent={autoExpandParent}
              >
              {this.renderTreeNodes(treeData)}
          </Tree>
         </div></React.Fragment>):'loading'
     }
 }