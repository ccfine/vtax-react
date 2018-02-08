/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Select,Icon,Modal} from 'antd'
import {SearchTable} from '../../compoments'
import {fMoney} from '../../utils'
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
        const {setFieldsValue,fieldName,onChange,conditionValue,disabled,customizedValues,shouldChangeFields} = this.props;
        const {visible} = this.state;

        //只有查看的时候disabled会返回true，如果是查看的话，直接禁用，如果不是查看，则根据有没有mainID来决定禁用
        let selectDisabled = false;
        if(disabled){
            selectDisabled = false
        }else{
            selectDisabled = !!customizedValues['mainId'];
        }
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
                    mainId={customizedValues['mainId']}
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
        width:'60px',
        className:'text-center',
        render:(text,record)=>(
            <span
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
                style={{cursor:'pointer',color:'#1890ff'}}>选择</span>
        )
    },
    {
        title: '楼栋名称',
        dataIndex: 'buildingName',
        width:'90px'
    }, {
        title: '单元',
        dataIndex: 'element',
        width:'70px',
    }, {
        title: '房号',
        dataIndex: 'roomNumber',
        width:'70px'
    }, {
        title: '客户名称',
        dataIndex: 'customerName',
        width:'90px'
    }, {
        title: '身份证号/纳税识别号',
        dataIndex: 'taxIdentificationCode',
        width:'150px'
    }, {
        title: '房间编码',
        dataIndex: 'roomCode',
        width:'65px'
    }, {
        title: '成交总价',
        dataIndex: 'totalPrice',
        className:'table-money',
        render:text=>fMoney(text)
    }
]
class RoomCodeSelectPage extends Component{
    render(){
        const {disabled,toggleModalVisible,visible,mainId} = this.props;
        const filters = {
            mainId
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
                title="选择房间编码"
                maskClosable={false}
                onCancel={()=>toggleModalVisible(false)}
                destroyOnClose={true}
                width={800}
                bodyStyle={{
                    backgroundColor:'#fafafa'
                }}
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
                        doNotFetchDidMount={true}
                        searchOption={{
                            filters,
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
                                y:200
                            }
                        }}
                    />
                </Modal>
        </span>

        )
    }
}
