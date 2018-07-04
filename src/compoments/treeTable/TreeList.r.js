/**
 * author       : liuliyuan
 * createTime   : 2017/9/29 16:55
 * description  :
 */
import React,{Component} from 'react';
import { Tree,Spin,message } from 'antd';
import PropTypes from 'prop-types'
import {request} from 'utils'

const TreeNode = Tree.TreeNode;
class TreeList extends Component {
    static propTypes={
        updateKey:PropTypes.number,
        url:PropTypes.string.isRequired,
        onSuccess:PropTypes.func,
        onSuccessRefresh:PropTypes.func,
    }
    static defaultProps={
        updateKey:Date.now(),
        showLine:false,
        isLoadDate:true,
    }

    state = {
        /*expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],*/

        treeData:[],
        //selectedNodes:undefined,
        editClassKey:Date.now()+'1',
        eidtLoading:false,
    }
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            request.get(this.props.url,{
                params:{id:treeNode.props.dataRef.id}
            }).then(({data}) => {
                if(data.code===200) {
                    //setTimeout(() => {
                        treeNode.props.dataRef.children = data.data;
                        this.setState({
                            treeData: [...this.state.treeData]
                        });
                        resolve();
                   // }, 1000);
                }
            })
            .catch(err => {
                message.error(err.message)
            });;

        });
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name}  key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} {...item} title={item.name} dataRef={item} />;
        });
    }

    fetchTree = (props) => {
        this.mounted && this.setState({ eidtLoading: true });
        request.get(this.props.url,{
        }).then(({data}) => {
            if(data.code===200) {
                this.mounted && this.setState({
                    treeData: [...data.data],
                    //expandedKeys: [`${data.data[0].id}`],
                    //autoExpandParent: false,
                    //selectedKeys: props && props.id && [`${props.id}`],
                    eidtLoading: false,
                })
            }
        })
        .catch(err => {
            this.mounted && this.setState({ eidtLoading: false });
            message.error(err.message)
        });
    }

    onSelect = (selectedKeys, info) => {
        const selectedNodes = info.node.props.dataRef;
        /*this.setState({
            selectedKeys,
            selectedNodes:selectedNodes,
        });*/
        /**
         * 成功之后回调，返回参数和数据
         * */
        this.props.treeOption.onSuccess && this.props.treeOption.onSuccess(selectedKeys,selectedNodes);
    }
    /*onExpand = (expandedKeys) => {
        //console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }*/

    componentDidMount(){
        this.fetchTree()
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            this.fetchTree(nextProps)
        }
    }

    render() {
        const props = this.props;
        const {treeData} = this.state;  //,selectedKeys,expandedKeys,autoExpandParent
        return (
            <Spin spinning={this.state.eidtLoading}>
                {/* <div style={{overflow:'auto',height: "auto"}}> */}

                    <Tree
                        key={props.updateKey}
                        /*onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                        */
                        showLine={props.showLine}
                        loadData={props.isLoadDate && this.onLoadData}
                        onSelect={this.onSelect}
                    >
                        {this.renderTreeNodes(treeData)}
                    </Tree>

                {/* </div> */}
            </Spin>

        );
    }
}

export default  TreeList



