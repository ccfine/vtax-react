/**
 * Created by liurunbin on 2017/12/23.
 */
import React,{Component} from 'react'
import {Card,Button,Icon,Modal} from 'antd'
import PropTypes from 'prop-types'
import {AsyncTable} from '../../../../../../compoments'
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '合同编号',
    dataIndex: 'contractNum',
}, {
    title: '宗地编号',
    dataIndex: 'parcelNum',
},{
    title: '出让人',
    dataIndex: 'transferor',
},{
    title: '取得方式',
    dataIndex: 'acquireWay',
},{
    title: '项目类型',
    dataIndex: 'projectType',
},{
    title: '宗地位置',
    dataIndex: 'position',
},{
    title: '土地年限',
    dataIndex: 'landAgeLimit',
},{
    title: '土地价款',
    dataIndex: 'landPrice',
},{
    title: '建筑面积',
    dataIndex: 'coveredArea',
},{
    title: '土地面积',
    dataIndex: 'landArea',
},{
    title: '容积率',
    dataIndex: 'plotRatio',
},{
    title: '合同签订日期',
    dataIndex: 'signingDate',
}];
export default class TabPage extends Component{
    static propTypes={
        projectId:PropTypes.string.isRequired
    }
    state={

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,
        visible:false,
        modalConfig:{
            type:''
        },
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    componentWillReceiveProps(nextProps){
        if(this.props.projectId !== nextProps.projectId){
            //项目id改变则重新更新
            this.updateTable()
        }
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
                id:this.state.selectedRowKeys
            }
        })
    }
    render(){
        const {tableUpDateKey,selectedRowKeys,visible,modalConfig} = this.state;

        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        const props = this.props;
        return(
            <Card bordered={false} extra={
                <div>
                    <Button onClick={()=>this.showModal('add')} style={buttonStyle}>
                        <Icon type="file-add" />
                        新增
                    </Button>
                    <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                        <Icon type="edit" />
                        编辑
                    </Button>
                    <Button onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                        <Icon type="search" />
                        查看
                    </Button>
                    <Button
                        onClick={()=>{
                            confirm({
                                title: '友情提醒',
                                content: '该删除后将不可恢复，是否删除？',
                                okText: '确定',
                                okType: 'danger',
                                cancelText: '取消',
                                onOk() {
                                    console.log('OK');
                                },
                                onCancel() {
                                    console.log('Cancel');
                                },
                            });
                        }}
                        disabled={!selectedRowKeys}
                        type='danger'>
                        <Icon type="delete" />
                        删除
                    </Button>
                </div>
            }>
                <AsyncTable url={`/contract/land/list/${props.projectId}`}
                            updateKey={tableUpDateKey}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:true,
                                size:'middle',
                                columns:columns,
                                rowSelection:rowSelection
                            }} />
                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />

            </Card>
        )
    }
}