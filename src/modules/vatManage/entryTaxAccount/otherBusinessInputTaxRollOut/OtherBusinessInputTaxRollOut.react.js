/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component} from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {SearchTable,PopUploadModal} from '../../../../compoments'
import SubmitModal from './popModal'
// import PopModal from "./popModal";
const buttonStyle = {
    margin:'0 5px'
}

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        span:6,
        fieldName:'mainId',
        fieldDecoratorOptions:{
            rules:[
            {
                required:true,
                message:'必录'
            }
            ]
        }
    },
    {
        label:'查询月份',
        fieldName:'authMonth',
        type:'monthPicker',
        span:6,
        componentProps:{
        },
        fieldDecoratorOptions:{
            rules:[
            {
                required:true,
                message:'必录'
            }
            ]
        }
    }
]
const getColumns =(context)=>[
   {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '应税项目',
        dataIndex: 'taxableNum',
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
    },{
        title: '转出项目',
        dataIndex: 'outProjectNum',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
    },{
        title: '日期',
        dataIndex: 'taxDate',
    },{
        title: '转出税额',
        dataIndex: 'outTaxAmount',
    }
];

export default class LandPriceManage extends Component{
    state={
        visible:false, // 控制Modal是否显示
        opid:"", // 当前操作的记录
        readOnly:false,
        updateKey:Date.now()
    }
    hideModal(){
        this.setState({visible:false});
    }
    render(){
        return(
            <div>
                <SearchTable
                    searchOption={{
                        fields:searchFields
                    }}
                    
                    tableOption={{
                        scroll:{x:'100%'},
                        pageSize:10,
                        columns:getColumns(this),
                        url:'/account/income/taxout/list',
                        cardProps:{
                            extra:(<div>
                                <SubmitModal
                                    title='提交'
                                    onSuccess={()=>{}}
                                ></SubmitModal>
                                <Button size='small' style={buttonStyle}><Icon type="rollback" />撤回提交</Button>
                                <Button size='small' style={buttonStyle}><Icon type="arrow-down" />下载模板</Button>
                                <PopUploadModal
                                    url="/account/income/taxout/upload"
                                    title="导入"
                                    onSuccess={()=>{
                                        console.log('导入成功')
                                        //this.updateTable()
                                    }}
                                />
                            </div>),
                            title:(<Row style={{fontSize:'12px', padding:'5px 0'}}>
                                <Col span={3}>
                                    <label>状态：</label>
                                    <span>暂存</span>
                                </Col>
                                <Col span={3}>
                                    <label>提交时间：</label>
                                    <span></span>
                                </Col>
                            </Row>)
                        }
                    }}
                >
                </SearchTable>
                {/* <PopModal 
                visible={this.state.visible} 
                readOnly={this.state.readOnly} 
                hideModal={()=>{this.hideModal()}} 
                id={this.state.opid}
                updateKey={this.state.updateKey}/> */}
            </div>
        )
    }
}