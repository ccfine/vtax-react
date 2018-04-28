
import React,{Component} from 'react'
import {message,Button,Icon,Modal} from 'antd'
import {request} from 'utils'

export default class SubmitOrRecallMutex extends Component {

    handleClickActions = action =>{
        let actionText,
            actionUrl=this.props.url;
        switch (action){
            case 'submit':
                actionText='提交';
                actionUrl=`${actionUrl}/submit`;
                this.handleRequest(actionUrl,actionText)
                break;
            case 'restore':
                actionText='撤回';
                actionUrl=`${actionUrl}/${this.props.restoreStr}`;
                this.handleRstore(actionUrl,actionText)
                break;
            default:
                break;
        }

    }

    handleRequest=(actionUrl,actionText)=>{
      const {mainId,receiveMonth} = this.props.searchFieldsValues;
      let url,params;
      if(this.props.paramsType==="string"){
        url=`${actionUrl}/${mainId}/${receiveMonth}`
        params={}
      }else{
        url=`${actionUrl}`;
        params=this.props.searchFieldsValues
      }
      this.props.toggleSearchTableLoading&&this.props.toggleSearchTableLoading(true)

      request.post(url,params)
          .then(({data})=>{
              this.props.toggleSearchTableLoading&&this.props.toggleSearchTableLoading(false)
              if(data.code===200){
                  message.success(`${actionText}成功！`);
                  this.props.refreshTable();
              }else{
                  message.error(`${actionText}失败:${data.msg}`)
              }
          }).catch(err=>{
          this.props.toggleSearchTableLoading&&this.props.toggleSearchTableLoading(false)
      })
    }

    handleRstore=(actionUrl,actionText)=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该操作为敏感操作，是否继续？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
              this.handleRequest(actionUrl,actionText)
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }

    render(){
      const {hasParam,buttonSize,dataStatus}=this.props
      return(
        <div style={{display:"inline-block"}}>
          <Button
            size={buttonSize}
            style={{marginRight:"5px"}}
            disabled={!(hasParam && (parseInt(dataStatus,0) === 1))}
             onClick={()=>{this.handleClickActions("submit")}}>
              <Icon type="check" />
                提交
          </Button>
          <Button
            size={buttonSize}
            disabled={!(hasParam && (parseInt(dataStatus,0) === 2))}
            onClick={()=>{this.handleClickActions("restore")}}>
              <Icon type="rollback"/>
              撤回提交
          </Button>
        </div>
      )
    }
}
