/**Created by zhouzhe 2019.01.03
 * */
import React,{Component} from 'react'
import {Modal,message,Form,Row,Select,Spin} from 'antd'
import {request} from 'utils'
const Option = Select.Option
const FormItem = Form.Item

const formItemStyle = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
}

class PopModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            provinceList: [], //省份
            cityList: [], //地市
            countyList: [], //区县
            townList: [], //乡镇街道
            provinceLoading: false,
            cityLoading: false,
            countyLoading: false,
            townLoading: false
        }
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                provinceList: [], //省份
                cityList: [], //地市
                countyList: [], //区县
                townList: [], //乡镇街道
                provinceLoading: false,
                cityLoading: false,
                countyLoading: false,
                townLoading: false
            })
        }
        if(nextProps.visible && !this.props.visible){
            const { record } = this.props;
            // 首次打开弹窗 请求省份
            this.getlistArea(null, 'province');
            if (record.province) this.getlistArea(record.province, 'city');
            if (record.city) this.getlistArea(record.city, 'county');
            if (record.county) this.getlistArea(record.county, 'town');
        }
    }

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { record } = this.props;
                let params = {
                    province: values.province,
                    city: values.city,
                    county: values.county,
                    town: values.town,
                    id: record.id,
                }
                request.put('/taxsubject/update/project',params)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success(`编辑地址成功!`);
                            this.props.refreshTableThree();
                            this.props.toggleModal(false);
                        }else{
                            message.error(`编辑地址失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            }
        })
    }

    getlistArea = (parentId, type) => {
        this.setState({[`${type}Loading`]: true})
        request.get(`/taxsubject/list/area/${parentId}`)
            .then(({data})=>{
                if(data.code ===200){
                    const result = data.data;
                    this.setState({
                        [`${type}List`]: result,
                        [`${type}Loading`]: false
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
                this.setState({
                    [`${type}Loading`]: false
                })
            });
    }

    handleProvince = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            city: undefined,
            county: undefined,
            town: undefined,
        })
        this.setState({
            countyList: [], //区县
            townList: [], //乡镇街道
        })
        this.getlistArea(value, 'city')
    }

    handleCity = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            county: undefined,
            town: undefined
        })
        this.setState({
            townList: [], //乡镇街道
        })
        this.getlistArea(value, 'county')
    }

    handleCounty = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            town: undefined
        })
        this.getlistArea(value, 'town')
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {toggleModal, record} = this.props;
        const { provinceList, cityList, countyList, townList, provinceLoading, cityLoading, countyLoading, townLoading } = this.state;
        return(
            <div>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    title={'编辑地址'}
                    visible={this.props.visible}
                    width={500}
                    onCancel={()=>toggleModal(false)}
                    onOk={this.handleSubmit}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>

                            <Spin spinning={provinceLoading}>
                                <FormItem
                                    label="所属省份"
                                    {...formItemStyle}
                                >
                                    {getFieldDecorator('province', {
                                        initialValue: record.province || undefined,
                                        rules: [{ required: true, message: '请选择所属省份' }],
                                    })(
                                        <Select placeholder='请选择所属省份' onChange={this.handleProvince}>
                                            {
                                                provinceList.map(item => {
                                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Spin>

                            <Spin spinning={cityLoading}>
                                <FormItem
                                    label="所属地市"
                                    {...formItemStyle}
                                >
                                    {getFieldDecorator('city', {
                                        initialValue: record.city || undefined,
                                        // rules: [{ required: true, message: '请选择所属地市' }],
                                    })(
                                        <Select placeholder='请选择所属地市' onChange={this.handleCity}>
                                            {
                                                cityList.map(item => {
                                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Spin>

                            <Spin spinning={countyLoading}>
                                <FormItem
                                    label="所属区县"
                                    {...formItemStyle}
                                >
                                    {getFieldDecorator('county', {
                                        initialValue: record.county || undefined,
                                        // rules: [{ required: true, message: '请选择所属区县' }],
                                    })(
                                        <Select placeholder='请选择所属区县' onChange={this.handleCounty}>
                                            {
                                                countyList.map(item => {
                                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Spin>

                            <Spin spinning={townLoading}>
                                <FormItem
                                    label="所属街道乡镇"
                                    {...formItemStyle}
                                >
                                    {getFieldDecorator('town', {
                                        initialValue: record.town || undefined,
                                        // rules: [{ required: true, message: '请选择所属街道乡镇' }],
                                    })(
                                        <Select placeholder='请选择所属街道乡镇'>
                                            {
                                                townList.map(item => {
                                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Spin>

                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(PopModal)