import React,{Component} from 'react'
import {Modal,Form,Button,message,Spin,Row,Tree,Divider} from 'antd'
import {getFields,request} from '../../../../../../utils'
const TreeNode = Tree.TreeNode;
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 14 },
    },
  };
const setComItem=(initialValue,readonly=false,required=true)=>({
    span:'12',
    type:'input',
    formItemStyle:formItemLayout,
    fieldDecoratorOptions:{
        initialValue,
        rules:[
        {
            required:required,
            message:'必录'
        }
        ]
    },
    componentProps:{
        disabled:readonly
    }
});
class PopModal extends Component{
    state={
        record:undefined,
        loading:false,
        visible:false,
        treeData:[]
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible){
          this.setState({loading:true});
          request.get(`taxable/project/tree`).then(({data}) => {
            if (data.code === 200) {
                this.setState({loading:false,treeData:data.data});
            }
        });
        }
    }
    handleOk(){
        if(!this.state.record){
          message.error('请选择',4);
          return;
        }
        this.props.hideModal();
        this.props.select && this.props.select(this.state.record);
    }
    onSelect = (selectedKeys, info) => {
        this.setState({ record:info.node.props.dataRef});
      }
    renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.children && item.children.length>0) {
            return (
              <TreeNode title={`[${item.num}]${item.name}`} key={item.id} dataRef={item} selectable={false}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode title={`[${item.num}]${item.name}`} key={item.id} dataRef={item}/>;
        });
    }
    render(){
        const form= this.props.form;
        const {record ={}} = this.state, readonly=false
        return (
            <Modal 
            title='选择应税项目'
            visible={this.props.visible}
            width='700px'
            bodyStyle={{height:"450px",overflow:"auto"}}
            onCancel={()=>{this.props.hideModal()}}
            footer={[
                <Button key="back" onClick={()=>{this.props.hideModal()}}>取消</Button>,
                <Button key="submit" type="primary" onClick={()=>{this.handleOk()}}>
                  确认
                </Button>,
              ]}
            >
            <Spin spinning={this.state.loading}>
                <div style={{height:250}}>
                    <Tree
                    showLine={true}
                    onSelect={this.onSelect}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </div>
            </Spin>

            <Divider />
                <Form>
                    <Row>
                        {
                          getFields(form,[{
                              ...setComItem(record.commonlyTaxRate?(record.commonlyTaxRate+'%'):'',readonly,false),
                              label:'税率（一般计税）',
                              fieldName:'commonlyTaxRate',
                          },
                          {
                              ...setComItem(record.simpleTaxRate?(record.simpleTaxRate+'%'):'',readonly,false),
                              label:'征税率（简易计税）',
                              fieldName:'simpleTaxRate',
                          }
                          ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.description,readonly,false),
                            label:'填报说明',
                            fieldName:'description',
                            type:'textArea',
                            span:24,
                            formItemStyle:{
                                labelCol: {
                                  xs: { span: 12 },
                                  sm: { span: 5 },
                                },
                                wrapperCol: {
                                  xs: { span: 12 },
                                  sm: { span: 14 },
                                },
                              },
                            }
                        ])
                        }
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);