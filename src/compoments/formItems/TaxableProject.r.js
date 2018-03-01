/**
 * author       : liuliyuan
 * createTime   : 2018/2/2 11:27
 * description  :
 */
import React,{Component} from 'react'
import {Select,Icon,Modal,Tree,Form,Button,Row,message} from 'antd'
import PropTypes from 'prop-types'
import {request,getFields} from '../../utils'
const TreeNode = Tree.TreeNode;

export default class TaxableProject extends Component{
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
        console.log(nextProps.conditionValue.taxableProjectName, this.props.conditionValue.taxableProjectName)
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
                <Select dropdownStyle={{display:'none'}} labelInValue {...this.props} disabled={disabled} placeholder='请选择应税项目' />
                <TaxableProjectTreeForm
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


class TaxableProjectTreeForm extends Component{

    state = {
        submitLoading:false,
        treeData:[],
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],
        initData:{},
    }
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            request.get('/taxable/project/tree',{
                params:{id:treeNode.props.dataRef.id}
            }).then(({data}) => {
                if(data.code===200) {
                    //setTimeout(() => {
                    treeNode.props.dataRef.children = data.data;
                    this.setState({
                        treeData: [...this.state.treeData],
                    });
                    resolve();
                    // }, 1000);
                }
            });

        });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children && item.children.length>0) {
                return (
                    <TreeNode title={`[${item.num}]${item.name}`} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={`[${item.num}]${item.name}`} key={item.id} {...item} dataRef={item}/>;
        });
    }

    fetchTree = () => {
        this.mounted && this.setState({ submitLoading: true });
        request.get('/taxable/project/tree',{
        }).then(({data}) => {
            if(data.code===200) {
                this.mounted && this.setState({
                    treeData: [...data.data],
                    submitLoading: false,
                })
            }
        });
    }
    onSelect = (selectedKeys, info) => {
        this.setState({
            selectedKeys,
            initData: info.node.props.dataRef
        });
    }
    onExpand = (expandedKeys) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    componentDidMount() {
        this.fetchTree()
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    /*componentWillReceiveProps(nextProps){
        if(typeof (nextProps.conditionValue.taxableProject) !== 'undefined' && typeof (nextProps.conditionValue.taxableProject) !== "object"){

        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            this.fetchTree()
        }
    }*/

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(typeof (values.commonlyTaxRate) === 'undefined'  || typeof (values.simpleTaxRate) === 'undefined' || typeof (values.description) === 'undefined'){
                return message.warning('请选择应税项目！')
            }else{
                const {setFieldsValue,fieldName,onChange} = this.props;
                const {initData} = this.state
                let fieldData =  {
                    //...this.state.initData,
                    commonlyTaxRate:initData.commonlyTaxRate,
                    commonlyTaxRateId:initData.commonlyTaxRateId,
                    description:initData.description,
                    num:initData.num,
                    parentId:initData.parentId,
                    simpleTaxRate:initData.simpleTaxRate,
                    simpleTaxRateId:initData.simpleTaxRateId,
                    key:initData.id,
                    label:initData.name,
                }
                setFieldsValue({
                    [fieldName]: fieldData,
                });
                onChange && onChange(fieldData);
                this.props.toggleModalVisible(false)

            }
        });
    }

    render(){
        const {showLine,selectedKeys,initData,treeData} = this.state;
        console.log(initData);

        const {disabled,toggleModalVisible,visible} = this.props;
        const formItemStyle={
            labelCol:{
                span:8
            },
            wrapperCol:{
                span:16
            }
        }
        return(
            <span onClick={e=>{
                e && e.stopPropagation() && e.preventDefault()
            }}>
            {
                !disabled && (
                    <span
                        onClick={e=>{
                            e && e.stopPropagation() && e.preventDefault()
                            toggleModalVisible(true)
                        }}
                        style={{
                            display:'inline-block',
                            position:'absolute',
                            cursor:'pointer',
                            right:3,
                            top:6,
                            height:23,
                            width:23,
                            borderRadius:'3px',
                            textAlign:'center',
                            lineHeight:'23px',
                            backgroundColor:'#fff'
                        }}>
                <Icon type="search" />

            </span>
                )
            }

                <Modal
                    title='选择应税项目'
                    maskClosable={false}
                    destroyOnClose={true}
                    onCancel={()=>toggleModalVisible(false)}
                    width={800}
                    bodyStyle={{height:"450px",overflow:"auto"}}
                    footer={
                        <div>
                            <Button onClick={()=>toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" onClick={this.handleSubmit}>确认</Button>
                        </div>
                    }
                    style={{
                        maxWidth:'90%',
                        top:'40px',
                    }}
                    visible={visible}>
                    <div style={{height:250,overflow:'scroll'}}>
                         <Tree
                             showLine={showLine}
                             loadData={this.onLoadData}
                             onSelect={this.onSelect}
                             selectedKeys={selectedKeys}
                         >
                        {this.renderTreeNodes(treeData)}
                    </Tree>
                    </div>
                    <Form onSubmit={this.handleSubmit} >
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'税率（一般计税）',
                                        fieldName:'commonlyTaxRate',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled:true
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData.commonlyTaxRate ? (initData.commonlyTaxRate+'%') : undefined,
                                            /*rules:[
                                                {
                                                    required:true,
                                                    message:'选择税率（一般计税）'
                                                }
                                            ]*/
                                        }
                                    },{
                                        label:'征税率（简易计税）',
                                        fieldName:'simpleTaxRate',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled:true
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData.simpleTaxRate ? (initData.simpleTaxRate+'%') : undefined,
                                            /*rules:[
                                                {
                                                    required:true,
                                                    message:'选择征税率（简易计税）'
                                                }
                                            ]*/
                                        }
                                    }, {
                                        label: '填报说明',
                                        fieldName: 'description',
                                        type: 'textArea',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:4
                                            },
                                            wrapperCol:{
                                                span:20
                                            },
                                        },
                                        componentProps: {
                                            disabled:true
                                        },
                                        fieldDecoratorOptions: {
                                            initialValue: initData.description,
                                            /*rules:[
                                                {
                                                    required:true,
                                                    message:'选择填报说明'
                                                }
                                            ]*/
                                        }
                                    }
                                ])
                            }
                        </Row>
                    </Form>

                </Modal>
        </span>

        )
    }
}
TaxableProjectTreeForm = Form.create({})(TaxableProjectTreeForm);