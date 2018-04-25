/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React, { Component } from 'react'
import {Card,Button,Icon,Modal} from 'antd'
import {SynchronizeTable} from 'compoments'
import {fMoney} from 'utils'
import PopModal from './shareholdingPopModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}

const columns = [{
    title: '股东类型',
    dataIndex: 'stockholderType',
    render:text=>parseInt(text,0) === 1 ? '我方股东' : '他方股东',
}, {
    title: '实际股东',
    dataIndex: 'realStockholder',
},{
    title: '是否代持股权',
    dataIndex: 'stockRight',
    render:text=>text=== true ? '是' : '否',
},{
    title: '登记股东',
    dataIndex: 'registeredStockholder',
},{
    title: '注册资本',
    children: [{
        title: '出资期限',
        dataIndex: 'term',
    }, {
        title: '原币币种',
        dataIndex: 'registeredCapitalCurrency',
    }, {
        title: '原币金额(万元)',
        dataIndex: 'registeredCapitalAmount',
        render:text=>fMoney(text),
    }, {
        title: '备注',
        dataIndex: 'capitalRemark',
    }],
},{
    title: '实收资本',
    children: [{
        title: '原币币种 ',
        dataIndex: 'collectionCapitalCurrency',
    }, {
        title: '原币金额(万元) ',
        dataIndex: 'collectionCapitalAmount',
        render:text=>fMoney(text),
    }],
},{
    title: '代持情况',
    dataIndex: 'situation',
},{
    title: '股东属性备注 ',
    dataIndex: 'propertyRemark',
}];

class Shareholding extends Component {

    state={
        defaultData:[],

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        selectedRowKeys:null,
        selectedRows:{},
        visible:false,
        modalConfig:{
            type:''
        },
    }
    static defaultProps={
        shareholdingKey:Date.now()+1
    }

    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setSelectedRowKeysAndselectedRows(selectedRowKeys,selectedRows);
    }

    setSelectedRowKeysAndselectedRows=(selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
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

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps){

    }
    render() {
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig} = this.state;
        const {defaultData} = this.props;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange,
            getCheckboxProps:this.getCheckboxProps
        };
        return (
                <div style={{height:'390px',overflow:'hidden',overflowY:'scroll'}}>
                    <Card title="查询结果"
                          extra={
                                  this.props.type !== 'view' ?  <div>
                                      <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                                          <Icon type="plus" />
                                          新增
                                      </Button>
                                      <Button size="small" onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                                          <Icon type="edit" />
                                          编辑
                                      </Button>
                                      <Button size="small" onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                                          <Icon type="search" />
                                          查看
                                      </Button>
                                      <Button
                                          size="small"
                                          onClick={()=>{
                                              confirm({
                                                  title: '友情提醒',
                                                  content: '该删除后将不可恢复，是否删除？',
                                                  okText: '确定',
                                                  okType: 'danger',
                                                  cancelText: '取消',
                                                  onOk:()=>{
                                                      const nowKeys = defaultData;
                                                      const keys = this.state.selectedRows;
                                                      for(let i = 0;i<nowKeys.length;i++){
                                                          for(let j = 0; j<keys.length;j++){
                                                              if(nowKeys[i] === keys[j]){
                                                                  nowKeys.splice(i,1)
                                                              }
                                                          }
                                                      }
                                                      this.props.setGdjcgDate(nowKeys);
                                                      this.setSelectedRowKeysAndselectedRows(null,{});
                                                      this.toggleModalVisible(false)

                                                  },
                                                  onCancel:()=>{
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
                                      :
                                  <div>
                                      <Button size="small" onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                                          <Icon type="search" />
                                          查看
                                      </Button>
                                  </div>

                          }
                          style={{marginTop:10}}>

                        <SynchronizeTable data={defaultData}
                                    updateKey={tableUpDateKey}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:true,
                                        bordered:true,
                                        size:'small',
                                        columns:columns,
                                        rowSelection:rowSelection
                                    }} />
                    </Card>

                    <PopModal
                        visible={visible}
                        modalConfig={modalConfig}
                        selectedRowKeys={selectedRowKeys}
                        selectedRows={selectedRows}
                        initData={defaultData}
                        toggleModalVisible={this.toggleModalVisible}
                        setGdjcgDate={this.props.setGdjcgDate.bind(this)}
                        setSelectedRowKeysAndselectedRows={this.setSelectedRowKeysAndselectedRows}
                    />
                </div>

        )
    }
}

export default Shareholding
