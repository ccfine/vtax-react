/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-11 10:25:44 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-11 10:51:11
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row, Select,Card,Col,Icon } from "antd";
import { getFields, request,setFormat, composeBotton } from "utils";
import { AsyncTable } from "compoments";
import debounce from 'lodash/debounce';
const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;
let timeout;

const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
    }
};

const pointerStyleDelete = {
    cursor:'pointer',
    color:'red',
    marginRight:10
}

const columns = (context,readonly) => {
    let operates = readonly?[]:[{
        title: '操作',
        width:'10%',
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=>(
            <span>
            {
                composeBotton([{
                    type:'action',
                    icon:'delete',
                    title:'删除',
                    style:pointerStyleDelete,
                    onSuccess:()=>{ context.deleteData(record.taxableProjectId) }
                }])
            }
        </span>
        )
    }]
    return [
        ...operates
        ,{
            title: '税收分类编码',
            dataIndex: 'num',
        }, {
            title: '货物或应税劳务、服务名称',
            dataIndex: 'commodityName',
        }
    ];
}

class PopModal extends Component {
    constructor(props){
        super(props)
        this.lastFetchId = 0;
        this.handleSearch = debounce(this.handleSearch, 800);
    }
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        commonlyTaxRateList:[],
        simpleTaxRateList:[],
        tableUpDateKey:Date.now(),
        value_num: '',
        data: [],
        fetching: false,
    };
    componentWillReceiveProps(props) {
        if(!props.visible){
            /**
             * 关闭的时候清空表单
             * */
            props.form.resetFields();
            this.setState({
                record:{},
                commonlyTaxRateList:[],
                simpleTaxRateList:[],

            })
        }
        if (props.visible && this.props.visible !== props.visible) {
            this.fetchTypeList()
            if (props.id) {
                this.setState({ formLoading: true });
                request
                    .get(`/incomeAndTaxRateCorrespondence/find/${props.id}`)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            this.setState({
                                formLoading: false,
                                record: data.data,
                                tableUpDateKey:Date.now()
                            });
                        }
                    })
                    .catch(err => {
                        this.setState({ formLoading: false });
                        message.error(err.message);
                    });
            } else {
                this.props.form.resetFields();
                this.setState({ formLoading: false, record: {} });
            }
        }
    }
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {} });
        this.props.hideModal();
    };
    showConfirm = () => {
        const modalRef = Modal.confirm({
            title: "友情提醒",
            content: "该删除后将不可恢复，是否删除？",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
                this.deleteRecord();
            },
            onCancel() {
                modalRef.destroy();
            }
        });
    };
    deleteRecord = (record = this.state.record) => {
        return request
            .delete(`/incomeAndTaxRateCorrespondence/delete/${record.id}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    message.success("删除成功", 4);
                    this.hideSelfModal();
                    this.props.update && this.props.update();
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    };
    handleOk= e =>{
        e && e.preventDefault()
        if (
            (this.props.action !== "modify" && this.props.action !== "add") ||
            this.state.formLoading
        ) {
            this.hideSelfModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let obj = Object.assign({}, this.state.record, values);

                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put("/incomeAndTaxRateCorrespondence/update", obj);
                    sucessMsg = "编辑成功";
                } else if (this.props.action === "add") {
                    result = request.post("/incomeAndTaxRateCorrespondence/add", obj);
                    sucessMsg = "增加成功";
                }

                this.setState({ loading: true });
                result &&
                result
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success(sucessMsg, 4);
                            this.setState({ loading: false });
                            this.props.update && this.props.update();
                            this.props.hideModal();
                        } else {
                            this.setState({ loading: false });
                            message.error(data.msg, 4);
                        }
                    })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ loading: false });
                    });
            }
        });
    }
    fetchTypeList=()=>{
        // 0 非房地产 1 房地产
        request.get(`sys/taxrate/list/commonlyTaxRate/0`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    commonlyTaxRateList:setFormat(data.data),
                });
            }
        })
            .catch(err => {
                message.error(err.message)
            })

        request.get(`sys/taxrate/list/simpleTaxRate/0`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    simpleTaxRateList:setFormat(data.data),
                });
            }
        })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentDidMount(){
        this.fetchTypeList()
    }

    handleSearch = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        request.get(`incomeAndTaxRateCorrespondence/queryTax`, {params: {num: value}}).then(({data}) => {
            if (fetchId !== this.lastFetchId) { // for fetch callback order
                return;
            }
            if (data.code === 200) {
                let list = [{
                    value: data.data.id,
                    text: data.data.taxableProjectName
                }]
                this.setState({
                    data:list,
                    fetching: false
                });
            }else{
                this.setState({ data: [], fetching: false });
                message.error(data.msg)
            }
        }).catch(err => {
            this.setState({ data: [], fetching: false });
            message.error(err.message)
        });
    }

    handleChange = (value) => {
        let params = {
            classificationId: value,
            subjectsId: this.props.id
        }
        this.setState({
            value_num:value,
            data: [],
            fetching: false,
        },()=>{
            const modalRef = Modal.confirm({
                title: '友情提醒',
                content: '是否添加？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk:()=>{
                    modalRef && modalRef.destroy();
                    request.post('incomeAndTaxRateCorrespondence/addSubjectTax', {...params}).then(({data}) => {
                        if (data.code === 200) {
                            this.setState({tableUpDateKey:Date.now()});
                            message.success('添加成功', 4);
                        } else {
                            message.error(data.msg);
                        }
                    }).catch(err => {
                        message.error(err.message)
                    })
                },
                onCancel() {
                    modalRef.destroy()
                },
            });
        });
    }

    deleteData = (id) => {
        confirm({
            title: '友情提醒',
            content: '删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                request.delete(`/incomeAndTaxRateCorrespondence/deleteSubjectTax/${id}`)
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success('删除成功!');
                            this.setState({tableUpDateKey:Date.now()});
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }

    render() {
        const readonly = this.props.action === "look";
        let { record = {},fetching } = this.state;
        const form = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "新增";
        } else if (this.props.action === "modify") {
            title = "编辑";
        }
        let buttons = [];

        this.props.action !== "look" &&
        buttons.push(
            <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={() => {
                    this.handleOk();
                }}
            >
                保存
            </Button>
        );
        this.props.action !== "look" &&
        buttons.push(
            <Button key="back" onClick={this.hideSelfModal}>
                取消
            </Button>
        );
        this.props.action === "modify" &&
        buttons.push(
            <Button type="danger" key="delete" onClick={this.showConfirm}>
                删除
            </Button>
        );
        this.props.action === "look" &&
        buttons.push(
            <Button key="close" onClick={this.hideSelfModal}>
                关闭
            </Button>
        );
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width="850px"
                bodyStyle={{ maxHeight: "420px", overflow: "auto" }}
                style={{top:'5%'}}
                onCancel={this.hideSelfModal}
                footer={buttons}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form onSubmit={this.handleOk}>
                        <Row>
                            {getFields(form, [
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.code,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入科目代码"
                                            }
                                        ]
                                    },
                                    label: "科目代码",
                                    fieldName: "code",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:'科目代码（末级明细科目）'
                                    }
                                }
                            ])}
                        </Row>

                        <Row>
                            {getFields(form, [
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.parentName,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入一级科目"
                                            }
                                        ]
                                    },
                                    label: "一级科目",
                                    fieldName: "parentName",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.name,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入二级科目"
                                            }
                                        ]
                                    },
                                    label: "二级科目",
                                    fieldName: "name",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:'请输入二级科目（对应收入类型）'
                                    }
                                }
                            ])}
                        </Row>

                        <Row>
                            {getFields(form, [
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.accountingEntries
                                    },
                                    label: "辅助核算项",
                                    fieldName: "accountingEntries",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:readonly?' ':'请输入辅助核算项'
                                    }
                                },
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.noTaxMethod,
                                        onChange:(e)=>{
                                            this.setState({record:{...record,noTaxMethod:e.target.checked}})
                                        },
                                        valuePropName: 'checked',
                                    },
                                    label: "不区分计税方法",
                                    fieldName: "noTaxMethod",
                                    type: "checkbox",
                                    componentProps: {
                                        disabled: readonly,
                                    }
                                }
                            ])}
                        </Row>

                        <Row>
                            {getFields(form, [
                                {
                                    label:'一般计税税率',
                                    fieldName:'commonlyTaxRateId',
                                    type:'select',
                                    span:12,
                                    formItemStyle: formItemLayout,
                                    options:this.state.commonlyTaxRateList,
                                    componentProps:{
                                        allowClear:true,
                                        disabled: readonly,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:record.commonlyTaxRateId,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择一般税率"
                                            }
                                        ]
                                    },
                                }
                            ])}
                            {!record.noTaxMethod && getFields(form, [
                                {
                                    label:'简易计税税率',
                                    fieldName:'simpleTaxRateId',
                                    type:'select',
                                    span:12,
                                    formItemStyle: formItemLayout,
                                    options:this.state.simpleTaxRateList,
                                    componentProps:{
                                        allowClear:true,
                                        disabled: readonly,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue: record.simpleTaxRateId,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择简易征收率"
                                            }
                                        ]
                                    },
                                }
                            ])}
                        </Row>

                        {/*<Row>
                         {getFields(form, [
                         {
                         span: 24,
                         formItemStyle: formItemLayout,
                         fieldDecoratorOptions: {
                         initialValue: record.commonlyTaxRate,
                         rules: [
                         {
                         required: true,
                         message: "请输入一般税率"
                         },{
                         pattern:/^100$|^\d{0,2}$/,
                         message:"请输入0~100之间的数字"
                         }
                         ]
                         },
                         label: "一般税率（%）",
                         fieldName: "commonlyTaxRate",
                         type: "numeric",
                         componentProps: {
                         allowNegative:false,
                         valueType:'int',
                         disabled: readonly,
                         placeholder:'请输入一般税率（单位：%）'
                         }
                         }
                         ])}
                         </Row>
                         <Row>
                         {!record.noTaxMethod && getFields(form, [
                         {
                         span: 24,
                         formItemStyle: formItemLayout,
                         fieldDecoratorOptions: {
                         initialValue: record.simpleTaxRate,
                         rules: [
                         {
                         required: true,
                         message: "请输入简易征收率"
                         },{
                         pattern:/^100$|^\d{0,2}$/,
                         message:"请输入0~100之间的数字"
                         }
                         ]
                         },
                         label: "简易征收率（%）",
                         fieldName: "simpleTaxRate",
                         type: "numeric",
                         componentProps: {
                         allowNegative:false,
                         valueType:'int',
                         disabled: readonly,
                         placeholder:readonly?' ':'请输入简易征收率（单位：%）'
                         }
                         }
                         ])}
                         </Row>*/}
                        <Row>
                            {getFields(form, [
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.taxItem
                                    },
                                    label: "税目",
                                    fieldName: "taxItem",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:readonly?' ':'请输入税目'
                                    }
                                }
                            ])}
                        </Row>
                    </Form>
                    { this.props.action !== "add" &&
                        <Form>
                            <Card title="添加税收分类编码" style={{marginTop:10}} >
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="税收分类编码" {...formItemLayout}>
                                            <Select
                                                disabled={readonly}
                                                showSearch
                                                value={this.state.value_num}
                                                style={{ width: '100%' }}
                                                placeholder={'请输入税收分类编码'}
                                                defaultActiveFirstOption={false}
                                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearch}
                                                onChange={this.handleChange}
                                                /*suffixIcon={
                                                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                                                }*/
                                            >
                                                {
                                                    this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <AsyncTable url={`/incomeAndTaxRateCorrespondence/relationList?subjectsId=${this.props.id}`}
                                            updateKey={this.state.tableUpDateKey}
                                            tableProps={{
                                                rowKey:record=>record.id,
                                                pagination:true,
                                                size:'small',
                                                columns:columns(this,readonly),
                                                scroll:{
                                                    x:"100%",
                                                    y:"200px",
                                                },
                                            }} />
                            </Card>
                        </Form>
                    }

                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
