/**
 * Created by liuliyuan on 2018/11/6.
 */
import React, { Component } from 'react'
import {message} from 'antd'
import {SearchTable} from 'compoments'
import PopModal from '../popModal'
import {request,composeBotton} from 'utils';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    margin:'0px 5px'
}

const searchFields =(getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:8,
        componentProps:{
            labelInValue:true,
        },
        fieldDecoratorOptions:{
            //initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        }
    }, {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble: getFieldValue("main") && getFieldValue("main").key,
            url:`/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
        }
    }
]
const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>{
            let submit = [
                    {
                        type:'action',
                        title:'编辑',
                        icon:'edit',
                        userPermissions:['1121004'],
                        onSuccess:()=>context.showModal('modify',record)
                    },
                    {
                        type:'action',
                        title:'提交',
                        icon:'check',
                        userPermissions:['1121010'],
                        onSuccess:()=>context.handleSubmit('/dataCollection/submit','提交',record)
                    }
                ],
                revoke = [
                    {
                        type:'action',
                        title:'撤回提交',
                        icon:'rollback',
                        userPermissions:['1121011'],
                        onSuccess:()=>context.handleSubmit('/dataCollection/revoke','撤回提交',record)
                    }
                ]
            let showIcon = parseInt(record.status, 0) === 2 ? revoke : submit;
            return composeBotton(showIcon)
        },
        fixed:'left',
        width:'100px',
        className:'text-center'
    },{
        title: '利润中心',
        dataIndex: 'profitCenterName',
        render:(text,record)=>(<span title='查看详情' style={pointerStyle} onClick={()=>context.showModal('look',record)}>{text}</span>),
    },{
        title: '是否已采集',
        dataIndex: 'finish',
        render:text=>{
            //是否处理1:已采集 0:未采集 ,
            let t = '';
            switch (parseInt(text,0)){
                case 0:
                    t=<span style={{ color: '#44b973' }}>未采集</span>;
                    break;
                case 1:
                    t=<span style={{ color: '#1795f6' }}>已采集</span>;
                    break;
                default:
                //no default
            }
            return t
        }
    }
];

export default class ProfitCenter extends Component{
    state={
        visible:false,
        modalConfig:{
            type:'',
        },
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=(type,record)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                record
            }
        })
    }

    handleSubmit = (url,text,record) =>{
        request.post(url,{
            mainId:record.mainId,
            mainName:record.mainId
        })
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${text}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${text}失败:${data.msg}`)
                }
            })
            .catch(err=>{
                message.error(err.message);
            })
    }

    render(){
        const {visible,modalConfig,tableKey} = this.state;
        return(
            <div className='oneLine'>
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/dataCollection/pc/list',
                    cardProps:{
                        title:'利润中心期初数据采集',
                    },
                }}
            >
                <PopModal tab="2" visible={visible} refreshTable={this.refreshTable} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
            </div>
        )
    }
}