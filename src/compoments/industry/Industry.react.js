/**
 * author       : liuliyuan
 * createTime   : 2017/12/20 9:58
 * description  :
 */
import React, { Component } from 'react'
import { Tree,Modal,Spin,Icon,message } from 'antd';
import {request} from '../../utils'
const TreeNode = Tree.TreeNode;

class Industry extends Component {

    state = {
        modalKey:Date.now()+'1',
        submitLoading:false,
        treeData:[],
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],
    }

    handleOk = (e) => {
        this.props.changeVisable(false);
    }

    handleCancel = (e) => {
        this.props.changeVisable(false);
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
        if(info.selectedNodes.length > 0){
            const selectedNodes = info.selectedNodes[0].props.dataRef;
            console.log(selectedNodes);

            if(selectedNodes.children.length > 0){
                message.warning('请选择末级明细行业！');
            }else{
                this.props.changeIndustry({
                    key:selectedNodes.key,
                    title:selectedNodes.title,
                })
                this.props.changeVisable(false);
            }


        }
    }

    renderTreeNodes = data => {
        return data && data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode title={<span><Icon type="folder-open" style={{ fontSize: 16 }} /> {item.title}</span>}  key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.title} dataRef={item} />;
        });
    }


    //所属行业
    getIndustry=()=>{
        this.mounted && this.setState({ submitLoading: true });
        request.get(`${this.props.url}`)
            .then(({data})=>{
                if(data.code===200) {
                    //console.log(data.data)
                    this.mounted && this.setState({
                        treeData: [...data.data],
                        expandedKeys:[data.data.key],
                        submitLoading: false,
                    })
                }
            })
    }

    componentDidMount() {
        this.getIndustry()
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        const {expandedKeys,autoExpandParent,selectedKeys} = this.state;
        const {visible, title } = this.props;
        return (
            <Modal
                title={title}
                key={this.state.modalKey}
                maskClosable={false}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确定"
                cancelText="取消"
                width="500px"
            >
                <Spin spinning={this.state.submitLoading}>
                    <div style={{overflow:'scroll',maxHeight: '90%'}}>
                        <Tree
                            showLine
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
            </Modal>

        )
    }
}
export default Industry