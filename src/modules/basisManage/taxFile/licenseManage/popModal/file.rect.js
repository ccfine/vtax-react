import React from 'react'
import {Modal,Button,Popconfirm,message,Icon} from 'antd'
import SearchTable from './SearchTableTansform.react'
import {request} from '../../../../../utils'

const getColumns = context=>[{
    title: '文件名',
    dataIndex: 'originalFileName'
  }, {
    title: '文件大小',
    dataIndex: 'size'
  }, {
    title:'操作',
        render(text, record, index){
            return(
                <span>
                <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                    <a style={{marginRight:"5px"}}>删除</a>
                </Popconfirm>
                <a onClick={()=>{
                    
                }}>下载</a>
                </span>
            );
        },
        fixed:'left',
        width:'50px',
        dataIndex:'action'
  }];

  class FileModal extends React.Component{
    state={
      dataSource:[],
      updateKey:Date.now()
    }
    update(){
      this.setState({updateKey:Date.now()})
    }
    deleteRecord(record){
        request.post(`/contract/land/file/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.setState({updateKey:Date.now()});
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(err => {
            message.error(err.message);
        })
    }
    componentWillReceiveProps(props){
          if(props.id && this.props.id !== props.id){

          }
      }
      render(){
        const props = this.props;
          return (
              <Modal
                title='附件信息'
                visible={this.props.visible}
                width='500px'
                bodyStyle={{height:"400px",overflow:"auto"}}
                onCancel={()=>{props.hideModal()}}
                footer={[
                    <Button key="close" type="primary" onClick={props.hideModal}>
                    关闭
                    </Button>,
                ]}>
                    <SearchTable
                        actionOption={{
                            body:(<Button  onClick={()=>{
                                this.setState({visible:true,action:'add',opid:undefined});
                            }}><Icon type="upload" /> 上传</Button>),
                            span:5
                        }}
                        searchOption={undefined}
                        tableOption={{
                            columns:getColumns(this),
                            url:`/contract/land/file/list/${props.id}`,
                            scroll:{x:'100%'},
                            key:this.state.updateKey,
                            cardProps:{
                                bordered:false
                            }
                        }}
                    >
                    </SearchTable>
              </Modal>
          );
      }
  }

  export default FileModal;