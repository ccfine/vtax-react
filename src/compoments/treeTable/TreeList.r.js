/**
 * author       : liuliyuan
 * createTime   : 2017/9/29 16:55
 * description  :
 */
import React,{Component} from 'react';
import { Tree,Icon,Spin } from 'antd';
import PropTypes from 'prop-types'
import {request} from '../../utils'

const TreeNode = Tree.TreeNode;
class TreeList extends Component {
    static propTypes={
        updateKey:PropTypes.number,
        url:PropTypes.string.isRequired,
    }
    static defaultProps={
        updateKey:Date.now(),
    }

    state = {
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],

        treeData:[],
        editClassKey:Date.now()+'1',
        eidtLoading:false,
    }
    onExpand = (expandedKeys) => {
        //console.log('onExpand', expandedKeys);
        //console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onSelect = (selectedKeys, info) => {
        console.log(selectedKeys, info);
        if(info.selectedNodes.length > 0){
            const selectedNodes = info.selectedNodes[0].props.dataRef;
            if(selectedNodes.level < 3){
                this.setState({
                    selectedKeys,
                    hasSelected:true,
                    params:{
                        uuid:'',
                        level:selectedNodes.level,
                        parentId:selectedNodes.key,
                        source:'1',
                    }
                });
            }else{
                this.setState({
                    selectedKeys,
                    hasSelected:false,
                });
            }

        }else{
            this.setState({
                selectedKeys,
                hasSelected:false,
            });
        }

        //this.props.getKeyVal({parentId:selectedKeys[0]});
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={<span><Icon type="folder-open" style={{ fontSize: 16 }} /> {item.name}</span>}  key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} dataRef={item} />;
        });
    }

    fetchTree = () => {
        this.mounted && this.setState({ eidtLoading: true });
        request.get(this.props.url,{
        }).then(({data}) => {
            const item = [];
            item.push(data.data);

            if(data.code===200) {
                this.mounted && this.setState({
                    treeData: [...item],
                    expandedKeys:[data.data.key],
                    eidtLoading: false,
                })
            }
        });
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            this.fetchTree()
        }
    }

    render() {
        const {expandedKeys,autoExpandParent,selectedKeys } = this.state;
        return (
            <Spin spinning={this.state.eidtLoading}>
                <div style={{overflow:'scroll',height: '600px'}}>
                    <Tree
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onSelect={this.onSelect}
                        selectedKeys={selectedKeys}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </div>
            </Spin>

        );
    }
}

export default  TreeList



