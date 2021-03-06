/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from './popModal'
import {composeBotton} from 'utils'

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    },
    {
        label:'税(费)种',
        fieldName:'taxType',
        type:'select',
        options:[
            {
                text:'增值税',
                value:'1'
            },
            {
                text:'企业所得税',
                value:'2'
            }
        ]
    },
    {
        label:'所属期起止',
        type:'rangePicker',
        fieldName:'subordinatePeriod',
        fieldDecoratorOptions:{}
    },
]
const getColumns = (context) => [
    {
        title:'操作',
        key:'actions',
        render:(text,record)=> composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:['1111004'],
            onSuccess:()=>{
                context.setState({
                    modalConfig:{
                        type:'edit',
                        id:record.id
                    },
                    initData:record
                },()=>{
                    context.toggleModalVisible(true)
                })
            }
            }]),
        fixed:'left',
        width:'50px',
        className:'text-center'
    },{
        title: '编码',
        dataIndex: 'mainCode',
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
        render:(text,record)=><a title='查看详情' onClick={()=>{
            context.setState({
                modalConfig:{
                    type:'view',
                    id:record.id
                },
                initData:record
            },()=>{
                context.toggleModalVisible(true)
            })
        }}>
            {text}
        </a>
    }, {
        title: '税(费)种',
        dataIndex: 'taxType',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '企业所得税'
            }
            if(text===2){
                return '增值税'
            }
            return ''
        }
    },{
        title: '所属期起',
        dataIndex: 'subordinatePeriodStart',
    },{
        title: '所属期止',
        dataIndex: 'subordinatePeriodEnd',
    },{
        title: '纳税申报',
        dataIndex: 'taxDeclarationTxt'
    },{
        title: '纳税形式',
        dataIndex: 'taxModality',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '独立纳税'
            }
            return ''
        }
    }
];

export default class DeclareParameter extends Component{
    state = {
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        id:undefined,
        initData:undefined,
        visible:false, // 控制Modal是否显示
        searchTableLoading:false,
        searchFieldsValues:{},
        modalConfig:{
            type:''
        },

    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.id,
            },
            initData: type === 'add' ? undefined : this.state.initData,
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }

    render(){
        const {tableUpDateKey,searchTableLoading,modalConfig,visible,initData} = this.state;
        return(
            <SearchTable
                spinning={searchTableLoading}
                searchOption={{
                    fields:searchFields,
                    getFieldsValues:values=>{
                        this.setState({
                            searchFieldsValues:values
                        })
                    },
                }}
                tableOption={{
                    key:tableUpDateKey,
                    columns:getColumns(this),
                    url:'/sys/declarationParam/list',
                    extra:<div>
                        {
                            composeBotton([{
                                type:'add',
                                icon:'plus',
                                userPermissions:['1111003'],
                                onClick:()=>this.showModal('add')
                            }])
                        }
                    </div>,
                    cardProps:{
                        title:'申报参数',
                    },
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} initData={initData} />
            </SearchTable>
        )
    }
}