/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Select,Icon,Modal,Button} from 'antd'
import {SearchTable} from '../../compoments'
import PropTypes from 'prop-types'
export default class RoomCodeSelect extends Component{
    static propTypes={
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        label:PropTypes.string.isRequired,
        decoratorOptions:PropTypes.object,
        customizedValues:PropTypes.any
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
        //自定义的一些值
        customizedValues:{

        }
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
        const {setFieldsValue,fieldName,onChange,conditionValue,customizedValues,shouldChangeFields} = this.props;
        const {visible} = this.state;
        let selectDisabled = !!customizedValues['mainId'];
        return(
            <div onClick={()=>{
                if(selectDisabled){
                    this.toggleModalVisible(true)
                }
            }}>
            <Select dropdownStyle={{display:'none'}} labelInValue {...this.props} disabled={!selectDisabled} />
                <RoomCodeSelectPage
                    visible={visible}
                    disabled={!selectDisabled}
                    toggleModalVisible={this.toggleModalVisible}
                    customizedValues={customizedValues}
                    conditionValue={conditionValue}
                    fieldName={fieldName}
                    shouldChangeFields={shouldChangeFields}
                    onChange={data=>onChange(data)}
                    setFieldsValue={setFieldsValue} />
         </div>
        )
    }
}


const searchFields = context => (getFieldValue) =>{
    return [
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:12,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:!context.props.disabled,
                url:`/project/list/${context.props.customizedValues['mainId']}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:12,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'楼栋名称',
            fieldName:'buildingName',
            type:'asyncSelect',
            span:12,
            componentProps:{
                fieldTextName:'buildingName',
                fieldValueName:'buildingName',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('stagesId') || false,
                url:`/output/room/files/queryListByStagesId?stagesId=${getFieldValue('stagesId') || ''}`,
            }
        },
    ]
}
const getColumns = context => [
    {
        title:'操作',
        key:'actions',
        width:'10%',
        render:(text,record)=>(
            <Button
                size='small'
                onClick={()=>{
                    const {setFieldsValue,fieldName} = context.props;
                    let fieldData =  {
                        ...record,
                        key:record.roomCode,
                        label:record.roomCode
                    }
                    setFieldsValue({
                        [fieldName]:fieldData
                    })
                    context.props.shouldChangeFields.forEach(item=>{
                        setFieldsValue({
                            [item]:record[item]
                        })
                    })

                    context.props.onChange && context.props.onChange(fieldData)
                    context.props.toggleModalVisible(false)

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
        dataIndex: 'taxableItem',
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
class RoomCodeSelectPage extends Component{
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
                title="选择房间编码"
                maskClosable={false}
                onCancel={()=>toggleModalVisible(false)}
                width={800}
                bodyStyle={{
                    backgroundColor:'#fafafa'
                }}
                footer={false}
                style={{
                    maxWidth:'80%',
                }}
                visible={visible}>
                    <SearchTable
                        doNotFetchDidMount={true}
                        searchOption={{
                            fields:searchFields(this),
                            cardProps:{
                                title:'',
                                extra:null
                            }
                        }}
                        tableOption={{
                            columns:getColumns(this),
                            pageSize:20,
                            url:'/output/room/files/list',
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
