/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React,{Component} from 'react';
import IframePage from '../IframePage.react'
import {connect} from 'react-redux'

class ReportManage extends Component {
    render() {
        //const {adminUrl,token,username,supplierId} = this.props;
        const {adminUrl} = this.props;
        return(
            <IframePage title="报表" src={`${adminUrl}`}/>
        )
        /*return (
            <Layout style={{background:'transparent'}} >
                报表管理
            </Layout>
        )*/
    }
}
//export default ReportManage

export default connect(state=>({
    /*token:state.user.token,
    username:state.user.personal.username,
    supplierId:state.user.supplier.supplierId,
    adminUrl:state.user.personal.adminUrl,*/
    adminUrl:'http://192.168.3.185:8075/WebReport/ReportServer?reportlet=WorkBook2.cpt&op=write'
}))(ReportManage)