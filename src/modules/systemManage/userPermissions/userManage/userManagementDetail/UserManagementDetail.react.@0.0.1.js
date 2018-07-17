/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { message,Icon } from "antd";
import { request,getUrlParam } from "utils";
import UserDetail from "./UserDetail.react.@0.0.1";
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class UserManagementDetail extends Component {
    state = {
        userInfo: {},
        checkedPermission: [],
        loaded: false,
        permissionLoading: true,
        allPermission: []
    };

    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    componentDidMount() {
        const userId = this.props.match.params.id;
        const orgId = getUrlParam('orgId');
        this.fetchAllPermission();
        this.fetchUserInfo(userId);
        this.fetchPermission(orgId, userId);
    }
    fetchAllPermission() {
        this.setState({ permissionLoading: true });
        request
            .get("/permissions")
            .then(({ data }) => {
                if (data.code === 200) {
                    this.setState({
                        allPermission: data.data,
                        permissionLoading: false
                    });
                } else {
                    message.error(data.msg, 4);
                    this.setState({ permissionLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message, 4);
                this.setState({ permissionLoading: false });
            });
    }
    fetchPermission(orgid, userid) {
        this.setState({ permissionLoading: true });
        request
            .get(`/sysUser/queryUserPermissions/${orgid}/${userid}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    const permissions = data.data;
                    this.mounted &&
                        this.setState({
                            permissionLoading: false,
                            checkedPermission: [
                                ...permissions.userPermissions,
                                ...permissions.rolePermissions
                            ]
                        });
                } else {
                    this.setState({ permissionLoading: false });
                    message.error(data.msg);
                }
            })
            .catch(err => {
                this.setState({ permissionLoading: false });
                message.error(err.message);
            });
    }
    fetchUserInfo(userid) {
        this.setState({
            loaded: false
        });
        request
            .get(`/sysUser/find/${userid}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    const newUserInfo = data.data;
                    this.mounted &&
                        this.setState({
                            userInfo: newUserInfo,
                            loaded: true
                        });
                } else {
                    this.setState({
                        loaded: true
                    });
                    message.error(data.msg);
                }
            })
            .catch(err => {
                this.setState({
                    loaded: true
                });
                message.error(err.message);
            });
    }
    render() {
        const {  location } = this.props;
        const {
                userInfo,
                checkedPermission,
                allPermission,
                permissionLoading,
                loaded
            } = this.state;

        return (
            <div>
                <div style={{ margin: "0px 0 6px 6px" }}>
                    <Link
                        style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12}}
                        to={{
                            pathname: location && location.pathname ? location.pathname.substring(0,location.pathname.lastIndexOf('/')) : '',
                            search:location.search,
                        }}
                    ><Icon type="left" /><span>返回</span></Link>
                </div>
                {
                    <UserDetail
                        orgId={getUrlParam('orgId')}
                        userInfo={userInfo}
                        checkedPermission={checkedPermission}
                        allPermission={allPermission}
                        permissionLoading={permissionLoading}
                        userLoading = {!loaded}
                    />
                }
            </div>
        );
    }
}

export default withRouter(UserManagementDetail);
