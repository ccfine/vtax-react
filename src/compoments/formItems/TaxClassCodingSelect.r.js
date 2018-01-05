/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Select,Icon,Modal,Button} from 'antd'
import {SearchTable} from '../../compoments'
import PropTypes from 'prop-types'
export default class TaxClassCodingSelect extends Component{
    static propTypes={
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        label:PropTypes.string.isRequired,
        decoratorOptions:PropTypes.object
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

        }
    }
    mounted = true
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const {setFieldsValue,fieldName,onChange,conditionValue} = this.props;
        return(
            <div>
            <Select labelInValue {...this.props} disabled />
                <TaxClassSelectPage
                    conditionValue={conditionValue}
                    fieldName={fieldName}
                    onChange={data=>onChange(data)}
                    setFieldsValue={setFieldsValue} />
         </div>
        )
    }
}


const searchFields = [
    {
        label:'税收分类编码',
        type:'input',
        fieldName:'num',
    },
    {
        label:'商品名称',
        type:'input',
        fieldName:'commodityName'
    },
    {
        label:'应税项目',
        type:'input',
        fieldName:'taxableProjectName',
    },
    {
        label:'税率',
        type:'input',
        fieldName:'taxRate',
    }
]
const getColumns = context => [
    {
        title:'操作',
        key:'actions',
        width:'10%',
        render:(text,record)=>(
            <Button
                size='small'
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
                                    'taxableItem':record.taxableProjectName
                                })
                                context.props.onChange && context.props.onChange(fieldData)
                                context.toggleModalVisible(false)
                            },
                            onCancel() {

                            },
                        })
                    }else{
                        setFieldsValue({
                            [fieldName]:fieldData
                        })
                        setFieldsValue({
                            'taxableItem':record.taxableProjectName
                        })
                        context.props.onChange && context.props.onChange(fieldData)
                        context.toggleModalVisible(false)
                    }

                }}
                style={{cursor:'pointer',color:'#1890ff'}}>选择</Button>
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
        width:'18%'
    }, {
        title: '一般增值税税率',
        dataIndex: 'commonlyTaxRate',
        width:'18%'
    }, {
        title: '简易增值税税率',
        dataIndex: 'simpleTaxRate',
        width:'18'
    }
]
class TaxClassSelectPage extends Component{
    state={
        visible:false
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    render(){
        const {visible} = this.state;
        return(
        <span>
            <span
                onClick={(e)=>{
                    e && e.preventDefault() && e.stopPropagation();
                    this.toggleModalVisible(true)
                }}
                style={{
                    display:'inline-block',
                    position:'absolute',
                    cursor:'pointer',
                    right:3,
                    top:5,
                    height:30,
                    width:30,
                    borderRadius:'3px',
                    textAlign:'center',
                    lineHeight:'30px',
                    backgroundColor:'#fff'
                }}>
                <Icon type="search" />

            </span>
            <Modal
                title="选择税收分类"
                maskClosable={false}
                onCancel={()=>this.toggleModalVisible(false)}
                width={1920}
                footer={false}
                style={{
                    maxWidth:'80%',
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
