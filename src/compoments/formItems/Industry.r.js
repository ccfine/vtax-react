/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Icon,Select,Modal,Tree,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
const TreeNode = Tree.TreeNode;
export default class Industry extends Component{
    static propTypes={
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        label:PropTypes.string.isRequired,
        decoratorOptions:PropTypes.object,
    }
    static defaultProps={
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        },
        label:'field',
        decoratorOptions:{

        },
    }
    state={
        visible:false
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    mounted = true
    componentWillUnmount(){
        this.mounted=null;
    }
    /*componentWillReceiveProps(nextProps){
        console.log(nextProps.customizedValues.industry, this.props.customizedValues.industry)
    }*/
    render(){
        const {setFieldsValue,fieldName,onChange,disabled,conditionValue} = this.props;
        const {visible} = this.state;
        return(
            <div onClick={()=>{
                if(!disabled){
                    this.toggleModalVisible(true)
                }
            }}>
            <Select dropdownStyle={{display:'none'}} labelInValue {...this.props} disabled={disabled} placeholder='选择所属行业' />
                <IndustryTree
                    visible={visible}
                    disabled={disabled}
                    conditionValue={conditionValue}
                    toggleModalVisible={this.toggleModalVisible}
                    fieldName={fieldName}
                    onChange={data=>onChange(data)}
                    setFieldsValue={setFieldsValue} />
         </div>
        )
    }
}


class IndustryTree extends Component{

    state = {
        modalKey:Date.now()+'1',
        submitLoading:false,
        treeData:[],
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],
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
            //console.log(selectedNodes);

            if(selectedNodes.children.length > 0){
                message.warning('请选择末级明细行业！');
            }else{
                const {setFieldsValue,fieldName,onChange,toggleModalVisible} = this.props;
                let fieldData =  {
                    key:selectedNodes.key,
                    label:selectedNodes.title,
                }
                setFieldsValue({
                    [fieldName]: fieldData,
                });
                onChange && onChange(fieldData);
                toggleModalVisible(false)
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
        request.get('/taxsubject/list/industry')
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
            .catch(err => {
                this.mounted && this.setState({ submitLoading: false });
                message.error(err.message)
            })
    }
    //根据id查询行业
    getIndustryTitle=(id)=>{
        request.get(`/taxsubject/get/industry/${id}`)
            .then(({data})=>{
                if(data.code ===200){
                    const {setFieldsValue,fieldName,onChange} = this.props;
                    let fieldData =  {
                        key:data.data.key,
                        label:data.data.title,
                    }
                    setFieldsValue({
                        [fieldName]: fieldData,
                    });
                    onChange && onChange(fieldData);
                }
            })
            .catch(err => {
                message.error(err.message)
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
        if(typeof (nextProps.conditionValue.industry) !== 'undefined' && typeof (nextProps.conditionValue.industry) !== "object"){
            this.getIndustryTitle(nextProps.conditionValue.industry)
        }
    }
    render(){
        const {expandedKeys,autoExpandParent,selectedKeys} = this.state;
        const {toggleModalVisible,visible} = this.props;
        return(
        <span onClick={e=>{
            e && e.stopPropagation() && e.preventDefault()
        }}>
            <Modal
                title="选择所属行业"
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={500}
                footer={false}
                style={{
                    top:'40px',
                }}
                visible={visible}>
                    <div style={{overflow:'scroll',height:'500px'}}>
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
                </Modal>
        </span>

        )
    }
}
