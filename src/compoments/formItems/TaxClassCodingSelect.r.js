/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Select,Icon,Modal} from 'antd'
import {SearchTable} from '../../compoments'
import PropTypes from 'prop-types'
export default class TaxClassCodingSelect extends Component{
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
    render(){
        const {setFieldsValue,fieldName,onChange,conditionValue,disabled} = this.props;
        const {visible} = this.state;
        return(
            <div onClick={()=>{
                if(!disabled){
                    this.toggleModalVisible(true)
                }
            }}>
            <Select dropdownStyle={{display:'none'}} labelInValue {...this.props} disabled={disabled} placeholder='请选择税收分类' />
                <TaxClassSelectPage
                    visible={visible}
                    disabled={disabled}
                    toggleModalVisible={this.toggleModalVisible}
                    conditionValue={conditionValue}
                    fieldName={fieldName}
                    onChange={data=>onChange(data)}
                    setFieldsValue={setFieldsValue} />
         </div>
        )
    }
}


const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
const searchFields = [
    {
        label:'税收分类编码',
        type:'input',
        fieldName:'num',
        formItemStyle
    },
    {
        label:'商品名称',
        type:'input',
        fieldName:'commodityName',
        formItemStyle
    },
    {
        label:'应税项目',
        type:'input',
        fieldName:'taxableProjectName',
        formItemStyle
    },
    {
        label:'税率',
        type:'numeric',
        fieldName:'taxRate',
        componentProps:{
            valueType:'int'
        },
        formItemStyle
    }
]
const getColumns = context => [
    {
        title:'操作',
        key:'actions',
        width:'50px',
        className:'text-center',
        render:(text,record)=>(
            <span
                onClick={()=>{
                    const {setFieldsValue,fieldName,conditionValue} = context.props;
                    let fieldData =  {
                        ...record,
                        key:record.id,
                        label:record.num
                    }
                    let taxMethod = parseInt(conditionValue.taxMethod,0),
                        taxRate = parseFloat(conditionValue.taxRate);

                    //这里是针对外部传入的默认税率以及默认计税方法进行比较，有差异则提示
                    if( ( taxMethod===1 &&  taxRate !== parseFloat(record.commonlyTaxRate) ) || ( taxMethod===2 &&  taxRate !== parseFloat(record.simpleTaxRate) ) ){
                        Modal.confirm({
                            content: '1条发票税率与税收分类编码税率对应税率不一致，是否有差额开票情况，是否继续设置？',
                            onOk() {
                                setFieldsValue({
                                    [fieldName]:fieldData
                                })
                                setFieldsValue({
                                    'taxableProjectName':record.taxableProjectName,
                                })
                                context.props.onChange && context.props.onChange(fieldData)
                                context.props.toggleModalVisible(false)
                            },
                            onCancel() {

                            },
                        })
                    }else{
                        setFieldsValue({
                            [fieldName]:fieldData
                        })
                        setFieldsValue({
                            'taxableProjectName':record.taxableProjectName
                        })
                        context.props.onChange && context.props.onChange(fieldData)
                        context.props.toggleModalVisible(false)
                    }

                }}
                style={{cursor:'pointer',color:'#1890ff'}}>选择</span>
        )
    },
    {
        title: '税收分类编码',
        dataIndex: 'num',
        width:'18%'
    }, {
        title: '商品名称',
        dataIndex: 'commodityName',
        width:'18%'
    }, {
        title: '应税项目',
        dataIndex: 'taxableProjectName',
    }, {
        title: '一般增值税税率',
        dataIndex: 'commonlyTaxRate',
        width:'95px'
    }, {
        title: '简易增值税税率',
        dataIndex: 'simpleTaxRate',
        width:'95px'
    }
]
class TaxClassSelectPage extends Component{
    render(){
        const {disabled,toggleModalVisible,visible} = this.props;
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
                title="选择税收分类"
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={800}
                footer={false}
                style={{
                    position:'absolute',
                    height:'471px',
                    maxWidth:'80%',
                    left:0,
                    top:0,
                    bottom:0,
                    right:0,
                    padding:0,
                    margin:'auto'
                }}
                visible={visible}>
                    <SearchTable
                        searchOption={{
                            fields:searchFields,
                            cardProps:{
                                title:'',
                                extra:null
                            }
                        }}
                        tableOption={{
                            columns:getColumns(this),
                            pageSize:20,
                            url:'/tax/classification/coding/list',
                            cardProps:{
                                title:''
                            },
                            scroll:{
                                y:300
                            }
                        }}
                    />
                </Modal>
        </span>

        )
    }
}
