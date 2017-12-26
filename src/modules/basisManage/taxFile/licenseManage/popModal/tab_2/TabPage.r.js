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
    title: '项目分期代码',
    dataIndex: 'itemNum',
}, {
    title: '项目分期名称',
    dataIndex: 'itemName',
},{
    title: '土地出让合同编号',
    dataIndex: 'leaseContractId',
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
    updateTable(){
        this.setState({
            tableUpDateKey:Date.now()
        })
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
                    <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                        <Icon type="edit" />
                        修改
                    </Button>
                </div>
            }>
                <AsyncTable url={`/project/stage/list/${props.projectId}`}
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