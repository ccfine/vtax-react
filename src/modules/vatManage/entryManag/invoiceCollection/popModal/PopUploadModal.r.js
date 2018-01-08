/**
 * author       : liuliyuan
 * createTime   : 2018/1/4 11:02
 * description  :
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,DatePicker,message,Spin} from 'antd';
import {request} from '../../../../../utils'
import {CusFormItem,ManualFileUpload} from '../../../../../compoments'
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

class PopUploadModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state={
        fileList: [],
        uploading: false,

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        visible:false,
    }

    getFields(start,end) {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const children = [];
        const data = [
            {
                components:<CusFormItem.TaxMain
                    fieldName="taxSubjectId"
                    formItemStyle={formItemLayout}
                    form={this.props.form}
                    fieldDecoratorOptions={{
                        rules:[
                            {
                                required:true,
                                message:'请选择纳税主体'
                            }
                        ]
                    }}
                />,
                span:24,
            }, {
                label: '认证月份',
                type: 'monthPicker',
                fieldName: 'authMonth',
                span:24,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            },{
                label: '发票文件',
                type: 'fileUpload',
                fieldName: 'files',
                span:24,
                rules:[
                    {
                        required:true,
                        message:'请选择发票文件'
                    }
                ],
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;

            if(!data[i].components){
                if (data[i].type === 'text') {
                    inputComponent = <Input {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
                } else if (data[i].type === 'rangePicker') {
                    inputComponent = <DatePicker placeholder={`请输入${data[i].label}`} format="YYYY-MM-DD" style={{width:'100%'}} />;
                } else if (data[i].type === 'monthPicker') {
                    inputComponent = <MonthPicker  placeholder={`请输入${data[i].label}`} format="YYYY-MM" style={{width:'100%'}} />;
                } else if(data[i].type === 'fileUpload'){
                    inputComponent = <ManualFileUpload
                        name="选择文件"
                        setFileList={this.setFileList}
                    />
                }
            }else{
                inputComponent = data[i].components
            }

            if(!data[i].components) {
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        <FormItem
                            {...formItemLayout}
                            label={data[i].label}
                        >
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue,
                                rules: data[i].rules,
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }else{
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        {inputComponent}
                    </Col>
                );
            }


        }
        return children.slice(start, end || null);
    }

    setFileList=fileList=>{
        this.setState({
            fileList
        },()=>{
            this.props.form.setFieldsValue({
                files: this.state.fileList,
            });
        })
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let authMonth = values.authMonth && values.authMonth.format('YYYY-MM');
            if (!err) {
                let url=`/income/invoice/collection/upload/${values.taxSubjectId}/${authMonth}`;
                this.handleUpload(url)
            }
        })
    }

    handleUpload = (url) => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files', file);
        });

        this.setState({
            uploading: true,
        });

        request.post(url, formData
        )
            .then(({data}) => {
                if (data.code === 200) {
                    this.setState({
                        fileList: [],
                        uploading: false,
                    });
                    /**
                     * 关闭的时候清空表单
                     * */
                    this.props.form.resetFields();
                    message.success('导入成功！', 4)
                    //新增成功，关闭当前窗口,刷新父级组件
                    this.props.toggleUploadModalVisible(false);
                    this.props.updateTable();
                } else {
                    message.error(data.msg, 4)
                    this.setState({
                        uploading: false,
                    });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({
                    uploading: false,
                });

            })
    }

    componentDidMount(){

    }
    componentWillReceiveProps(nextProps){

    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const { uploading } = this.state;
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleUploadModalVisible(false)}
                width={450}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleUploadModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
                <Spin spinning={uploading}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                this.getFields(0,3)
                            }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopUploadModal)